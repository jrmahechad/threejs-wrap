import { ThreeJsObject } from '../../build/index.js';

//normal box
export default class Cube extends ThreeJsObject {
  constructor(params) {
    super(params);
  }

  create() {
    const { size = 1, x = 0, y = 0, z = 0, color = 0xff0000 } = this.params;

    this.material = new this.THREE.MeshBasicMaterial({ color });
    this.geometry = new this.THREE.BoxGeometry(size, size, size);
    this.mesh = new this.THREE.Mesh(this.geometry, this.material);

    this.mesh.position.z = z;
    this.mesh.position.y = y;
    this.mesh.position.x = x;

    return this.mesh;
  }

  update(elapsedTime) {
    this.mesh.rotation.y = (elapsedTime / 5) * Math.PI * 2;
  }
}
