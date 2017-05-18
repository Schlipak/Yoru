//
// 夜/影/component.js
//

import YoruObject from '../yoru-object';

export default class Component extends YoruObject {
  constructor(name, opts = {}) {
    super(...arguments);
    this.name = name;
    this.opts = opts;
  }

  model() {
    return {};
  }

  getName() {
    return `Component-${this.name}`;
  }

  applyModel(rootNode, shadow, content) {
    this.rootNode = rootNode;
    this.shadow = shadow;

    const model = this.opts.model.call(this);
    let containerNode = document.createElement('div').appendChild(content);
    let contentStr = containerNode.innerHTML;
    contentStr = contentStr.replace(/{{([\w\d-_.]+)}}/g, match => {
      const property = match.replace(/{{|}}/g, '');
      return model[property];
    });
    content.innerHTML = contentStr;
    this.rootNode.classList.add(this.objectId());
  }
}

const hooks = ['beforeAppend', 'afterAppend', 'beforeModel', 'afterModel'];
hooks.forEach(hook => {
  Component.prototype[hook] = function() {
    if (this.opts[hook]) {
      this.opts[hook].call(this);
    }
  };
});
