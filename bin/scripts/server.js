'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Server

var path = require('path');
var express = require('express');
var chalk = require('chalk');
var opn = require('opn');
var fs = require('fs-extra');

var _require = require('./utils'),
    Logger = _require.Logger,
    SilentLogger = _require.SilentLogger,
    Run = _require.Run,
    ShSpawn = _require.ShSpawn,
    Scribe = _require.Scribe;

var getHttpStatusMessage = function getHttpStatusMessage(code) {
  var colorCodes = {
    199: 'cyan',
    299: 'green',
    399: 'blue',
    417: 'yellow',
    418: 'magenta',
    499: 'yellow',
    599: 'red'
  };

  var color = 'bold';
  for (var minCode in colorCodes) {
    if (code <= minCode) {
      color = colorCodes[minCode];
      break;
    }
  }
  return '[' + chalk[color](code) + ']';
};

var getRequestMessage = function getRequestMessage(req, res) {
  return [getHttpStatusMessage(res.statusCode), req.headers.host, '-->', req.method, req.originalUrl || req.url].join(' ');
};

var getAppName = function getAppName(path) {
  return Scribe.constantize(path.split('/')[path.split('/').length - 1]);
};

module.exports = function () {
  function server() {
    _classCallCheck(this, server);

    this.tries = 0;
    this.app = express();
    this.appName = getAppName(process.cwd());
    this.setupPaths();
    this.setupMiddleware();
    Logger.info('Serving for path `' + this.appPath + '\'');
  }

  _createClass(server, [{
    key: 'setupPaths',
    value: function setupPaths() {
      this.appPath = path.join(process.cwd(), '/app');
      this.assetsPath = path.join(process.cwd(), '/assets/');
      this.scriptPath = path.join(process.cwd(), '/node_modules/yoru/dist/');
      this.notFoundPath = path.join(__dirname, '/../assets/404.html');
      this.notFoundHTML = fs.readFileSync(this.notFoundPath, 'utf8');
    }
  }, {
    key: 'setupMiddleware',
    value: function setupMiddleware() {
      var _this = this;

      this.canAccessIndex = this.canAccessIndex || function () {
        try {
          fs.accessSync(path.join(process.cwd(), '/app/index.html'));
          return true;
        } catch (e) {
          return false;
        }
      }();

      this.app.use(function (req, res, next) {
        if ((req.originalUrl || req.url) === '/' && !_this.canAccessIndex) {
          Logger.log(getRequestMessage(req, { statusCode: 418 }));
          return res.status(418).send(_this.notFoundHTML);
        }
        next();
      });
      this.app.use(function (req, res, next) {
        var _end = res.end;
        res.end = function (chunk, encoding) {
          Logger.log(getRequestMessage(req, res));
          res.end = _end;
          res.end(chunk, encoding);
        };
        next();
      });
      this.app.use('/', express.static(this.appPath));
      this.app.use('/assets', express.static(this.assetsPath));
      this.app.use('/vendor', express.static(this.scriptPath));
    }
  }, {
    key: 'boot',
    value: function boot() {
      var _this2 = this;

      var port = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 3000;

      this.tries++;
      Logger.info('Booting server for app `' + this.appName + '\'');
      this.server = this.app.listen(port, function () {
        Logger.info('Listening on port ' + port);
        Logger.info('Serving on ' + chalk.green.bold('http://0.0.0.0:' + port));
        opn('http://0.0.0.0:' + port);
        process.on('SIGINT', function () {
          Logger.info('Received interrupt, stopping server now');
          Logger.info('Goodbye!');
          _this2.server.close();
          process.exit(0);
        });
      }).on('error', function (err) {
        Logger.error(err);
        if (_this2.tries > 5) {
          Logger.error('Cannot find a free port, bailing out now!');
          Logger.warn('Try starting the server by specifying a port number using --port <number>');
          process.exit(1);
        }
        Logger.warn('Retrying on port ' + (port + 1));
        _this2.boot(port + 1);
      });
    }
  }]);

  return server;
}();