//
// 夜/影/shadow-maker.js
//

import YoruObject from '../yoru-object';
import Component from './component';
import { Scribe, Logger } from '../komono/utils';

const __insertPartial = function __insertPartial(element, template) {
  const shadow = element.createShadowRoot({ mode: 'open' });
  shadow.appendChild(template.content);
};

const __insertComponent = function __insertComponent(
  element,
  template,
  component
) {
  const shadow = element.createShadowRoot({ mode: 'open' });
  const fragmentClone = document.importNode(template.content, true);
  console.log(template.content, fragmentClone);
  component.beforeAppend();
  component.beforeModel();
  component.applyModel(element, shadow, fragmentClone);
  shadow.appendChild(fragmentClone);
  component.afterModel();
  component.afterAppend();
};

export default class ShadowMaker extends YoruObject {
  constructor(consumer) {
    super(...arguments);
    this.consumer = consumer;
    this.components = {};
    this.componentInstances = {};
  }

  init() {
    this.consumer.each((name, template) => {
      const htmlTagName = Scribe.dasherize(name);
      const elements = document.getElementsByTagName(htmlTagName);
      Array.from(elements).forEach(element => {
        const componentData = this.components[name];
        if (!componentData) {
          Logger.info(
            `No component named ${name} found. Defaulting behavior to partial.`
          );
          return __insertPartial(element, template);
        } else {
          let instance = new componentData.constructor(
            componentData.name,
            componentData.options
          );
          Logger.info(`Rendering component ${instance.objectId()}`);
          return __insertComponent(element, template, instance);
        }
      });
    });
  }

  registerComponent(name, opts = {}) {
    Logger.debug(`Registering component ${name}`);
    let ctor = {};
    ctor[name] = class extends Component {
      constructor(name, opts) {
        super(name, opts);
        this.name = name;
      }
    };
    this.components[name] = {
      constructor: ctor[name],
      name: name,
      options: opts,
    };
  }
}
