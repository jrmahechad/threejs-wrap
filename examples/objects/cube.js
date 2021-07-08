import { ThreeJsObject } from '../../build/index.js';

/**
 * Sample cube class
 */
export default class Cube extends ThreeJsObject {
  constructor(params) {
    super(params);
  }

  /**
   * Create the object and all necesary elements to render it.
   * @returns
   */
  create() {
    const { size = 1, x = 0, y = 0, z = 0, color = 0xff0000 } = this.params;
    this.color = color;
    this.scale = 1;

    this.material = new this.THREE.MeshBasicMaterial({ color });
    this.geometry = new this.THREE.BoxGeometry(size, size, size);
    this.mesh = new this.THREE.Mesh(this.geometry, this.material);

    this.mesh.position.z = z;
    this.mesh.position.y = y;
    this.mesh.position.x = x;

    return this.mesh;
  }

  /**
   * This method will be executed in the loop
   * @param {*} elapsedTime
   */
  update(elapsedTime) {
    this.mesh.rotation.y = (elapsedTime / 5) * Math.PI * 2;
  }

  /**
   * This method will be executed when the mouse is intersecting the object
   */
  onIntersect() {
    this.material.color.set(new this.THREE.Color());
  }

  /**
   * This method is intersecting when the mouse is no longer intersenction the object
   */
  offIntersect() {
    this.material.color.set(this.color);
  }

  /**
   * This are the properties to debug with dat.gui
   * @returns
   */
  getDebugProperties() {
    return [
      {
        baseObj: this.mesh.position,
        property: 'y',
        min: -2,
        max: 2,
        step: 0.001,
        name: 'Height'
      },
      {
        baseObj: this,
        property: 'scale',
        min: 0,
        max: 3,
        step: 0.001,
        callback: (value) => {
          this.mesh.scale.set(value, value, value);
        }
      },
      {
        baseObj: this.material,
        property: 'wireframe'
      },
      {
        baseObj: this,
        property: 'color',
        isColor: true,
        callback: (value) => {
          this.material.color.set(value);
        }
      }
    ];
  }
}
