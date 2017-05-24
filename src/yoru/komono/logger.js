//
// 夜/小物/logger.js
//

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
  const testUA = function testUA(reg) {
    return reg.test(navigator.userAgent);
  };

  const browser = {
    isFirefox: testUA(/firefox/i),
    isIE: testUA(/trident/i) || testUA(/edge/i),
  };
  browser.isWebkitBlink =
    (testUA(/webkit/i) || testUA(/opr/i)) && !browser.isIE;
  const modifiedConsole =
    !browser.isIE &&
    !!window.console &&
    console.log.toString().indexOf('apply') !== -1;

  return browser.isWebkitBlink || !!(browser.isFirefox && modifiedConsole);
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
    const args = Array.from(arguments);
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