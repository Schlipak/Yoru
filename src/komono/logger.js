// 小物/logger.js

const checkForConsole = function checkForConsole(mode) {
  if (!window.console) {
    return false;
  }
  if (!window.console[mode]) {
    return false;
  }
  return true;
};

const loggingModes = ['log', 'debug', 'info', 'warn', 'error'];

let Logger = {};
loggingModes.forEach(mode => {
  Logger[mode] = function() {
    if (!checkForConsole(mode)) {
      return false;
    }
    window.console[mode](`[${mode.toUpperCase()}]`, ...arguments);
  };
});

export default Logger;
