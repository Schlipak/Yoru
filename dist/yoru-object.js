'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//
// 夜/yoru_object.js
//

var __globalObjectCount__ = 0;

var YoruObject = function () {
  _createClass(YoruObject, null, [{
    key: '_getGlobalObjectCount',
    value: function _getGlobalObjectCount() {
      return __globalObjectCount__;
    }
  }]);

  function YoruObject() {
    _classCallCheck(this, YoruObject);

    this.__yoru__ = true;
    this.__objectCount__ = __globalObjectCount__;
    __globalObjectCount__++;
  }

  _createClass(YoruObject, [{
    key: 'objectId',
    value: function objectId() {
      return 'Yoru-' + this.getName() + '-' + this.__objectCount__;
    }
  }, {
    key: 'getName',
    value: function getName() {
      return this.constructor.name;
    }
  }, {
    key: 'toString',
    value: function toString() {
      return '<#' + this.constructor.name + ' (instance)>';
    }
  }, {
    key: 'get',
    value: function get(prop) {
      var path = prop.split('.');
      var obj = this;

      path.forEach(function (prop) {
        obj = (obj || {})[prop];
      });

      return obj;
    }
  }, {
    key: 'set',
    value: function set(prop, value) {
      var createObjects = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      var path = prop.split('.');
      var lastDepth = path.length - 1;
      var obj = this;

      for (var depth = 0; depth < lastDepth; depth++) {
        var nextStep = obj[path[depth]];
        if (nextStep !== Object(nextStep)) {
          if (createObjects) {
            console.warn('[YoruObject#set] Cannot dig through property `' + path[depth] + '` in path `' + prop + '`, forcing to object.');
            obj[path[depth]] = new YoruObject();
          } else {
            console.error('[YoruObject#set] Cannot dig deeper! Property `' + path[depth] + '` in path `' + prop + '` is not an object.');
            return false;
          }
        }
        obj = obj[path[depth]];
      }

      obj[path[lastDepth]] = value;
      return true;
    }
  }], [{
    key: 'toString',
    value: function toString() {
      return '<:' + this.name + ' (class)>';
    }
  }]);

  return YoruObject;
}();

exports.default = YoruObject;