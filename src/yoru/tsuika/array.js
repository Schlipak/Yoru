//
// 夜/追加/array.js
//

export default class YoruArray extends Array {
  constructor() {
    super(...arguments);
    this.__native_extention__ = true;
    this.__superclass__ = Array;
  }

  forEachPair(callback) {
    for (let i = 0; i < this.length; i += 2) {
      callback(this[i], this[i + 1]);
    }
    return this;
  }

  toNative() {
    return this.__superclass__.from(this);
  }
}
