//
// 夜/心/proxy-object.js
//

import { Logger } from 'yoru/komono';

const ProxyHandler = {
  get: (target, prop) => {
    console.log(`GET ${target.name}.${prop}`);
    if (prop in target) {
      return target[prop];
    }
  },

  set: (target, prop, value) => {
    console.log(`SET ${target.name}.${prop} => ${value}`);
    target[prop] = value;
    return true;
  },
};

export default class ProxyObject {
  constructor() {
    this.__proxy__ = new Proxy({}, ProxyHandler);
  }

  __initProxyProperties(init) {
    if (init) {
      for (let prop in init) {
        if (init.hasOwnProperty(prop)) {
          this.__proxy__[prop] = init[prop];
        }
      }
    }
  }

  get(prop) {
    const path = prop.split('.');
    let obj = this.__proxy__;

    path.forEach(prop => {
      obj = (obj || {})[prop];
      if (typeof obj === typeof (() => {})) {
        obj = obj.call(this);
      }
    });

    return obj;
  }

  set(prop, value) {
    const path = prop.split('.');
    const lastDepth = path.length - 1;
    let obj = this.__proxy__;

    for (let depth = 0; depth < lastDepth; depth++) {
      let nextStep = obj[path[depth]];
      if (depth < lastDepth && !nextStep.__yoru__) {
        Logger.error(
          `[YoruObject#set] Cannot dig deeper! Property \`${path[
            depth
          ]}\` in path \`${prop}\` is not an object.`
        );
        return false;
      }
      obj = nextStep;
    }

    obj[path[lastDepth]] = value;
    return true;
  }
}
