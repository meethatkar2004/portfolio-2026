
declare module '*.glb';
declare module '*.png';

declare module 'meshline' {
  import * as THREE from 'three';
  export class MeshLineGeometry extends THREE.BufferGeometry {
    constructor();
    setPoints(points: THREE.Vector3[] | number[]): void;
  }
  export class MeshLineMaterial extends THREE.ShaderMaterial {
    constructor(parameters?: { [key: string]: unknown });
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      meshLineGeometry: unknown;
      meshLineMaterial: unknown;
    }
  }
}
