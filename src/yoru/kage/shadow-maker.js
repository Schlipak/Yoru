//
// 夜/影/shadow-maker.js
//

import YoruObject from 'yoru/object';
import Component from 'yoru/kage/component';
import { Scribe, Logger } from 'yoru/komono';
import { YoruArray } from 'yoru/tsuika';
import registerHelpers from './_hbs-helpers';
const Handlebars = require('handlebars');

const __insertPartial = function __insertPartial(element, template) {
  const shadow = element.createShadowRoot({ mode: 'open' });
  shadow.appendChild(template.content);
};

const __insertComponent = async function __insertComponent(
  element,
  template,
  component
) {
  const shadow = element.createShadowRoot({ mode: 'open' });
  component.beforeModel();
  const html = await component.applyModel(element, shadow, template);
  component.afterModel();
  const container = document.createElement('div');
  container.innerHTML = html;
  component.beforeAppend();
  YoruArray.from(container.children).forEach(child => {
    shadow.appendChild(child);
  });
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

    registerHelpers(Handlebars);
  }

  async init() {
    await this.parseDOM();
  }

  async parseDOM(rootNode = document.body) {
    Logger.debug(
      `Now parsing children of ${rootNode.tagName || rootNode.host.tagName}`
    );

    await Promise.all(
      this.consumer.each().map(async ([name, template]) => {
        const htmlTagName = Scribe.dasherize(name);
        let elements = [];
        if (__supportsGEBTN(rootNode)) {
          elements = Array.from(rootNode.getElementsByTagName(htmlTagName));
        } else {
          elements = __getElementsFromChildren(rootNode, htmlTagName);
        }
        await Promise.all(
          Array.from(elements).map(async element => {
            const componentData = this.components[name];
            if (!componentData) {
              Logger.debug(
                `No component named ${name} found. Defaulting behavior to partial.`
              );
              return __insertPartial(element, template);
            } else {
              let instance = new componentData.constructor(
                componentData.name,
                componentData.options
              );
              Logger.debug(`Rendering component ${instance.objectId()}`);
              await __insertComponent(element, template, instance);
              this.consumer.app.documents.push(element.shadowRoot);
              return await this.parseDOM(element.shadowRoot);
            }
          })
        );
      })
    );
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
