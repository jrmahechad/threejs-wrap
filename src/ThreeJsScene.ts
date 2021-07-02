import * as THREE from 'three';
import { getDevicePixelRatio } from './utils';
import { sceneDefaults, events } from './constants';

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

    this.scene = new THREE.Scene();
    this.canvas = canvas;

    this.clock = new THREE.Clock();

    this.rendererSizes = this.buildSizes();

    this.renderer = this.buildRenderer();

    this.camera = this.buildCamera();

    this.addEventListeners();

    this.loop = this.loop.bind(this);
  }

  //static THREE instance
  public get THREE() {
    return THREE;
  }

  start() {
    this.renderer.render(this.scene, this.camera);
    this.loop();
    this.loadControls();
  }

  buildRenderer(): THREE.WebGLRenderer {
    const renderer = new THREE.WebGLRenderer({
      canvas: this.canvas
    });
    renderer.setSize(this.rendererSizes.width, this.rendererSizes.height);
    renderer.setPixelRatio(getDevicePixelRatio());
    return renderer;
  }

  buildSizes() {
    console.log(this.isFullScreen);

    const sizes = this.isFullScreen
      ? {
          width: window.innerWidth,
          height: window.innerHeight
        }
      : {
          width: this.canvas.offsetWidth,
          height: this.canvas.offsetHeight
        };

    console.log(sizes);

    return sizes;
  }

  buildCamera(): THREE.PerspectiveCamera {
    const camera = new THREE.PerspectiveCamera(
      this.cameraProps.fov,
      this.rendererSizes.width / this.rendererSizes.height,
      this.cameraProps.near,
      this.cameraProps.far
    );
    return camera;
  }

  add(obj: any) {
    this.scene.add(obj);
  }

  loop() {
    const elapsedTime = this.clock.getElapsedTime();

    // Update controls
    if (this.controls) {
      this.controls.update();
    }

    // Render
    this.renderer.render(this.scene, this.camera);

    // Call loop again on the next frame
    window.requestAnimationFrame(this.loop);
  }

  loadControls() {
    if (this.useOrbitControls) {
      import('three/examples/jsm/controls/OrbitControls.js').then(
        ({ OrbitControls }) => {
          console.log(OrbitControls);
          // Controls
          this.controls = new OrbitControls(this.camera, this.canvas);
          this.controls.enableDamping = true;
        }
      );
    }
  }

  addEventListeners() {
    window.addEventListener(events.RESIZE, () => {
      const newSizes = this.buildSizes();
      console.log(this.rendererSizes);

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
}
