import { Object3D } from 'three';
import * as THREE from 'three';

interface BaseObject {
  create(): Object3D;
  update(elapsedTime: number): void;
}

/**
 *
 */
export default class ThreeJSObject implements BaseObject {
  public object3d: Object3D;
  public params: Object;
  private THREE: Object;

  constructor(params = {}) {
    this.params = params;
    this.THREE = THREE;
    this.object3d = this.create();
  }

  /**
   * Override to create Object3D
   */
  create(): Object3D {
    throw new Error('ThreeJSObject must have a create method');
  }

  /**
   * Override to define animations
   */
  update(elapsedTime: number): void {}
}
