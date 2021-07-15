import * as THREE from 'three';
import { default as ThreeJsObject } from './ThreeJsObject';
import { default as MouseManager } from './MouseManager';

export default class SelectionManager {
  public raycaster: THREE.Raycaster;
  private selectableObjects: ThreeJsObject[];
  public camera: THREE.PerspectiveCamera;

  constructor(camera: THREE.PerspectiveCamera) {
    this.raycaster = new THREE.Raycaster();
    this.selectableObjects = [];
    this.camera = camera;
  }

  /**
   * Adds a element to the selectable observer
   * @param obj
   */
  selectable(obj: ThreeJsObject) {
    this.selectableObjects.push(obj);
  }

  /**
   * Removes a element from the selectable observer
   * @param obj
   */
  stopSelectable(obj: ThreeJsObject) {
    this.selectableObjects = this.selectableObjects.filter(
      (subscriber) => subscriber !== obj
    );
  }

  /**
   * Check selectable objects (Only one can be selected)
   */
  checkSelectableObjects(mouse: THREE.Vector2) {
    if (this.selectableObjects.length && this.raycaster) {
      this.raycaster.setFromCamera(mouse, this.camera);
      let minDistance = Number.MAX_SAFE_INTEGER;
      let selectedObject: ThreeJsObject | undefined;

      this.selectableObjects.forEach((observer) => {
        const intersects = this.raycaster.intersectObject(observer.object3d);

        observer.offIntersect();

        if (intersects?.length && intersects[0].distance < minDistance) {
          minDistance = intersects[0].distance;
          selectedObject = observer;
        }
      });

      if (selectedObject) {
        selectedObject.onIntersect();
      }
    }
  }
}
