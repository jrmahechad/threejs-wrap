import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

/**
 * Wrapper for
 */
export default class ThreeJsGLTFLoader {
  private static instance: ThreeJsGLTFLoader;
  private gltfLoader: GLTFLoader;

  constructor() {
    this.gltfLoader = new GLTFLoader();
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

  /**
   *
   * @param url
   * @param onProgress
   * @returns
   */
  getModelAsync(
    url: string,
    onProgress?: (event: ProgressEvent) => void
  ): Promise<GLTF> {
    return this.gltfLoader.loadAsync(url, onProgress);
  }

  setDracoLoader(decoderPath: string) {
    import('three/examples/jsm/loaders/DRACOLoader').then(({ DRACOLoader }) => {
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath(decoderPath);
      this.gltfLoader.setDRACOLoader(dracoLoader);
    });
  }
}
