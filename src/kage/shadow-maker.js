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
  component.beforeAppend();
  component.beforeModel();
  const html = component.applyModel(element, shadow, template);
  shadow.innerHTML = html;
  component.afterModel();
  component.afterAppend();
};

const __supportsGEBTN = function __supportsGEBTN(rootNode) {
  return 'getElementsByTagName' in rootNode;
};

const __getElementsFromChildren = function __getElementsFromChildren(
  rootNode,
  htmlTagName
) {
  return Array.from([[], ...rootNode.children]).reduce((acc = [], child) => {
    return acc.concat(...Array.from(child.getElementsByTagName(htmlTagName)));
  });
};

export default class ShadowMaker extends YoruObject {
  constructor(consumer) {
    super(...arguments);
    this.consumer = consumer;
    this.components = {};
    this.componentInstances = {};
  }

  init() {
    this.parseDOM();
  }

  parseDOM(rootNode = document.body) {
    Logger.debug(
      `Now parsing children of ${rootNode.tagName || rootNode.host.tagName}`
    );
    this.consumer.each((name, template) => {
      const htmlTagName = Scribe.dasherize(name);
      let elements = [];
      if (__supportsGEBTN(rootNode)) {
        elements = Array.from(rootNode.getElementsByTagName(htmlTagName));
      } else {
        elements = __getElementsFromChildren(rootNode, htmlTagName);
      }
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
          __insertComponent(element, template, instance);
          return this.parseDOM(element.shadowRoot);
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

        for (let optName in opts) {
          this.set(optName, opts[optName]);
        }
      }
    };
    this.components[name] = {
      constructor: ctor[name],
      name: name,
      options: opts,
    };
  }
}
