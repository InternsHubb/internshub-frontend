import * as THREE from 'three';
import type { AvatarState } from './types';

/**
 * Drives the interviewer rig (bones + ARKit/Oculus blendshapes) every frame:
 * breathing, head motion, blinking, saccades, state expressions and the mouth.
 * Plain three.js – no React – so it can run in any render loop.
 */

export type VisemeWeights = Partial<Record<string, number>>;

const VISEMES = [
  'viseme_sil', 'viseme_PP', 'viseme_FF', 'viseme_TH', 'viseme_DD', 'viseme_kk', 'viseme_CH',
  'viseme_SS', 'viseme_nn', 'viseme_RR', 'viseme_aa', 'viseme_E', 'viseme_I', 'viseme_O', 'viseme_U',
];
const FACE_KEYS = [
  ...VISEMES, 'jawOpen', 'mouthSmile', 'mouthFrown', 'mouthPucker', 'mouthWide', 'mouthClose',
  'browInnerUp', 'browDownLeft', 'browDownRight', 'browOuterUpLeft', 'browOuterUpRight',
  'eyeBlinkLeft', 'eyeBlinkRight', 'eyeSquintLeft', 'eyeSquintRight',
];

/** radians the upper / lower lid rotate to close the eye */
const UPPER_LID_CLOSE = 0.925;
const LOWER_LID_CLOSE = 0.62;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
/** frame-rate independent exponential approach */
const damp = (cur: number, target: number, speed: number, dt: number) =>
  cur + (target - cur) * (1 - Math.exp(-speed * dt));
/** smooth pseudo-noise from a few incommensurate sines, range ~[-1, 1] */
const wobble = (t: number, seed: number) =>
  (Math.sin(t * 0.73 + seed) * 0.5 + Math.sin(t * 1.37 + seed * 2.1) * 0.3 + Math.sin(t * 2.71 + seed * 3.7) * 0.2);
const rand = (a: number, b: number) => a + Math.random() * (b - a);

interface RigBone {
  bone: THREE.Bone;
  restLocal: THREE.Quaternion;
  restWorld: THREE.Quaternion;
  restWorldInv: THREE.Quaternion;
}

const _q = new THREE.Quaternion();
const _e = new THREE.Euler();

export class AvatarAnimator {
  private meshes: THREE.Mesh[] = [];
  private bones = new Map<string, RigBone>();
  private weights: Record<string, number> = {};
  private targets: Record<string, number> = {};
  private state: AvatarState = 'IDLE';
  private stateTime = 0;
  private time = 0;

  // speech input
  private speech: VisemeWeights | null = null;
  private speechEnergy = 0;
  private lastEnergy = 0;
  private emphasis = 0;
  private proceduralTalk = false;
  /** debug: force the blink amount (0..1); negative = automatic */
  debugBlink = -1;
  private syllableTimer = 0;
  private syllable: VisemeWeights = {};

  // blinking
  private nextBlink = rand(1.5, 3.5);
  private blinkT = -1;
  private doubleBlink = false;

  // gaze (yaw, pitch in radians; +yaw = character's left, +pitch = down)
  private gaze = new THREE.Vector2();
  private gazeTarget = new THREE.Vector2();
  private nextSaccade = 0.8;

  // head
  private head = new THREE.Vector3();
  private nod = 0;
  private nextNod = 2.5;

  constructor(root: THREE.Object3D) {
    root.updateMatrixWorld(true);
    const rootInv = root.getWorldQuaternion(new THREE.Quaternion()).invert();
    root.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh && m.morphTargetDictionary && m.morphTargetInfluences) this.meshes.push(m);
      const b = o as THREE.Bone;
      if (b.isBone) {
        const restWorld = rootInv.clone().multiply(b.getWorldQuaternion(new THREE.Quaternion()));
        this.bones.set(b.name, {
          bone: b,
          restLocal: b.quaternion.clone(),
          restWorld,
          restWorldInv: restWorld.clone().invert(),
        });
      }
    });
    for (const k of FACE_KEYS) {
      this.weights[k] = 0;
      this.targets[k] = 0;
    }
  }

  get hasRig() {
    return this.bones.has('Head') && this.meshes.length > 0;
  }

  setState(s: AvatarState) {
    if (s !== this.state) {
      this.state = s;
      this.stateTime = 0;
      if (s === 'THINKING') this.gazeTarget.set(rand(-0.15, -0.1), rand(-0.12, -0.08));
      if (s === 'LISTENING') this.nextNod = rand(0.8, 2);
    }
  }

  /** Visemes measured from the real audio (null when no audio is analysed). */
  setSpeech(v: VisemeWeights | null, energy = 0) {
    this.speech = v;
    this.speechEnergy = energy;
  }

  /** Talk without audio analysis (e.g. browser speechSynthesis). */
  setProceduralTalk(on: boolean) {
    this.proceduralTalk = on;
  }

  /** Rotate a bone by an euler (x pitch, y yaw, z roll) expressed in the character's root space. */
  private rotate(name: string, x: number, y: number, z: number) {
    const rb = this.bones.get(name);
    if (!rb) return;
    _q.setFromEuler(_e.set(x, y, z, 'YXZ'));
    // local offset = W0^-1 * R * W0, applied on top of the rest pose
    const off = rb.restWorldInv.clone().multiply(_q).multiply(rb.restWorld);
    rb.bone.quaternion.copy(rb.restLocal).multiply(off);
  }

  update(dt: number) {
    dt = Math.min(dt, 0.1);
    this.time += dt;
    this.stateTime += dt;
    const t = this.time;
    const st = this.state;
    const speaking = st === 'SPEAKING';
    const T = this.targets;
    for (const k of FACE_KEYS) T[k] = 0;

    // ------------------------------------------------------------- mouth
    let energy = 0;
    if (speaking && this.speech) {
      for (const [k, v] of Object.entries(this.speech)) T[k] = v ?? 0;
      energy = this.speechEnergy;
    } else if (speaking && this.proceduralTalk) {
      this.syllableTimer -= dt;
      if (this.syllableTimer <= 0) {
        this.syllableTimer = rand(0.09, 0.2);
        const pause = Math.random() < 0.08;
        const pick = ['viseme_aa', 'viseme_E', 'viseme_O', 'viseme_I', 'viseme_U', 'viseme_DD', 'viseme_SS', 'viseme_nn', 'viseme_PP'];
        const a = pick[(Math.random() * pick.length) | 0];
        this.syllable = pause ? {} : { [a]: rand(0.35, 0.7), viseme_aa: a === 'viseme_aa' ? rand(0.45, 0.7) : rand(0, 0.22) };
        if (pause) this.syllableTimer = rand(0.18, 0.35);
      }
      for (const [k, v] of Object.entries(this.syllable)) T[k] = v ?? 0;
      energy = Object.keys(this.syllable).length ? 0.6 : 0;
    }
    // emphasis: rising energy -> brows + small nod
    const rise = energy - this.lastEnergy;
    this.lastEnergy = damp(this.lastEnergy, energy, 8, dt);
    this.emphasis = damp(this.emphasis, rise > 0.12 ? 1 : 0, rise > 0.12 ? 12 : 2.5, dt);

    // ------------------------------------------------------------- expression per state
    const s = this.stateTime;
    switch (st) {
      case 'SPEAKING':
        T.mouthSmile += 0.18 + 0.08 * wobble(t * 0.5, 4);
        T.browInnerUp += 0.15 + 0.45 * this.emphasis;
        T.browOuterUpLeft += 0.1 * this.emphasis;
        T.browOuterUpRight += 0.12 * this.emphasis;
        break;
      case 'LISTENING':
        T.mouthSmile += 0.32 + 0.06 * wobble(t * 0.3, 9);
        T.browInnerUp += 0.12;
        T.eyeSquintLeft += 0.12;
        T.eyeSquintRight += 0.12;
        break;
      case 'THINKING':
        T.mouthPucker += 0.18;
        T.mouthSmile += 0.05;
        T.browDownLeft += 0.35;
        T.browOuterUpRight += 0.35;
        T.eyeSquintLeft += 0.2;
        break;
      case 'SUCCESS':
        T.mouthSmile += 0.85;
        T.eyeSquintLeft += 0.35;
        T.eyeSquintRight += 0.35;
        T.browInnerUp += 0.2;
        break;
      default:
        T.mouthSmile += 0.22;
    }

    // ------------------------------------------------------------- blink
    this.nextBlink -= dt;
    if (this.blinkT < 0 && this.nextBlink <= 0) {
      this.blinkT = 0;
      this.doubleBlink = Math.random() < 0.15;
      this.nextBlink = speaking ? rand(1.8, 4.2) : rand(2.4, 5.6);
    }
    let blink = 0;
    if (this.blinkT >= 0) {
      this.blinkT += dt;
      const b = this.blinkT;
      const close = 0.07, hold = 0.035, open = 0.12;
      if (b < close) blink = b / close;
      else if (b < close + hold) blink = 1;
      else if (b < close + hold + open) blink = 1 - (b - close - hold) / open;
      else if (this.doubleBlink) {
        this.doubleBlink = false;
        this.blinkT = 0;
      } else this.blinkT = -1;
    }

    // ------------------------------------------------------------- gaze & saccades
    this.nextSaccade -= dt;
    if (this.nextSaccade <= 0) {
      if (st === 'THINKING' && s < 3.5) {
        this.gazeTarget.set(rand(-0.16, -0.09), rand(-0.13, -0.06));
        this.nextSaccade = rand(1.1, 2.2);
      } else if (speaking && Math.random() < 0.18) {
        this.gazeTarget.set(rand(-0.09, 0.09), rand(-0.05, 0.02)); // glance away while thinking aloud
        this.nextSaccade = rand(0.4, 0.9);
      } else {
        this.gazeTarget.set(rand(-0.03, 0.03), rand(-0.02, 0.02)); // micro-saccade around the candidate
        this.nextSaccade = rand(0.9, 2.6);
      }
    }
    this.gaze.x = damp(this.gaze.x, this.gazeTarget.x, 16, dt);
    this.gaze.y = damp(this.gaze.y, this.gazeTarget.y, 16, dt);
    if (this.debugBlink >= 0) blink = this.debugBlink;
    T.eyeBlinkLeft = Math.max(T.eyeBlinkLeft, blink);
    T.eyeBlinkRight = Math.max(T.eyeBlinkRight, blink);

    // ------------------------------------------------------------- apply blendshapes
    for (const k of FACE_KEYS) {
      const isBlink = k.startsWith('eyeBlink');
      const isMouth = k.startsWith('viseme') || k.startsWith('jaw') || k === 'mouthClose';
      const speed = isBlink ? 45 : isMouth ? (this.speech ? 24 : 13) : 4;
      this.weights[k] = damp(this.weights[k], clamp01(T[k]), speed, dt);
    }
    for (const m of this.meshes) {
      const dict = m.morphTargetDictionary!;
      const inf = m.morphTargetInfluences!;
      for (const k in dict) {
        const w = this.weights[k];
        if (w !== undefined) inf[dict[k]] = w;
      }
    }

    // ------------------------------------------------------------- head, neck, breathing
    const amp = speaking ? 1 : st === 'LISTENING' ? 0.6 : 0.45;
    let hx = 0.022 * amp * wobble(t * 0.7, 1) + 0.03 * this.emphasis * (speaking ? 1 : 0);
    let hy = 0.04 * amp * wobble(t * 0.45, 2);
    let hz = 0.02 * amp * wobble(t * 0.5, 3);
    if (st === 'LISTENING') {
      this.nextNod -= dt;
      if (this.nextNod <= 0) {
        this.nod = 1;
        this.nextNod = rand(2.5, 5);
      }
      hz += 0.035; // attentive head tilt
    }
    if (st === 'THINKING') {
      hx += -0.03;
      hy += -0.06;
      hz += 0.04;
    }
    if (st === 'SUCCESS') hx += 0.03;
    this.nod = Math.max(0, this.nod - dt * 1.6);
    hx += 0.06 * Math.sin((1 - this.nod) * Math.PI * 2) * (this.nod > 0 ? this.nod : 0);
    // the head also turns slightly toward where the eyes look
    hy += this.gaze.x * 0.25;
    hx += this.gaze.y * 0.18;
    this.head.x = damp(this.head.x, hx, 3, dt);
    this.head.y = damp(this.head.y, hy, 3, dt);
    this.head.z = damp(this.head.z, hz, 3, dt);

    this.rotate('Head', this.head.x * 0.65, this.head.y * 0.65, this.head.z * 0.65);
    this.rotate('Neck', this.head.x * 0.35, this.head.y * 0.35, this.head.z * 0.35);

    const breath = Math.sin((t / 4.2) * Math.PI * 2);
    this.rotate('UpperChest', -0.012 * breath, 0.01 * wobble(t * 0.3, 5), 0);
    this.rotate('Chest', -0.006 * breath, 0, 0.004 * wobble(t * 0.25, 6));
    this.rotate('LeftShoulder', 0, 0, 0.012 * breath);
    this.rotate('RightShoulder', 0, 0, -0.012 * breath);

    // eyes: world yaw around +Y, pitch around +X (+ = down)
    this.rotate('LeftEye', this.gaze.y, this.gaze.x, 0);
    this.rotate('RightEye', this.gaze.y, this.gaze.x, 0);

    // eyelids are bones rotating around the eye centre (exact sliding over the eyeball)
    for (const side of ['Left', 'Right'] as const) {
      const b = this.weights['eyeBlink' + side];
      const sq = this.weights['eyeSquint' + side];
      const follow = this.gaze.y * 0.55; // lids follow vertical gaze
      this.rotate(side + 'UpperLid', Math.min(UPPER_LID_CLOSE, UPPER_LID_CLOSE * b + 0.2 * sq + follow), this.gaze.x * 0.2, 0);
      this.rotate(side + 'LowerLid', -Math.min(LOWER_LID_CLOSE, LOWER_LID_CLOSE * b + 0.18 * sq) + follow * 0.3, this.gaze.x * 0.2, 0);
    }
  }
}
