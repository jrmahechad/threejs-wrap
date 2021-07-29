import * as THREE from 'three';
import { getDevicePixelRatio } from './utils';
import { sceneDefaults, events } from './constants';
import { default as ThreeJsObject } from './ThreeJsObject';
import { default as SelectionManager } from './SelectionManager';
import { default as TweakManager, DebugObject } from './TweakManager';

import { default as MouseManager } from './MouseManager';
import { default as AnimationMixer } from './AnimationMixer';

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
  public mouseManager?: MouseManager;
  public debug: boolean;
  public tweakManager?: TweakManager;
  public animationMixer?: AnimationMixer;

  public selectionMananer?: SelectionManager;

  private animatedObjects: ThreeJsObject[];

  private previousTime: number;
  private lastUpdated: number;

  constructor(
    canvas: HTMLCanvasElement,
    opts: {
      isFullScreen: boolean;
      cameraProps: { fov: number; near: number; far: number };
      trackMouse: boolean;
      debug: boolean;
    }
  ) {
    const { isFullScreen, cameraProps, useOrbitControls, trackMouse, debug } = {
      ...sceneDefaults,
      ...opts
    };

    this.isFullScreen = isFullScreen;
    this.cameraProps = cameraProps;
    this.useOrbitControls = useOrbitControls;
    this.debug = debug;
    this.animatedObjects = [];
    this.previousTime = 0;
    this.lastUpdated = 0;

    this.scene = new THREE.Scene();
    this.canvas = canvas;

    this.clock = new THREE.Clock();

    if (this.debug) {
      this.tweakManager = new TweakManager();
    }

    this.rendererSizes = this.buildSizes();

    this.renderer = this.buildRenderer();

    this.camera = this.buildCamera();

    this.loop = this.loop.bind(this);

    if (trackMouse) {
      this.selectionMananer = new SelectionManager(this.camera);
      this.mouseManager = new MouseManager();
    }

    this.addEventListeners();
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

  setAnimationMixer(mixer: AnimationMixer) {
    this.animationMixer = mixer;
  }

  /**
   * The animation loop.
   */
  loop() {
    const elapsedTime = this.clock.getElapsedTime();
    const deltaTime = elapsedTime - this.previousTime;
    this.previousTime = elapsedTime;

    // Update controls
    if (this.controls) {
      this.controls.update();
    }

    if (
      this.selectionMananer &&
      this.mouseManager &&
      this.mouseManager.mouseMoving
    ) {
      this.selectionMananer.checkSelectableObjects(this.mouseManager.mouse);
    }

    // TODO: Handle change animations

    if (this.animationMixer) {
      if (this.animationMixer) {
        this.animationMixer.update(deltaTime);
      }
    }

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

  /**
   * Adds a element to the animation observer
   * @param obj
   */
  animate(obj: ThreeJsObject) {
    this.animatedObjects.push(obj);
  }

  /**
   * Removes a element from the animation observer
   * @param obj
   */
  stopAnimate(obj: ThreeJsObject) {
    this.animatedObjects = this.animatedObjects.filter(
      (subscriber) => subscriber !== obj
    );
  }

  /**
   * Adds a element to the selectable observer
   * @param obj
   */
  selectable(obj: ThreeJsObject) {
    if (!this.selectionMananer) {
      throw Error('Please enable trackMouse flag on the scene');
    }
    this.selectionMananer.selectable(obj);
  }

  /**
   * Removes a element from the selectable observer
   * @param obj
   */
  stopSelectable(obj: ThreeJsObject) {
    if (!this.selectionMananer) {
      throw Error('Please enable trackMouse flag on the scene');
    }
    this.selectionMananer.stopSelectable(obj);
  }

  /**
   * Add properties to the debugElements array
   * @param properties
   */
  addToDebug(properties: DebugObject[]) {
    if (!this.debug) {
      throw new Error('Please enable debug for the scene');
    }

    this.tweakManager?.add(properties);
  }
}
