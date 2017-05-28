//
// 夜/影/_hbs-helpers.js
//

import { Logger, Scribe } from 'yoru/komono';

const helperIf = function helperIf(variable, options) {
  if (typeof options === typeof {}) {
    if (variable) {
      return options.fn(this);
    }
  } else {
    if (variable) {
      return options;
    }
  }
};

export default function registerHelpers(Handlebars) {
  Handlebars.registerHelper('yield', function(options) {
    if (options.fn) {
      Logger.error('Yield cannot be used in block form, please use {{yield}}');
      throw new Error('Yield used in block form');
    }

    const data = Object.assign(options.data.root, options.hash);
    const component = data.__component__;
    const yieldedContent = component.rootNode.innerHTML;

    let hbsTemplate = Handlebars.compile(yieldedContent);
    let html = hbsTemplate(data);
    return new Handlebars.SafeString(html);
  });

  Handlebars.registerHelper('if', function(variable, options) {
    return helperIf.call(this, variable, options);
  });

  Handlebars.registerHelper('unless', function(variable, options) {
    return helperIf.call(this, !variable, options);
  });

  Handlebars.registerHelper('upper', function(value) {
    return Scribe.upper(value);
  });

  Handlebars.registerHelper('lower', function(value) {
    return Scribe.lower(value);
  });
}
