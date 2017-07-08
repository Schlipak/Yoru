//
// 夜.js
//

require('babel-core/register');
require('babel-polyfill');
require('@webcomponents/webcomponentsjs/webcomponents-lite');

import Handlebars from 'handlebars';

import YoruObject from 'yoru/object';
import YoruApp from 'yoru/app';
import { YoruArray } from 'yoru/extensions';
import { Logger, Scribe, Run } from 'yoru/utils';

class Yoru extends YoruObject {
  static Handlebars = Handlebars;

  static Object = YoruObject;
  static App = YoruApp;

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
