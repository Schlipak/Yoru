'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// 小物/scribe.js

var Scribe = function () {
  function Scribe() {
    _classCallCheck(this, Scribe);
  }

  _createClass(Scribe, null, [{
    key: 'upper',
    value: function upper() {
      var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      return str.toUpperCase();
    }
  }, {
    key: 'lower',
    value: function lower() {
      var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      return str.toLowerCase();
    }
  }, {
    key: 'capitalize',
    value: function capitalize() {
      var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      return Scribe.upper(str.charAt(0)) + str.slice(1);
    }
  }, {
    key: 'camelize',
    value: function camelize() {
      var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      var words = str.split(/[-_\s]/);
      return words.map(function (word) {
        return Scribe.capitalize(Scribe.lower(word));
      }).join('');
    }
  }, {
    key: 'dasherize',
    value: function dasherize() {
      var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      var words = str.split(/(?=[A-Z])/);
      return words.map(function (word) {
        return Scribe.lower(word);
      }).join('-');
    }
  }]);

  return Scribe;
}();

exports.default = Scribe;