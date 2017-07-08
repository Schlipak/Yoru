//
// 夜.js
//

require('babel-core/register');
require('babel-polyfill');
require('@webcomponents/webcomponentsjs/webcomponents-lite');

import Handlebars from 'handlebars';
import { readonly } from 'core-decorators';

import YoruObject from 'yoru/object';
import YoruApp from 'yoru/app';
import { YoruArray } from 'yoru/extensions';
import { Logger, Scribe, Run } from 'yoru/utils';

/**
 * Yoru namespace
 *
 * Exposes the Yoru public API
 */
class Yoru extends YoruObject {
  /**
   * Handlebars
   *
   * A reference to the Handlebars templating library
   */
  @readonly
  static Handlebars = Handlebars;

  /**
   * YoruObject
   *
   * A reference to the Yoru native object.
   * This can be used directly as a constructor, or can be extended as needed.
   */
  @readonly
  static Object = YoruObject;

  /**
   * YoruApp
   *
   * The Yoru application runtime.
   */
  @readonly
  static App = YoruApp;

  /**
   * Logger
   *
   * The Yoru builtin logger. This is a namespace, not a constructor.
   * Exposes methods such as `log`, `debug` or `error`,
   * plus a helper function to print styled text to the console, with feature
   * detection.
   */
  @readonly
  static Logger = Logger;

  /**
   * Scribe
   *
   * A collection of string formatting functions. This is a namespace, not a
   * constructor.
   * Exposes methods such as `camelize`, `dasherize` or `constantize`.
   */
  @readonly
  static Scribe = Scribe;

  /**
   * Run
   *
   * A collection of run loop related functions. This is a namespace, not a
   * constructor.
   * Exposes functions such as `later`, `async` or `cancel`.
   */
  @readonly
  static Run = Run;

  /**
   * Array
   *
   * The YoruArray class. Extends the native JavaScript array class. Can be
   * built from a native array using the `Yoru.A` function.
   * Exposes functions such as `forEachPair`, `sample` or `flatten`. Much of the
   * new functions are inspired by the methods of the Ruby Array class.
   */
  @readonly
  static Array = YoruArray;

  /**
   * Yoru.A
   *
   * Pseudo-constructor for YoruArray. Takes any number of arguments and convert
   * those into a YoruArray.
   * Passing an array to this function will result in a YoruArray containing one
   * element (the native array itself).
   */
  @readonly
  static A() {
    return new YoruArray(...arguments);
  }
  
  /* eslint-disable no-undef */
  @readonly
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
