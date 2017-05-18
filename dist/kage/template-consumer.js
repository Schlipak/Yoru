'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _yoruObject = require('../yoru-object');

var _yoruObject2 = _interopRequireDefault(_yoruObject);

var _utils = require('../komono/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } //
// 夜/影/shadow-maker.js
//

var PREFIX = 'yoru-';

var TemplateConsumer = function (_YoruObject) {
  _inherits(TemplateConsumer, _YoruObject);

  function TemplateConsumer() {
    _classCallCheck(this, TemplateConsumer);

    var _this = _possibleConstructorReturn(this, (TemplateConsumer.__proto__ || Object.getPrototypeOf(TemplateConsumer)).apply(this, arguments));

    _this.templates = {};

    if (!('content' in document.createElement('template'))) {
      /* eslint-disable quotes */
      _utils.Logger.error("Your browser does not support HTML templates, Yoru cannot cannot work without them :'(");
      /* eslint-enable quotes */
      throw new Error('No support for <template>');
    }
    return _this;
  }

  _createClass(TemplateConsumer, [{
    key: 'consume',
    value: function consume() {
      var _this2 = this;

      var templates = document.querySelectorAll('template[id^="' + PREFIX + '"]');
      templates.forEach(function (template) {
        var templateName = _utils.Scribe.camelize(template.id.slice(PREFIX.length));
        var htmlTagName = _utils.Scribe.dasherize(templateName);

        if (!htmlTagName.match(/[\w\d]+(?:-[\w\d]+)+/)) {
          _utils.Logger.warn('Template \'' + htmlTagName + '\' does not contain any hyphen. To avoid collisions with any future HTML elements, please include at least an hyphen in your template/component name');
          _utils.Logger.warn('Skipping template \'' + htmlTagName + '\'...');
        } else {
          _utils.Logger.debug('Registering template for component \'' + templateName + '\', will match <' + htmlTagName + '> elements');
          _this2.templates[templateName] = template;
        }
      });
    }
  }, {
    key: 'get',
    value: function get(templateName) {
      return this.templates[templateName];
    }
  }, {
    key: 'each',
    value: function each(callback) {
      if (!callback) {
        return false;
      }
      for (var key in this.templates) {
        callback(key, this.templates[key]);
      }
    }
  }]);

  return TemplateConsumer;
}(_yoruObject2.default);

exports.default = TemplateConsumer;