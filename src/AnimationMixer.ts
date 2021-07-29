import {
  AnimationMixer as ThreeJsAnimationMixer,
  AnimationAction
} from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';

/**
 * Wrapper for AnimationMixer.
 */
export default class AnimationMixer {
  #mixer: ThreeJsAnimationMixer;
  #model: GLTF;
  #actions: Map<string, AnimationAction>;

  constructor(model: GLTF) {
    this.#model = model;
    this.#mixer = new ThreeJsAnimationMixer(this.#model.scene);
    this.#actions = new Map();
    this.#buildAnimations();
  }

  #buildAnimations(): void {
    for (const animation of this.#model.animations) {
      const clip: AnimationAction = this.#mixer.clipAction(animation);
      this.#actions.set(animation.name, clip);
    }
  }

  get actions(): Map<string, AnimationAction> {
    return this.#actions;
  }

  get actionsArray() {
    return Array.from(this.#actions.values());
  }

  hasAnimations(): boolean {
    return this.#actions.size > 0;
  }

  update(deltaTime: number) {
    this.#mixer.update(deltaTime);
  }
}
