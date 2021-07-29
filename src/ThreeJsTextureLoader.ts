import {
  LoadingManager,
  TextureLoader as ThreeJsTexture,
  Texture
} from 'three';

/**
 * Wrapper for the TextureLoader, includes a LoadingManager
 */
export default class ThreeJsTextureLoader {
  static #instance: ThreeJsTextureLoader;
  #textureLoader: ThreeJsTexture;
  #loadingManager: LoadingManager;

  constructor() {
    this.#loadingManager = new LoadingManager();
    this.#textureLoader = new ThreeJsTexture(this.#loadingManager);
  }

  /**
   * Gets an instance of ThreeJsTextureLoader
   * @returns
   */
  public static getInstance(): ThreeJsTextureLoader {
    if (!ThreeJsTextureLoader.#instance) {
      ThreeJsTextureLoader.#instance = new ThreeJsTextureLoader();
    }

    return ThreeJsTextureLoader.#instance;
  }

  /**
   * Load an array of textures.
   * @param textures
   * @returns
   */
  loadTextures(textures: string[]): Texture[] {
    return textures.map((texture) => {
      return this.#textureLoader.load(texture);
    });
  }

  /**
   *
   * @param textures
   * @returns
   */
  loadTexturesAsync(textures: string[]) {
    const promises: any[] = [];
    textures.forEach((texture) => {
      promises.push(this.#textureLoader.loadAsync(texture));
    });

    return Promise.all(promises);
  }

  /**
   * Load single texture async
   * @param url
   * @param onProgress
   * @returns
   */
  loadAsync(
    url: string,
    onProgress?: (event: ProgressEvent) => void
  ): Promise<Texture> {
    return this.#textureLoader.loadAsync(url, onProgress);
  }

  /**
   * Sets the onStart for the LoadingManager.
   * @param onStart
   */
  setOnStart(onStart: (url: string, loaded: number, total: number) => void) {
    this.#loadingManager.onStart = onStart;
  }

  /**
   * Sets the onLoad for the LoadingManager.
   * @param onLoad
   */
  setOnLoad(onLoad: () => void) {
    this.#loadingManager.onLoad = onLoad;
  }

  /**
   * Sets the onProgress for the LoadingManager.
   * @param onProgress
   */
  setOnProgress(
    onProgress: (url: string, loaded: number, total: number) => void
  ) {
    this.#loadingManager.onProgress = onProgress;
  }

  /**
   * Sets the onError for the LoadingManager.
   * @param onError
   */
  setOnError(onError: (url: string) => void) {
    this.#loadingManager.onError = onError;
  }
}

export { ThreeJsTextureLoader };
