import * as THREE from 'three';
import { getDevicePixelRatio } from './utils';
import { sceneDefaults, events } from './constants';
import { default as ThreeJsObject } from './ThreeJsObject';

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
  private observers: ThreeJsObject[];

  constructor(
    canvas: HTMLCanvasElement,
    opts: {
      isFullScreen: boolean;
      cameraProps: { fov: number; near: number; far: number };
    }
  ) {
    const { isFullScreen, cameraProps, useOrbitControls } = {
      ...sceneDefaults,
      ...opts
    };

    this.isFullScreen = isFullScreen;
    this.cameraProps = cameraProps;
    this.useOrbitControls = useOrbitControls;
    this.observers = [];

    this.scene = new THREE.Scene();
    this.canvas = canvas;

    this.clock = new THREE.Clock();

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

    this.observers.forEach((observer) => observer.update(elapsedTime));

    // Render
    this.renderer.render(this.scene, this.camera);

    // Call loop again on the next frame
    window.requestAnimationFrame(this.loop);
  }

  /**
   * Load controls.
   */
  loadControls() {
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
  addEventListeners() {
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
  }

  subscribe(obj: ThreeJsObject) {
    this.observers.push(obj);
  }

  unsubscribe(obj: ThreeJsObject) {
    this.observers = this.observers.filter((subscriber) => subscriber !== obj);
  }
}
