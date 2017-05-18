'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Scribe = exports.Logger = undefined;

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _scribe = require('./scribe');

var _scribe2 = _interopRequireDefault(_scribe);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 小物/utils.js

exports.Logger = _logger2.default;
exports.Scribe = _scribe2.default;