//
// 夜/小物/logger.js
//

import { YoruArray } from 'yoru/tsuika';

const checkForConsole = function checkForConsole(mode) {
  if (!window.console) {
    return false;
  }
  if (!window.console[mode]) {
    return false;
  }
  return true;
};

const checkCanDisplayStyles = function checkCanDisplayStyles() {
  if (typeof navigator === typeof void 0) {
    return false;
  }
  const testUA = function testUA(reg) {
    return reg.test(navigator.userAgent);
  };

  const browser = {
    isFirefox: testUA(/firefox/i),
    isIE: testUA(/trident/i) || testUA(/edge/i),
    isPhantom: testUA(/phantomjs/i),
  };
  browser.isWebkitBlink =
    (testUA(/webkit/i) || testUA(/opr/i)) &&
    !browser.isIE &&
    !browser.isPhantom;
  const modifiedConsole =
    !browser.isIE &&
    !browser.isPhantom &&
    !!window.console &&
    console.log.toString().indexOf('apply') !== -1;

  return browser.isWebkitBlink || (browser.isFirefox && modifiedConsole);
};

const loggingModes = ['log', 'debug', 'info', 'warn', 'error'];

let Logger = {
  raw: function() {
    if (!checkForConsole('log')) {
      return false;
    }
    window.console.log(...arguments);
  },

  style: function() {
    const args = YoruArray.from(arguments);
    if (!checkCanDisplayStyles()) {
      args.forEachPair(message => {
        Logger.raw(message);
      });
    } else {
      args.forEachPair((message, style) => {
        Logger.raw(`%c${message}`, style);
      });
    }
  },
};

loggingModes.forEach(mode => {
  Logger[mode] = function() {
    if (!checkForConsole(mode)) {
      return false;
    }
    window.console[mode](`[${mode.toUpperCase()}]`, ...arguments);
  };
});

export default Logger;
