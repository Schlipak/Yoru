//
// 夜/心/proxy-object.js
//

import { Logger } from 'yoru/komono';

const PROXY_LOG_STYLE = 'color: #999;';

const ProxyHandler = {
  get: (target, prop) => {
    Logger.style(`[ProxyObject] GET ${prop}`, PROXY_LOG_STYLE);
    if (prop in target) {
      return target[prop];
    }
  },

  set: (target, prop, value) => {
    let displayValue = value;
    if (typeof value === typeof (() => {})) {
      displayValue = '[Function]';
    }
    Logger.style(
      `[ProxyObject] SET ${prop} => ${displayValue}`,
      PROXY_LOG_STYLE
    );
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
    let context = this.__proxy__;

    path.forEach(prop => {
      context = (context.__proxy__ || context || {})[prop];
      if (typeof context === typeof (() => {})) {
        context = context.call(this);
      }
    });

    return context;
  }

  set(prop, value) {
    const path = prop.split('.');
    const lastDepth = path.length - 1;
    let context = this.__proxy__;

    for (let depth = 0; depth < lastDepth; depth++) {
      let nextStep = context[path[depth]];
      if (depth < lastDepth && !nextStep.__yoru__) {
        Logger.error(
          `[ProxyObject#set] Cannot dig deeper! Property \`${path[
            depth
          ]}\` in path \`${prop}\` is not an object.`
        );
        return false;
      }
      context = nextStep;
    }

    context[path[lastDepth]] = value;
    return true;
  }
}
