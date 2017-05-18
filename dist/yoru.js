'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _yoruObject = require('./yoru-object');

var _yoruObject2 = _interopRequireDefault(_yoruObject);

var _utils = require('./komono/utils');

var _shadow = require('./kage/shadow');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//
// 夜.js
//

require('babel-core/register');
require('babel-polyfill');

var Yoru = function (_YoruObject) {
  _inherits(Yoru, _YoruObject);

  function Yoru() {
    _classCallCheck(this, Yoru);

    var _this = _possibleConstructorReturn(this, (Yoru.__proto__ || Object.getPrototypeOf(Yoru)).apply(this, arguments));

    _this.templateConsumer = new _shadow.TemplateConsumer(_this);
    _this.shadowMaker = new _shadow.ShadowMaker(_this.templateConsumer);
    return _this;
  }

  _createClass(Yoru, [{
    key: 'boot',
    value: function boot() {
      _utils.Logger.info('Booting Yoru');

      this.templateConsumer.consume();
      this.shadowMaker.init();
    }
  }, {
    key: 'registerComponent',
    value: function registerComponent(name) {
      var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      this.shadowMaker.registerComponent(name, opts);
    }
  }]);

  return Yoru;
}(_yoruObject2.default);

Yoru.Logger = _utils.Logger;
Yoru.Scribe = _utils.Scribe;
exports.default = Yoru;

window.Yoru = Yoru;