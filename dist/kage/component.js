'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _yoruObject = require('../yoru-object');

var _yoruObject2 = _interopRequireDefault(_yoruObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } //
// 夜/影/component.js
//

var Component = function (_YoruObject) {
  _inherits(Component, _YoruObject);

  function Component(name) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Component);

    var _this = _possibleConstructorReturn(this, (Component.__proto__ || Object.getPrototypeOf(Component)).apply(this, arguments));

    _this.name = name;
    _this.opts = opts;
    return _this;
  }

  _createClass(Component, [{
    key: 'model',
    value: function model() {
      return {};
    }
  }, {
    key: 'getName',
    value: function getName() {
      return 'Component-' + this.name;
    }
  }, {
    key: 'applyModel',
    value: function applyModel(rootNode, shadow, content) {
      this.rootNode = rootNode;
      this.shadow = shadow;

      var model = this.opts.model.call(this);
      var containerNode = document.createElement('div').appendChild(content);
      var contentStr = containerNode.innerHTML;
      contentStr = contentStr.replace(/{{([\w\d-_.]+)}}/g, function (match) {
        var property = match.replace(/{{|}}/g, '');
        return model[property];
      });
      content.innerHTML = contentStr;
      this.rootNode.classList.add(this.objectId());
    }
  }]);

  return Component;
}(_yoruObject2.default);

exports.default = Component;


var hooks = ['beforeAppend', 'afterAppend', 'beforeModel', 'afterModel'];
hooks.forEach(function (hook) {
  Component.prototype[hook] = function () {
    if (this.opts[hook]) {
      this.opts[hook].call(this);
    }
  };
});