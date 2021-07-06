import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

/**
 * Wrapper for
 */
export default class ThreeJsGLTFLoader {
  private static instance: ThreeJsGLTFLoader;
  private gltfLoader: GLTFLoader;
  private dracoLoader: DRACOLoader | null;

  constructor() {
    this.gltfLoader = new GLTFLoader();
    this.dracoLoader = null;
  }

  /**
   * Gets an instance of ThreeJsGLTFLoader
   * @returns
   */
  public static getInstance(): ThreeJsGLTFLoader {
    if (!ThreeJsGLTFLoader.instance) {
      ThreeJsGLTFLoader.instance = new ThreeJsGLTFLoader();
    }

    return ThreeJsGLTFLoader.instance;
  }

  /**
   *
   * @param modelPath
   * @param onLoad
   * @param onProgress
   * @param onError
   */
  getModel(
    modelPath: string,
    onLoad: (gltf: GLTF) => void,
    onProgress?: (event: ProgressEvent) => void,
    onError?: (event: ErrorEvent) => void
  ) {
    this.gltfLoader.load(modelPath, onLoad, onProgress, onError);
  }

  setDracoLoader(decoderPath: string) {
    this.dracoLoader = new DRACOLoader();
    this.dracoLoader.setDecoderPath(decoderPath);
    this.gltfLoader.setDRACOLoader(this.dracoLoader);
  }
}
