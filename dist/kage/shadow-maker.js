'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _yoruObject = require('../yoru-object');

var _yoruObject2 = _interopRequireDefault(_yoruObject);

var _component = require('./component');

var _component2 = _interopRequireDefault(_component);

var _utils = require('../komono/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } //
// 夜/影/shadow-maker.js
//

var __insertPartial = function __insertPartial(element, template) {
  var shadow = element.createShadowRoot({ mode: 'open' });
  shadow.appendChild(template.content);
};

var __insertComponent = function __insertComponent(element, template, component) {
  var shadow = element.createShadowRoot({ mode: 'open' });
  var fragmentClone = document.importNode(template.content, true);
  console.log(template.content, fragmentClone);
  component.beforeAppend();
  component.beforeModel();
  component.applyModel(element, shadow, fragmentClone);
  shadow.appendChild(fragmentClone);
  component.afterModel();
  component.afterAppend();
};

var ShadowMaker = function (_YoruObject) {
  _inherits(ShadowMaker, _YoruObject);

  function ShadowMaker(consumer) {
    _classCallCheck(this, ShadowMaker);

    var _this = _possibleConstructorReturn(this, (ShadowMaker.__proto__ || Object.getPrototypeOf(ShadowMaker)).apply(this, arguments));

    _this.consumer = consumer;
    _this.components = {};
    _this.componentInstances = {};
    return _this;
  }

  _createClass(ShadowMaker, [{
    key: 'init',
    value: function init() {
      var _this2 = this;

      this.consumer.each(function (name, template) {
        var htmlTagName = _utils.Scribe.dasherize(name);
        var elements = document.getElementsByTagName(htmlTagName);
        Array.from(elements).forEach(function (element) {
          var componentData = _this2.components[name];
          if (!componentData) {
            _utils.Logger.info('No component named ' + name + ' found. Defaulting behavior to partial.');
            return __insertPartial(element, template);
          } else {
            var instance = new componentData.constructor(componentData.name, componentData.options);
            _utils.Logger.info('Rendering component ' + instance.objectId());
            return __insertComponent(element, template, instance);
          }
        });
      });
    }
  }, {
    key: 'registerComponent',
    value: function registerComponent(name) {
      var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _utils.Logger.debug('Registering component ' + name);
      var ctor = {};
      ctor[name] = function (_Component) {
        _inherits(_class, _Component);

        function _class(name, opts) {
          _classCallCheck(this, _class);

          var _this3 = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, name, opts));

          _this3.name = name;
          return _this3;
        }

        return _class;
      }(_component2.default);
      this.components[name] = {
        constructor: ctor[name],
        name: name,
        options: opts
      };
    }
  }]);

  return ShadowMaker;
}(_yoruObject2.default);

exports.default = ShadowMaker;