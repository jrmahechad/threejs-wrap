import * as THREE from 'three';

export default class MouseManager {
  public mouse: THREE.Vector2;
  public mouseMoving: boolean;
  private mouseStopTime: number;
  private mouseMoveTimeout: number;

  constructor() {
    this.mouse = new THREE.Vector2();
    this.mouseStopTime = 300;
    this.mouseMoveTimeout = 0;
    this.mouseMoving = false;
  }

  handleMouseMove(rendererSizes: { width: number; height: number }) {
    const mouseEvent = event as MouseEvent;
    this.mouse.x = (mouseEvent.clientX / rendererSizes.width) * 2 - 1;
    this.mouse.y = -(mouseEvent.clientY / rendererSizes.height) * 2 + 1;

    this.mouseMoving = true;

    if (this.mouseMoveTimeout) {
      clearTimeout(this.mouseMoveTimeout);
    }

    this.mouseMoveTimeout = window.setTimeout(() => {
      this.mouseMoving = false;
      clearTimeout(this.mouseMoveTimeout);
    }, this.mouseMoveTimeout);
  }
}
