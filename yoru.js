//
// 夜.js
//

require('babel-core/register');
require('babel-polyfill');

import YoruObject from './yoru-object';
import { Logger, Scribe, Run } from './komono/utils';
import { ShadowMaker, TemplateConsumer } from './kage/shadow';
import { Preloader } from './kokoro/internals';

const YORU_INFO_STYLE = 'background: #000; color: #FFF; font-size: 1.5em; padding: .5em 1em; border-radius: 1.5em;';

class Yoru extends YoruObject {
  static Logger = Logger;
  static Scribe = Scribe;
  static Run = Run;

  constructor() {
    super(...arguments);
    Logger.raw('');
    Logger.raw('%c夜 ー ＹＯＲＵ ー Version 0.1.0', YORU_INFO_STYLE);
    Logger.raw('');

    this.templateConsumer = new TemplateConsumer(this);
    this.shadowMaker = new ShadowMaker(this.templateConsumer);
    this.preloader = new Preloader();
    this.preloader.init();
  }

  boot() {
    Logger.info('Booting Yoru');

    document.body.classList.add('yoru-loading');
    this.templateConsumer.consume();
    this.shadowMaker.init();
    this.preloader.tearDown();
  }

  registerComponent(name, opts = {}) {
    this.shadowMaker.registerComponent(name, opts);
  }
}

// (function() {
//   Logger.debug('Registering prototype extensions');
//   Function.prototype.listen = function() {
//     Array.from(arguments).forEach(source => {
//       ((src) => {
//         // ${this.get('objectId')}
//         console.log(this);
//         console.log(this.get);
//         window.addEventListener(`yoru.internal.${src}`, () => {
//           console.log(src);
//         });
//       })(source);
//     });
//     return this;
//   };
// })();

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
