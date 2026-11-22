import * as THREE from 'three';

/**
 * Eyelids drawn as a sphere just outside each eyeball, cut by a plane that follows the rig's lid
 * bones (which AvatarAnimator rotates for blinks, squints and vertical gaze).
 *
 * Why: the lid meshes shipped in the GLB are narrower than the eye opening and were vertex-coloured
 * from the old texture, so a closing lid showed eye-white at the corners and a dark brown shell.
 * A clipped sphere always spans the whole opening and takes the current skin tone.
 * The original Lid* meshes are hidden by `upgradeInterviewerMaterials`.
 */

const UPPER_FULL = 0.925; // radians the rig rotates the upper lid to close (see avatarAnimator)
const LOWER_FULL = 0.62;
const OPEN_ELEVATION = 0.95; // cut-plane elevation (rad) when open: above / below the eye opening
const SHUT_ELEVATION = -0.08; // where the two lids meet, slightly below the eye centre

type Part = {
  eye: THREE.Object3D;
  lid: THREE.Object3D;
  restInv: THREE.Quaternion;
  upper: boolean;
  mesh: THREE.Mesh;
  uniforms: { uC: THREE.IUniform<THREE.Vector3>; uN: THREE.IUniform<THREE.Vector3>; uLash: THREE.IUniform<number> };
};

export class LidRig {
  private parts: Part[] = [];
  private head: THREE.Object3D;
  private headRestInv: THREE.Quaternion;
  private group = new THREE.Group();
  private q = new THREE.Quaternion();
  private dq = new THREE.Quaternion();
  private n = new THREE.Vector3();

  /** @param radius eyeball radius in world units (the lid sphere is slightly larger) */
  constructor(root: THREE.Object3D, parent: THREE.Object3D, radius: number, skin: THREE.ColorRepresentation) {
    const find = (name: string) => {
      const o = root.getObjectByName(name);
      if (!o) throw new Error(`Interviewer rig is missing "${name}"`);
      return o;
    };
    root.updateMatrixWorld(true);
    this.head = find('Head');
    this.headRestInv = this.head.getWorldQuaternion(new THREE.Quaternion()).invert();
    const geometry = new THREE.SphereGeometry(radius * 1.07, 48, 32);

    for (const side of ['Left', 'Right'] as const) {
      for (const upper of [true, false]) {
        const lid = find(side + (upper ? 'UpperLid' : 'LowerLid'));
        const uniforms = {
          uC: { value: new THREE.Vector3() },
          uN: { value: new THREE.Vector3() },
          uLash: { value: upper ? 1 : 0.35 },
        };
        const material = new THREE.MeshStandardMaterial({
          color: skin,
          emissive: skin,
          emissiveIntensity: 0.6,
          roughness: 0.7,
          toneMapped: false,
        });
        material.onBeforeCompile = (shader) => {
          Object.assign(shader.uniforms, uniforms);
          shader.vertexShader = shader.vertexShader
            .replace('#include <common>', '#include <common>\nvarying vec3 vLidWorld;')
            .replace('#include <project_vertex>', '#include <project_vertex>\nvLidWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;');
          shader.fragmentShader = shader.fragmentShader
            .replace('#include <common>', '#include <common>\nvarying vec3 vLidWorld; uniform vec3 uC; uniform vec3 uN; uniform float uLash;')
            .replace(
              '#include <clipping_planes_fragment>',
              `#include <clipping_planes_fragment>
              float lidD = dot(normalize(vLidWorld - uC), uN);
              if (lidD < 0.0) discard;`,
            )
            .replace(
              '#include <opaque_fragment>',
              `outgoingLight = mix(outgoingLight * 0.82, outgoingLight, smoothstep(0.0, 0.35, lidD));
              outgoingLight = mix(vec3(0.05, 0.03, 0.03), outgoingLight, mix(1.0, smoothstep(0.035, 0.09, lidD), uLash));
              #include <opaque_fragment>`,
            );
        };
        const mesh = new THREE.Mesh(geometry, material);
        mesh.frustumCulled = false;
        this.group.add(mesh);
        this.parts.push({ eye: find(side + 'Eye'), lid, restInv: lid.quaternion.clone().invert(), upper, mesh, uniforms });
      }
    }
    parent.add(this.group);
  }

  set visible(v: boolean) {
    this.group.visible = v;
  }

  /** Call after AvatarAnimator.update() and after the model's world matrices are up to date. */
  update() {
    this.dq.copy(this.head.getWorldQuaternion(this.q)).multiply(this.headRestInv);
    for (const p of this.parts) {
      p.eye.getWorldPosition(p.mesh.position);
      p.uniforms.uC.value.copy(p.mesh.position);
      // how far the rig has closed this lid: angle between its rest and current local rotation
      const w = Math.abs(this.q.copy(p.restInv).multiply(p.lid.quaternion).w);
      const closed = Math.min(1, (2 * Math.acos(Math.min(1, w))) / (p.upper ? UPPER_FULL : LOWER_FULL));
      const el = p.upper
        ? OPEN_ELEVATION - (OPEN_ELEVATION - SHUT_ELEVATION) * closed
        : -OPEN_ELEVATION + (OPEN_ELEVATION + SHUT_ELEVATION) * closed;
      // cut-plane normal in head space (+Z forward, +Y up), pointing to the side that is kept
      this.n.set(0, Math.cos(el), -Math.sin(el));
      if (!p.upper) this.n.negate();
      p.uniforms.uN.value.copy(this.n.applyQuaternion(this.dq));
    }
  }

  dispose() {
    this.group.removeFromParent();
    const geometries = new Set<THREE.BufferGeometry>();
    for (const p of this.parts) {
      geometries.add(p.mesh.geometry);
      (p.mesh.material as THREE.Material).dispose();
    }
    geometries.forEach((g) => g.dispose());
  }
}
