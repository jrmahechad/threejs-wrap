import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';

/**
 * Wrapper for GLTFLoader. It will expose a unique instances of the loader.
 */
export default class ThreeJsGLTFLoader {
  static #instance?: ThreeJsGLTFLoader;
  #gltfLoader: GLTFLoader;

  constructor() {
    this.#gltfLoader = new GLTFLoader();
  }

  /**
   * Gets an instance of ThreeJsGLTFLoader.
   * @returns
   */
  static getInstance(): ThreeJsGLTFLoader {
    if (!ThreeJsGLTFLoader.#instance) {
      ThreeJsGLTFLoader.#instance = new ThreeJsGLTFLoader();
    }

    return ThreeJsGLTFLoader.#instance;
  }

  /**
   * Get a Gltf model. Uses Callbacks.
   * @param url
   * @param onLoad
   * @param onProgress
   * @param onError
   */
  getModel(
    url: string,
    onLoad: (gltf: GLTF) => void,
    onProgress?: (event: ProgressEvent) => void,
    onError?: (event: ErrorEvent) => void
  ) {
    this.#gltfLoader.load(url, onLoad, onProgress, onError);
  }

  /**
   * Get a Gltf model. Uses promises.
   * @param url
   * @param onProgress
   * @returns
   */
  getModelAsync(
    url: string,
    onProgress?: (event: ProgressEvent) => void
  ): Promise<GLTF> {
    return this.#gltfLoader.loadAsync(url, onProgress);
  }

  /**
   * Sets the DRACOLoader to the gltfLoader.
   * @param decoderPath
   */
  setDracoLoader(decoderPath: string) {
    import('three/examples/jsm/loaders/DRACOLoader').then(({ DRACOLoader }) => {
      // console.log("DRACOLoader", DRACOLoader);
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath(decoderPath);
      this.#gltfLoader.setDRACOLoader(dracoLoader);
    });
  }
}
