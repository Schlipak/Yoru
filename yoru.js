//
// 夜.js
//

require('babel-core/register');
require('babel-polyfill');

import YoruObject from './yoru-object';
import { Logger, Scribe, Run } from './komono/utils';
import { ShadowMaker, TemplateConsumer } from './kage/shadow';

const PRELOAD_CSS =
  'body{transform:scale(1);transform-origin:top;opacity:1;transition:transform .6s,opacity .6s;}body.yoru-loading{transform:scale(1.05);opacity:0;transition:none;}';

class Yoru extends YoruObject {
  static Logger = Logger;
  static Scribe = Scribe;
  static Run = Run;

  constructor() {
    super(...arguments);
    this.templateConsumer = new TemplateConsumer(this);
    this.shadowMaker = new ShadowMaker(this.templateConsumer);

    this._initPreload();
  }

  _initPreload() {
    this.preloadStyle = document.createElement('style');
    this.preloadStyle.innerHTML = PRELOAD_CSS;
    document.head.appendChild(this.preloadStyle);
  }

  _destroyPreload() {
    Run.async(() => {
      document.body.classList.remove('yoru-loading');
      Run.later(() => {
        this.preloadStyle.parentNode.removeChild(this.preloadStyle);
        this.preloadStyle = null;
      }, 650);
    });
  }

  boot() {
    Logger.info('Booting Yoru');

    document.body.classList.add('yoru-loading');
    this.templateConsumer.consume();
    this.shadowMaker.init();
    this._destroyPreload();
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
