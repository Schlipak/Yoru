//
// 夜/object.js
//

const Shortid = require('shortid');
import { Logger } from 'yoru/utils';

export default class YoruObject {
  constructor() {
    this.__yoru__ = true;
    this.__objectId__ = Shortid.generate();
  }

  objectId() {
    return `Yoru-${this.__objectId__}`;
  }

  getName() {
    return this.constructor.name;
  }

  toString() {
    return `<#${this.constructor.name} (instance)>`;
  }

  static toString() {
    return `<:${this.name} (class)>`;
  }

  get(prop) {
    const path = prop.split('.');
    let obj = this;

    path.forEach(prop => {
      obj = (obj || {})[prop];
      if (typeof obj === typeof (() => {})) {
        obj = obj.call(this);
      }
    });

    return obj;
  }

  set(prop, value, createObjects = false) {
    const path = prop.split('.');
    const lastDepth = path.length - 1;
    let obj = this;

    for (let depth = 0; depth < lastDepth; depth++) {
      let nextStep = obj[path[depth]];
      if (nextStep !== Object(nextStep)) {
        if (createObjects) {
          Logger.warn(
            `[YoruObject#set] Cannot dig through property \`${path[depth]}\` in path \`${prop}\`, forcing to object.`
          );
          obj[path[depth]] = new YoruObject();
        } else {
          Logger.error(
            `[YoruObject#set] Cannot dig deeper! Property \`${path[depth]}\` in path \`${prop}\` is not an object.`
          );
          return false;
        }
      }
      obj = obj[path[depth]];
    }

    obj[path[lastDepth]] = value;
    return true;
  }
}
