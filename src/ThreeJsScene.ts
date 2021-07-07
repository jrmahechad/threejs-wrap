import * as THREE from 'three';
import { getDevicePixelRatio } from './utils';
import { sceneDefaults, events } from './constants';
import { default as ThreeJsObject } from './ThreeJsObject';
import { default as MouseManager } from './MouseManager';

/**
 * Wrapper for the ThreeJs Scene.
 */
export default class ThreeJsScene {
  public scene: THREE.Scene;
  public renderer: THREE.WebGLRenderer;
  public canvas: HTMLCanvasElement;
  public rendererSizes: { width: number; height: number };
  public isFullScreen: boolean;
  public camera: THREE.PerspectiveCamera;
  public cameraProps: { fov: number; near: number; far: number };
  public clock: THREE.Clock;
  public controls: any;
  public useOrbitControls: boolean;
  public raycaster: THREE.Raycaster | undefined;
  public mouseManager: MouseManager | undefined;

  private animatedObjects: ThreeJsObject[];
  private selectableObjects: ThreeJsObject[];

  constructor(
    canvas: HTMLCanvasElement,
    opts: {
      isFullScreen: boolean;
      cameraProps: { fov: number; near: number; far: number };
      trackMouse: boolean;
    }
  ) {
    const { isFullScreen, cameraProps, useOrbitControls, trackMouse } = {
      ...sceneDefaults,
      ...opts
    };

    this.isFullScreen = isFullScreen;
    this.cameraProps = cameraProps;
    this.useOrbitControls = useOrbitControls;
    this.animatedObjects = [];
    this.selectableObjects = [];

    this.scene = new THREE.Scene();
    this.canvas = canvas;

    this.clock = new THREE.Clock();

    if (trackMouse) {
      this.raycaster = new THREE.Raycaster();
      this.mouseManager = new MouseManager();
    }

    this.rendererSizes = this.buildSizes();

    this.renderer = this.buildRenderer();

    this.camera = this.buildCamera();

    this.addEventListeners();

    this.loop = this.loop.bind(this);
  }

  /**
   * Returns THREE library
   */
  public get THREE() {
    return THREE;
  }

  /**
   * Starts the scene.
   */
  start() {
    this.renderer.render(this.scene, this.camera);
    this.loop();
    this.loadControls();
  }

  /**
   * Builds the renderer.
   * @returns
   */
  buildRenderer(): THREE.WebGLRenderer {
    const renderer = new THREE.WebGLRenderer({
      canvas: this.canvas
    });
    renderer.setSize(this.rendererSizes.width, this.rendererSizes.height);
    renderer.setPixelRatio(getDevicePixelRatio());
    return renderer;
  }

  /**
   * Builds the sizes.
   * @returns
   */
  buildSizes() {
    const sizes = this.isFullScreen
      ? {
          width: window.innerWidth,
          height: window.innerHeight
        }
      : {
          width: this.canvas.offsetWidth,
          height: this.canvas.offsetHeight
        };

    return sizes;
  }

  /**
   * Builds the camera.
   * @returns
   */
  buildCamera(): THREE.PerspectiveCamera {
    const camera = new THREE.PerspectiveCamera(
      this.cameraProps.fov,
      this.rendererSizes.width / this.rendererSizes.height,
      this.cameraProps.near,
      this.cameraProps.far
    );
    return camera;
  }

  /**
   * Adds an object to the scene.
   * @param obj
   */
  add(obj: any) {
    if (obj instanceof ThreeJsObject) {
      this.scene.add(obj.object3d);
      return;
    }

    this.scene.add(obj);
  }

  /**
   * The animation loop.
   */
  loop() {
    const elapsedTime = this.clock.getElapsedTime();

    // Update controls
    if (this.controls) {
      this.controls.update();
    }

    this.checkSelectableObjects();

    this.checkAnimatedObjects(elapsedTime);

    // Render
    this.renderer.render(this.scene, this.camera);

    // Call loop again on the next frame
    window.requestAnimationFrame(this.loop);
  }

  /**
   * Check animated objects
   * @param elapsedTime
   */
  private checkAnimatedObjects(elapsedTime: number) {
    this.animatedObjects.forEach((observer) => {
      observer.update(elapsedTime);
    });
  }

  /**
   * Check selectable objects (Only one can be selected)
   */
  private checkSelectableObjects() {
    if (
      this.selectableObjects.length &&
      this.mouseManager &&
      this.raycaster &&
      this.mouseManager?.mouseMoving
    ) {
      this.raycaster.setFromCamera(this.mouseManager.mouse, this.camera);
      let minDistance = Number.MAX_SAFE_INTEGER;
      let selectedObject: ThreeJsObject | undefined;

      this.selectableObjects.forEach((observer) => {
        const intersects = this.raycaster?.intersectObject(observer.object3d);
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

  /**
   * Load controls.
   */
  private loadControls() {
    if (this.useOrbitControls) {
      import('three/examples/jsm/controls/OrbitControls.js').then(
        ({ OrbitControls }) => {
          // Controls
          this.controls = new OrbitControls(this.camera, this.canvas);
          this.controls.enableDamping = true;
        }
      );
    }
  }

  /**
   * Adds event listeners.
   */
  private addEventListeners() {
    window.addEventListener(events.RESIZE, () => {
      const newSizes = this.buildSizes();

      if (
        newSizes.width === this.rendererSizes.width &&
        newSizes.height === this.rendererSizes.height
      ) {
        return;
      }
      this.rendererSizes = { ...newSizes };

      // Update camera
      this.camera.aspect = this.rendererSizes.width / this.rendererSizes.height;
      this.camera.updateProjectionMatrix();

      if (this.rendererSizes)
        // Update renderer
        this.renderer.setSize(
          this.rendererSizes.width,
          this.rendererSizes.height
        );
      this.renderer.setPixelRatio(getDevicePixelRatio());
    });

    if (this.mouseManager) {
      this.canvas.addEventListener(events.MOUSEMOVE, (event) => {
        this.mouseManager?.handleMouseMove(this.rendererSizes);
      });
    }
  }

  animate(obj: ThreeJsObject) {
    this.animatedObjects.push(obj);
  }

  stopAnimate(obj: ThreeJsObject) {
    this.animatedObjects = this.animatedObjects.filter(
      (subscriber) => subscriber !== obj
    );
  }

  selectable(obj: ThreeJsObject) {
    this.selectableObjects.push(obj);
  }

  stopSelectable(obj: ThreeJsObject) {
    this.selectableObjects = this.selectableObjects.filter(
      (subscriber) => subscriber !== obj
    );
  }
}
