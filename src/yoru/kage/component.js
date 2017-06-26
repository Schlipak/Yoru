//
// 夜/影/component.js
//

import YoruObject from 'yoru/object';
import { YoruArray } from 'yoru/tsuika';
const Handlebars = require('handlebars');

export default class Component extends YoruObject {
  constructor(name, opts = {}) {
    super(...arguments);
    this.name = name;
    this.opts = opts;

    this.set('classes', []);
  }

  model() {
    return {};
  }

  getName() {
    return `Component-${this.name}`;
  }

  consumeAttributeData() {
    const rootNode = this.get('rootNode');
    const reg = /y:data:(.+)/;
    let attrData = {};

    YoruArray.from(rootNode.attributes).forEach(attr => {
      const match = reg.exec(attr.name);
      if (match) {
        attrData[match[1]] = attr.value;
      }
    });

    return attrData;
  }

  async applyModel(rootNode, shadow, template) {
    this.set('rootNode', rootNode);
    this.set('shadow', shadow);

    const model = Object.assign(
      this.opts.model.call(this),
      {
        __component__: this,
        __name__: this.getName(),
        __id__: this.objectId(),
        __host__: this.get('rootNode'),
        __shadow__: this.get('shadow')
      },
      this.consumeAttributeData()
    );
    const hbsTemplate = await Handlebars.compile(template.innerHTML);
    const html = hbsTemplate(model);

    rootNode.id = this.objectId();
    rootNode.classList.add('yoru-component');
    this.get('classes').forEach(kl => {
      rootNode.classList.add(kl);
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
