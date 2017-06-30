//
// 夜/object.js
//

const Shortid = require('shortid');

import ProxyObject from 'yoru/internals/proxy-object';
import { readonly } from 'core-decorators';

export default class YoruObject extends ProxyObject {
  constructor() {
    super();
    this.__yoru__ = true;
    this.__objectId__ = Shortid.generate();
  }

  @readonly
  objectId() {
    return `Yoru-${this.__objectId__}`;
  }

  @readonly
  getName() {
    return this.constructor.name;
  }

  toString() {
    return `<#${this.constructor.name} ${this.objectId()}>`;
  }

  static toString() {
    return `<:${this.name} (class)>`;
  }

  forEachOwnProperty(callback) {
    if (!callback || typeof callback !== typeof (() => {})) {
      throw new TypeError('Callback is not a function');
    }
    for (let prop in this) {
      if (this.hasOwnProperty(prop)) {
        callback(prop);
      }
    }
  }
}
