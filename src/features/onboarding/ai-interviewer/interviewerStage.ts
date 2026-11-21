import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { clone as cloneSkinned } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { AvatarAnimator } from '@/features/onboarding/ai-interviewer/avatarAnimator';
import { AudioLipSync } from '@/features/onboarding/ai-interviewer/audioLipSync';
import { LidRig } from '@/features/onboarding/ai-interviewer/lidRig';
import type { AvatarState } from '@/features/onboarding/ai-interviewer/types';

/**
 * The 3D interviewer as a plain three.js "stage": renderer, studio lights, the rigged model and its
 * animation loop. No React here, so it can be mounted by any component (see InterviewerAvatar3D).
 *
 * The canvas is transparent: the page behind it provides the background.
 */

export const INTERVIEWER_MODEL_URL = '/models/interviewer.glb';
export const INTERVIEWER_POSTER_URL = '/models/interviewer_poster.webp';

// Skin tone used for the replacement eyelids (matches the cleaned face texture around the eyes).
const LID_SKIN = '#d79c80';
// Soft fresnel rim on the silhouette only, in the brand purple → cyan.
const RIM_LEFT = new THREE.Color('#8f74ff');
const RIM_RIGHT = new THREE.Color('#38d4ee');
const RIM_STRENGTH = 0.24;

let gltfPromise: Promise<THREE.Group> | null = null;

/** Fetch + parse the model once; later stages clone it. Safe to call early to warm the cache. */
export function loadInterviewerModel(): Promise<THREE.Group> {
  if (!gltfPromise) {
    const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
    gltfPromise = loader.loadAsync(INTERVIEWER_MODEL_URL).then((g) => g.scene);
    gltfPromise.catch(() => (gltfPromise = null)); // allow a retry after a network error
  }
  return gltfPromise;
}

function addRim(material: THREE.MeshStandardMaterial) {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uRimA = { value: RIM_LEFT };
    shader.uniforms.uRimB = { value: RIM_RIGHT };
    shader.uniforms.uRimK = { value: RIM_STRENGTH };
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform vec3 uRimA; uniform vec3 uRimB; uniform float uRimK;')
      .replace(
        '#include <opaque_fragment>',
        `float rimF = pow(1.0 - saturate(dot(normal, normalize(vViewPosition))), 3.2);
        // weaker on dark areas (hair, beard) so they don't turn purple / teal
        outgoingLight += mix(uRimA, uRimB, smoothstep(-0.5, 0.5, normal.x)) * rimF * uRimK
          * (0.25 + 0.75 * dot(diffuseColor.rgb, vec3(0.3, 0.59, 0.11)));
        #include <opaque_fragment>`,
      );
  };
}

/**
 * The GLB ships with unlit materials (the texture carries the original render's lighting).
 * Face/body: keep that texture as the base (emissive) and add real light on top for form and depth.
 * Eyes stay unlit (their painted catch-light reads best). Original lid meshes are hidden (LidRig).
 */
function upgradeInterviewerMaterials(root: THREE.Object3D) {
  root.traverse((o) => {
    const m = o as THREE.Mesh;
    if (!m.isMesh) return;
    m.frustumCulled = false; // skinned bounds don't follow morphs
    const old = m.material as THREE.MeshBasicMaterial;
    if (m.name === 'Face') {
      const mat = new THREE.MeshStandardMaterial({
        map: old.map,
        emissiveMap: old.map,
        emissive: new THREE.Color('#ffffff'),
        emissiveIntensity: 0.6,
        roughness: 0.82,
        metalness: 0,
        envMapIntensity: 0.25,
        alphaTest: old.alphaTest || 0.5,
        toneMapped: false,
      });
      addRim(mat);
      m.material = mat;
    } else if (/^Lid(Upper|Lower|Lash)[LR]$/.test(m.name)) {
      m.visible = false;
    } else if (old.isMeshBasicMaterial) {
      old.toneMapped = false;
    }
  });
}

/** Eyeball radius in world units (the geometry itself is quantized to unit space). */
function eyeRadius(root: THREE.Object3D): number {
  const eye = root.getObjectByName('EyeL') as THREE.SkinnedMesh | undefined;
  if (!eye?.isSkinnedMesh) return 0.03;
  root.updateMatrixWorld(true);
  eye.computeBoundingBox();
  const size = eye.boundingBox!.getSize(new THREE.Vector3());
  return Math.max(size.x, size.y) / 2;
}

export type InterviewerStageOptions = {
  /** Called once the first frame with the model has been drawn. */
  onReady?: () => void;
  /** Called if the model can't be loaded or WebGL fails. */
  onError?: (error: unknown) => void;
};

export class InterviewerStage {
  readonly canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(30, 1, 0.05, 30);
  private clock = new THREE.Clock();
  private envTexture: THREE.Texture;
  private resizeObserver: ResizeObserver;
  private model: THREE.Group | null = null;
  private animator: AvatarAnimator | null = null;
  private lids: LidRig | null = null;
  private lipSync = new AudioLipSync();
  private state: AvatarState = 'IDLE';
  private speakingWithoutAudio = false;
  private disposed = false;
  private readyFired = false;
  private audioEl: HTMLMediaElement | null = null;
  private onAudioPlay = () => this.lipSync.resume();
  private container: HTMLElement;
  private options: InterviewerStageOptions;

  constructor(container: HTMLElement, options: InterviewerStageOptions = {}) {
    this.container = container;
    this.options = options;
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.NeutralToneMapping;
    this.renderer.setClearColor(0x000000, 0);
    this.canvas = this.renderer.domElement;
    this.canvas.style.display = 'block';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    container.appendChild(this.canvas);

    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();
    this.scene.environment = this.envTexture;
    this.addLights();

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(container);
    this.resize();

    loadInterviewerModel()
      .then((source) => {
        if (this.disposed) return;
        this.mountModel(source);
      })
      .catch((error) => {
        if (!this.disposed) this.options.onError?.(error);
      });

    this.renderer.setAnimationLoop(() => this.frame());
  }

  /** IDLE / SPEAKING / LISTENING / THINKING / SUCCESS */
  setState(state: AvatarState) {
    this.state = state;
    this.animator?.setState(state);
  }

  /** The <audio> element playing the question; its sound drives the lip sync. */
  setAudioElement(el: HTMLMediaElement | null) {
    if (el === this.audioEl) return;
    this.audioEl?.removeEventListener('play', this.onAudioPlay);
    this.audioEl = el;
    this.lipSync.attach(el);
    el?.addEventListener('play', this.onAudioPlay);
  }

  /** True while the question is spoken without an analysable <audio> (e.g. speechSynthesis). */
  setSpeakingWithoutAudio(on: boolean) {
    this.speakingWithoutAudio = on;
  }

  dispose() {
    this.disposed = true;
    this.renderer.setAnimationLoop(null);
    this.resizeObserver.disconnect();
    this.audioEl?.removeEventListener('play', this.onAudioPlay);
    this.lids?.dispose();
    this.scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      // geometry and textures are shared with the cached source model; only per-stage materials go
      const mats = Array.isArray(m.material) ? m.material : [m.material];
      mats.forEach((mat) => mat.dispose());
    });
    this.envTexture.dispose();
    this.renderer.dispose();
    this.canvas.remove();
  }

  private addLights() {
    const key = new THREE.DirectionalLight('#fff1e4', 0.85);
    key.position.set(-0.9, 2.4, 2.2);
    const fill = new THREE.DirectionalLight('#e6e9ff', 0.32);
    fill.position.set(1.4, 1.6, 1.8);
    const back = new THREE.DirectionalLight('#d9d2ff', 0.7);
    back.position.set(0, 2.2, -2.0);
    const top = new THREE.DirectionalLight('#ffffff', 0.25);
    top.position.set(0, 4, 0.2);
    const hemi = new THREE.HemisphereLight('#efeaff', '#24163f', 0.2);
    this.scene.add(key, fill, back, top, hemi);
  }

  private mountModel(source: THREE.Group) {
    // a per-stage copy: materials and bones are per instance, geometry/textures stay shared
    const model = cloneSkinned(source) as THREE.Group;
    upgradeInterviewerMaterials(model);
    this.scene.add(model);
    this.model = model;
    this.animator = new AvatarAnimator(model);
    this.animator.setState(this.state);
    this.lids = new LidRig(model, this.scene, eyeRadius(model), LID_SKIN);
    const compile = this.renderer.compileAsync
      ? this.renderer.compileAsync(this.scene, this.camera)
      : Promise.resolve(this.renderer.compile(this.scene, this.camera));
    compile.catch(() => undefined).then(() => {
      if (this.disposed) return;
      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (this.disposed || this.readyFired) return;
        this.readyFired = true;
        this.options.onReady?.();
      }));
    });
  }

  private resize() {
    const w = Math.max(1, this.container.clientWidth);
    const h = Math.max(1, this.container.clientHeight);
    this.renderer.setSize(w, h, false);
    const aspect = w / h;
    // keep the bust framed like a video call on any aspect ratio
    const dist = aspect >= 1 ? 1.32 : (1.32 / Math.max(aspect, 0.45)) * 0.62;
    this.camera.aspect = aspect;
    this.camera.position.set(0, 1.6, dist);
    this.camera.lookAt(0, 1.56, 0);
    this.camera.updateProjectionMatrix();
  }

  private frame() {
    const dt = Math.min(this.clock.getDelta(), 0.05);
    if (this.animator && this.model) {
      const s = this.lipSync.sample();
      this.animator.setSpeech(s ? s.visemes : null, s ? s.energy : 0);
      // no analysable audio (speechSynthesis, blocked audio graph): keep the mouth alive while SPEAKING
      this.animator.setProceduralTalk(this.speakingWithoutAudio || (this.state === 'SPEAKING' && !s));
      this.animator.update(dt);
      this.model.updateMatrixWorld(true);
      this.lids?.update();
    }
    this.renderer.render(this.scene, this.camera);
  }
}
