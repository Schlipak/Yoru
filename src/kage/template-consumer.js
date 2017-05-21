//
// 夜/影/shadow-maker.js
//

import YoruObject from '../yoru-object';
import { Logger, Scribe } from '../komono/utils';

const PREFIX = 'yoru-';

export default class TemplateConsumer extends YoruObject {
  constructor() {
    super(...arguments);
    this.templates = {};

    if (!('content' in document.createElement('template'))) {
      Logger.error(
        'Your browser does not support HTML templates, Yoru cannot cannot work without them :('
      );
      throw new Error('No support for <template>');
    }
  }

  consume() {
    const templates = document.querySelectorAll(`template[id^="${PREFIX}"]`);
    templates.forEach(template => {
      const templateName = Scribe.camelize(template.id.slice(PREFIX.length));
      const htmlTagName = Scribe.dasherize(templateName);

      if (!htmlTagName.match(/[\w\d]+(?:-[\w\d]+)+/)) {
        Logger.warn(
          `Template '${htmlTagName}' does not contain hyphens. To avoid collisions with any future HTML elements, please include at least an hyphen in your template/component name`
        );
        Logger.warn(`Skipping template '${htmlTagName}'...`);
      } else {
        if (this.templates[templateName]) {
          Logger.warn(
            `Duplicate template, '${htmlTagName}' is already registered`
          );
        } else {
          Logger.debug(
            `Registering template for component '${templateName}', will match <${htmlTagName}> elements`
          );
          this.templates[templateName] = template;
        }
      }
    });
  }

  get(templateName) {
    return this.templates[templateName];
  }

  each(callback) {
    if (!callback) {
      return this.templates;
    }
    for (let key in this.templates) {
      callback(key, this.templates[key]);
    }
  }
}
