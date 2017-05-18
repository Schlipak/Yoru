'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _yoruObject = require('../yoru-object');

var _yoruObject2 = _interopRequireDefault(_yoruObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // 小物/logger.js

var checkForConsole = function checkForConsole(mode) {
  if (!window.console) {
    return false;
  }
  if (!window.console[mode]) {
    return false;
  }
  return true;
};

var loggingModes = ['log', 'debug', 'info', 'warn', 'error'];

var Logger = function (_YoruObject) {
  _inherits(Logger, _YoruObject);

  function Logger() {
    _classCallCheck(this, Logger);

    return _possibleConstructorReturn(this, (Logger.__proto__ || Object.getPrototypeOf(Logger)).apply(this, arguments));
  }

  return Logger;
}(_yoruObject2.default);

loggingModes.forEach(function (mode) {
  Logger[mode] = function () {
    var _window$console;

    if (!checkForConsole(mode)) {
      return false;
    }
    (_window$console = window.console)[mode].apply(_window$console, ['[' + mode.toUpperCase() + ']'].concat(Array.prototype.slice.call(arguments)));
  };
});

exports.default = Logger;