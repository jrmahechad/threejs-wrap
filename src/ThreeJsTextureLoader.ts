import * as THREE from 'three';

/**
 * Wrapper for the TextureLoader, includes a LoadingManager
 */
export default class ThreeJsTextureLoader {
  private static instance: ThreeJsTextureLoader;
  private textureLoader: THREE.TextureLoader;
  private loadingManager: THREE.LoadingManager;
  constructor() {
    this.loadingManager = new THREE.LoadingManager();
    this.textureLoader = new THREE.TextureLoader(this.loadingManager);
  }

  /**
   * Gets an instance of ThreeJsTextureLoader
   * @returns
   */
  public static getInstance(): ThreeJsTextureLoader {
    if (!ThreeJsTextureLoader.instance) {
      ThreeJsTextureLoader.instance = new ThreeJsTextureLoader();
    }

    return ThreeJsTextureLoader.instance;
  }

  /**
   * Load an array of textures.
   * @param textures
   * @returns
   */
  getTextures(textures: string[]) {
    return textures.map((texture) => {
      return this.textureLoader.load(texture);
    });
  }

  /**
   * Sets the onStart for the LoadingManager.
   * @param onStart
   */
  setOnStart(onStart: (url: string, loaded: number, total: number) => void) {
    this.loadingManager.onStart = onStart;
  }

  /**
   * Sets the onLoad for the LoadingManager.
   * @param onLoad
   */
  setOnLoad(onLoad: () => void) {
    this.loadingManager.onLoad = onLoad;
  }

  /**
   * Sets the onProgress for the LoadingManager.
   * @param onProgress
   */
  setOnProgress(
    onProgress: (url: string, loaded: number, total: number) => void
  ) {
    this.loadingManager.onProgress = onProgress;
  }

  /**
   * Sets the onError for the LoadingManager.
   * @param onError
   */
  setOnError(onError: (url: string) => void) {
    this.loadingManager.onError = onError;
  }
}
