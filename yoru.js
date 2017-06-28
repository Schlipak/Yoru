//
// 夜.js
//

require('babel-core/register');
require('babel-polyfill');

const Handlebars = require('handlebars');

import { YoruArray } from 'yoru/extensions';
import YoruObject from 'yoru/object';
import { Logger, Scribe, Run } from 'yoru/utils';
import { ShadowMaker, TemplateConsumer } from 'yoru/shadow';
import { Preloader } from 'yoru/internals';

const YORU_INFO_STYLE = `background: #000;
  color: #FFF;
  font-size: 1.5em;
  padding: .5em 1em;
  border-radius: 1.5em;`;

class Yoru extends YoruObject {
  static Handlebars = Handlebars;

  static Object = YoruObject;

  static Logger = Logger;
  static Scribe = Scribe;
  static Run = Run;

  static Array = YoruArray;
  static A() {
    return new YoruArray(...arguments);
  }

  /* eslint-disable no-undef */
  static VERSION = VERSION;
  /* eslint-enable no-undef */

  constructor() {
    super(...arguments);
    Logger.raw('');
    Logger.style(`夜 ー ＹＯＲＵ ー Version ${Yoru.VERSION}`, YORU_INFO_STYLE);
    Logger.raw('');

    this.set('documents', Yoru.A(document));
    this.templateConsumer = new TemplateConsumer(this);
    this.shadowMaker = new ShadowMaker(this.templateConsumer);
    this.preloader = new Preloader();
    this.preloader.init();
  }

  async boot() {
    Logger.info('Booting Yoru');

    this.templateConsumer.consume();
    await this.shadowMaker.init();
    this.preloader.tearDown();
  }

  find(selector) {
    let results = Yoru.A();
    this.get('documents').forEach(doc => {
      results.push(...doc.querySelectorAll(selector));
    });
    return results;
  }

  registerComponent(name, opts = {}) {
    this.shadowMaker.registerComponent(name, opts);
  }
}

!(function(Yoru) {
  if (typeof window === typeof void 0 || typeof document === typeof void 0) {
    console.error(
      'Yoru cannot run in a headless JavaScript engine (missing `window` and/or `document`)'
    );
    throw new Error('Engine is headless');
  }
  window.Yoru = Yoru;
  return Yoru;
})(Yoru);

export default Yoru;
