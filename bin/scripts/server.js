'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Server

var path = require('path');
var express = require('express');
var expressWs = require('express-ws');
var chalk = require('chalk');
var opn = require('opn');
var fs = require('fs-extra');
var watchman = require('fb-watchman');

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
    expressWs(this.app);
    this.appName = getAppName(process.cwd());
    this.setupPaths();
    this.setupMiddleware();
    this.setupWatchClient();
    Logger.info('Serving for path ' + chalk.cyan.bold(this.appPath));
  }

  _createClass(server, [{
    key: 'setupWatchClient',
    value: function setupWatchClient() {
      var _this = this;

      this.watchedFiles = [];

      this.watchClient = new watchman.Client();
      this.watchClient.capabilityCheck({ optional: [], required: ['relative_root'] }, function (error, resp) {
        if (error) {
          Logger.error(error);
          return _this.watchClient.end();
        }
        _this.watchClient.command(['watch-project', process.cwd()], function (error, resp) {
          if (error) {
            return Logger.error('Error initiating watch: ', error);
          }

          if ('warning' in resp) {
            Logger.warn(resp.warning);
          }

          var watchPath = resp.watch;
          var watchRelativePath = resp.relative_path;

          var sub = {
            expression: ['allof', ['type', 'f'], ['match', 'app/**/*', 'wholename']],
            fields: ['name', 'size', 'mtime_ms', 'exists', 'type']
          };
          if (watchRelativePath) {
            sub.relative_root = watchRelativePath;
          }
          _this.watchClient.command(['subscribe', resp.watch, 'yoruServer', sub], function (err, resp) {
            if (error) {
              return Logger.error('Failed to subscribe: ', error);
            }
            Logger.info('Now watching ' + chalk.cyan(watchPath) + ' for changes in ' + chalk.blue.bold(watchRelativePath));

            _this.watchClient.on('subscription', function (resp) {
              if (resp.subscription !== 'yoruServer') return;
              var message = 'Detected file changes';
              Logger.watch(message);
              Logger.watch(message.replace(/./g, '—'));
              resp.files.forEach(function (file) {
                var alreadyWatched = _this.watchedFiles.includes(file.name);
                var status = chalk.green('+');
                if (alreadyWatched) {
                  status = file.exists ? chalk.yellow('~') : chalk.red('-');

                  if (!file.exists) {
                    var index = _this.watchedFiles.indexOf(file.name);
                    if (~index) {
                      _this.watchedFiles.splice(index, 1);
                    }
                  }
                } else {
                  if (file.exists) {
                    _this.watchedFiles.push(file.name);
                  }
                }

                Logger.watch(status + ' ' + file.name);
              });
              _this.notifyWS({
                status: 'changed',
                files: resp.files.map(function (file) {
                  return file.name;
                })
              });
            });
          });
        });
      });
    }
  }, {
    key: 'endWatchClient',
    value: function endWatchClient() {
      if (this.watchClient) {
        this.watchClient.end();
      }
    }
  }, {
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
      var _this2 = this;

      this.canAccessIndex = this.canAccessIndex || function () {
        try {
          fs.accessSync(path.join(process.cwd(), '/app/index.html'));
          return true;
        } catch (e) {
          return false;
        }
      }();

      this.app.use(function (req, res, next) {
        res.set('X-Powered-By', 'Yoru');
        if ((req.originalUrl || req.url) === '/' && !_this2.canAccessIndex) {
          Logger.http(getRequestMessage(req, { statusCode: 418 }));
          return res.status(418).send(_this2.notFoundHTML);
        }
        next();
      });
      this.app.use(function (req, res, next) {
        var _end = res.end;
        res.end = function (chunk, encoding) {
          Logger.http(getRequestMessage(req, res));
          res.end = _end;
          res.end(chunk, encoding);
        };
        next();
      });
      this.app.use('/', express.static(this.appPath));
      this.app.use('/assets', express.static(this.assetsPath));
      this.app.use('/vendor', express.static(this.scriptPath));

      this.app.ws('/yoru/server', function (ws, req) {
        _this2.ws = ws;
      });
    }
  }, {
    key: 'notifyWS',
    value: function notifyWS(message) {
      if (this.ws && this.ws.readyState === this.ws.OPEN) {
        this.ws.send(JSON.stringify(message));
      }
    }
  }, {
    key: 'boot',
    value: function boot() {
      var _this3 = this;

      var port = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 3000;

      this.tries++;
      Logger.info('Booting server for app `' + this.appName + '\'');
      this.server = this.app.listen(port, function () {
        Logger.info('Listening on port ' + port);
        Logger.info('Serving on ' + chalk.green.bold('http://0.0.0.0:' + port));
        opn('http://0.0.0.0:' + port);
        process.on('SIGINT', function () {
          Logger.info('Received interrupt, stopping server now');
          _this3.notifyWS({
            status: 'closing',
            message: 'Server is stopping now, bye!'
          });
          _this3.endWatchClient();
          Logger.info('Goodbye!');
          _this3.server.close();
          process.exit(0);
        });
      }).on('error', function (err) {
        Logger.error(err);
        if (_this3.tries > 5) {
          Logger.error('Cannot find a free port, bailing out now!');
          Logger.warn('Try starting the server by specifying a port number using --port <number>');
          process.exit(1);
        }
        Logger.warn('Retrying on port ' + (port + 1));
        _this3.boot(port + 1);
      });
    }
  }]);

  return server;
}();