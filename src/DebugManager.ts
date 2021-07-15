import { GUI } from 'dat.gui';
import { DebugObject } from './ThreeJsObject';

export default class DebugManager {
  public gui?: GUI;
  public debugElements: Array<DebugObject[]>;
  constructor() {
    this.debugElements = [];
    this.importDatGUI();
  }

  /**
   * Imports dat.gui and load all elements.
   */
  private importDatGUI() {
    import('dat.gui').then((dat) => {
      this.gui = new dat.GUI();

      this.debugElements.forEach((element) => {
        element.forEach((obj) => {
          this.addElementToDatGUI(obj);
        });
      });

      this.debugElements = [];
    });
  }

  /**
   * Adds an object to dat.gui
   * @param obj
   */
  private addElementToDatGUI(obj: DebugObject) {
    const controller = obj.isColor
      ? this.gui
          ?.addColor(obj.baseObj, obj.property)
          .name(obj.name || obj.property)
      : this.gui
          ?.add(obj.baseObj, obj.property, obj.min, obj.max, obj.step)
          .name(obj.name || obj.property);
    if (obj.callback) {
      controller?.onChange(obj.callback);
    }
  }

  /**
   * Add properties to the debugElements array
   * @param properties
   */
  addToDebug(properties: DebugObject[]) {
    this.debugElements.push(properties);
  }
}
