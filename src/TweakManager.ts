import { GUI } from 'dat.gui';

interface DebugObject {
  baseObj: Object;
  property: string;
  min?: number;
  max?: number;
  step?: number;
  name?: string;
  onChange?: number;
  isColor: boolean;
  callback: (value?: any) => void;
  isGroup: boolean;
  children?: Array<DebugObject>;
}

export default class TweakManager {
  #gui: GUI;

  constructor() {
    this.#gui = new GUI();
  }

  /**
   * Adds element to a GUI
   * @param obj
   * @param newGUI
   */
  #addElementToDatGUI(obj: DebugObject, newGUI?: GUI) {
    const gui = newGUI || this.#gui;
    const controller = obj.isColor
      ? gui?.addColor(obj.baseObj, obj.property).name(obj.name || obj.property)
      : gui
          ?.add(obj.baseObj, obj.property, obj.min, obj.max, obj.step)
          .name(obj.name || obj.property);
    if (obj.callback) {
      controller?.onChange(obj.callback);
    }
  }

  /**
   * Adds a group and it's children to the GUI.
   * @param obj
   */
  #addGroup(obj: DebugObject) {
    if (!obj.name) {
      throw Error('Group must have a name');
    }

    const group = this.#gui.addFolder(obj.name);
    this.#processElements(obj.children || [], group);
  }

  /**
   * Add properties to the debugElements array
   * @param properties
   */
  add(properties: Array<DebugObject>) {
    this.#processElements(properties);
  }

  /**
   * Process elements
   * @param children
   * @param gui
   */
  #processElements(elements: Array<DebugObject>, gui?: GUI) {
    for (const element of elements) {
      if (element.isGroup) {
        this.#addGroup(element);
      } else {
        this.#addElementToDatGUI(element, gui);
      }
    }
  }

  /**
   * Returns dat.gui instance
   * @returns
   */
  getGUI() {
    return this.#gui;
  }
}

export type { DebugObject };
