//
// 夜/Internals/proxy-object.js
//

import { Logger } from 'yoru/utils';

const PROXY_LOG_STYLE = 'color: #999;';
const PROXY_NOTIFY_STYLE = 'color: #6d9eab;';

const ProxyHandler = {
  get: (target, prop) => {
    Logger.style(`[ProxyObject] GET ${prop}`, PROXY_LOG_STYLE);
    if (prop in target) {
      return target[prop];
    }
  },

  set: (target, prop, newValue) => {
    const oldValue = target[prop];
    let displayValue = newValue;
    if (typeof newValue === typeof (() => {})) {
      displayValue = '[Function]';
    }
    Logger.style(
      `[ProxyObject] SET ${prop} => ${displayValue}`,
      PROXY_LOG_STYLE
    );
    target[prop] = newValue;
    target.__self__.notifyPropertyChanged(prop, oldValue, newValue);
    return true;
  },
};

export default class ProxyObject {
  constructor() {
    this.__proxy__ = new Proxy(
      {
        __self__: this,
      },
      ProxyHandler
    );
    this.__watchCallbacks__ = {};
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

  notifyPropertyChanged(prop, oldValue, newValue) {
    Logger.style(`[NOTIFY] ${this}.${prop} changed`, PROXY_NOTIFY_STYLE);
    (this.__watchCallbacks__[prop] || [])
      .forEach(callback => callback(prop, oldValue, newValue));
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

  watch(prop, callback) {
    if (!this.__watchCallbacks__[prop]) {
      this.__watchCallbacks__[prop] = [];
    }
    !this.__watchCallbacks__[prop].push(callback);
  }
}
