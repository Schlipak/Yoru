//
// 夜.js
//

require('babel-core/register');
require('babel-polyfill');

import YoruObject from './yoru-object';
import { Logger, Scribe, Run } from './komono/utils';
import { ShadowMaker, TemplateConsumer } from './kage/shadow';

class Yoru extends YoruObject {
  static Logger = Logger;
  static Scribe = Scribe;
  static Run = Run;

  constructor() {
    super(...arguments);
    this.templateConsumer = new TemplateConsumer(this);
    this.shadowMaker = new ShadowMaker(this.templateConsumer);
  }

  boot() {
    Logger.info('Booting Yoru');

    this.templateConsumer.consume();
    this.shadowMaker.init();
  }

  registerComponent(name, opts = {}) {
    this.shadowMaker.registerComponent(name, opts);
  }
}

export default Yoru;
window.Yoru = Yoru;
