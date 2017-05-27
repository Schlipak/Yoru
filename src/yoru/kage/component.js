//
// 夜/影/component.js
//

import YoruObject from 'yoru/object';
const Handlebars = require('handlebars');

export default class Component extends YoruObject {
  constructor(name, opts = {}) {
    super(...arguments);
    this.name = name;
    this.opts = opts;

    this.classes = [];
  }

  model() {
    return {};
  }

  getName() {
    return `Component-${this.name}`;
  }

  async applyModel(rootNode, shadow, template) {
    this.set('rootNode', rootNode);
    this.set('shadow', shadow);

    const model = Object.assign(this.opts.model.call(this), {
      __component__: this,
      __name__: this.getName(),
    });
    let hbsTemplate = await Handlebars.compile(template.innerHTML);
    let html = hbsTemplate(model);

    this.rootNode.classList.add(this.objectId());
    this.get('classes').forEach(kl => {
      this.rootNode.classList.add(kl);
    });
    return html;
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
