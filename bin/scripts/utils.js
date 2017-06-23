'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// Utils

var chalk = require('chalk');
var spawnAsync = require('spawn-async');

var verbs = [{ name: 'log', color: 'bold' }, { name: 'debug', color: 'magenta' }, { name: 'info', color: 'blue' }, { name: 'warn', color: 'yellow' }, { name: 'error', color: 'red' }];

var Logger = {};
verbs.forEach(function (verb) {
  Logger[verb.name] = function (message) {
    console[verb.name]('\r[' + chalk[verb.color](verb.name.toUpperCase()) + '] ' + message);
  };
});

var SilentLogger = {};
verbs.forEach(function (verb) {
  SilentLogger[verb.name] = function () {};
});

var Run = {
  later: function later(callback, time) {
    return new Promise(function (resolve) {
      setTimeout(function () {
        resolve(callback());
      }, time);
    });
  }
};

var ShSpawn = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(command, opts) {
    var worker;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            worker = spawnAsync.createWorker({ log: SilentLogger });
            return _context.abrupt('return', new Promise(function (resolve, reject) {
              worker.aspawn([command].concat(_toConsumableArray(opts)), function (err, stdout, stderr) {
                if (err) {
                  return reject(err);
                }
                worker.destroy();
                return resolve({ stdout: stdout, stderr: stderr });
              });
            }));

          case 2:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  function ShSpawn(_x, _x2) {
    return _ref.apply(this, arguments);
  }

  return ShSpawn;
}();

var Scribe = {
  upper: function upper() {
    var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    return str.toUpperCase();
  },

  lower: function lower() {
    var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    return str.toLowerCase();
  },

  capitalize: function capitalize() {
    var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    return Scribe.upper(str.charAt(0)) + Scribe.lower(str.slice(1));
  },

  constantize: function constantize() {
    var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    var words = str.split(/[-_\s]|(?=[A-Z])/);
    return words.map(function (word) {
      return Scribe.capitalize(Scribe.lower(word));
    }).join('');
  },

  camelize: function camelize() {
    var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    var constant = Scribe.constantize(str);
    return Scribe.lower(constant.charAt(0)) + constant.slice(1);
  },

  dasherize: function dasherize() {
    var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    var words = str.split(/(?=[A-Z])|[-_]/);
    return words.map(function (word) {
      return Scribe.lower(word);
    }).join('-');
  }
};

module.exports = {
  Logger: Logger,
  SilentLogger: SilentLogger,
  Run: Run,
  ShSpawn: ShSpawn,
  Scribe: Scribe
};