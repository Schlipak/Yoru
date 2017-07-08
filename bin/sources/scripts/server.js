// Server

const path = require('path');
const express = require('express');
const expressWs = require('express-ws');
const chalk = require('chalk');
const opn = require('opn');
const fs = require('fs-extra');
const watchman = require('fb-watchman');

const { Logger, SilentLogger, Run, ShSpawn, Scribe } = require('./utils');

const getHttpStatusMessage = function getHttpStatusMessage(code) {
  const colorCodes = {
    199: 'cyan',
    299: 'green',
    399: 'blue',
    417: 'yellow',
    418: 'magenta',
    499: 'yellow',
    599: 'red',
  };

  let color = 'bold';
  for (const minCode in colorCodes) {
    if (code <= minCode) {
      color = colorCodes[minCode];
      break;
    }
  }
  return `[${chalk[color](code)}]`;
};

const getRequestMessage = function getRequestMessage(req, res) {
  return [
    getHttpStatusMessage(res.statusCode),
    req.headers.host,
    '-->',
    req.method,
    req.originalUrl || req.url,
  ].join(' ');
};

const getAppName = function getAppName(path) {
  return Scribe.constantize(path.split('/')[path.split('/').length - 1]);
};

module.exports = class server {
  constructor() {
    this.tries = 0;
    this.app = express();
    expressWs(this.app);
    this.appName = getAppName(process.cwd());
    this.setupPaths();
    this.setupMiddleware();
    this.setupWatchClient();
    Logger.info(`Serving for path ${chalk.cyan.bold(this.appPath)}`);
  }

  setupWatchClient() {
    this.watchedFiles = [];

    this.watchClient = new watchman.Client();
    this.watchClient.capabilityCheck(
      { optional: [], required: ['relative_root'] },
      (error, resp) => {
        if (error) {
          Logger.error(error);
          return this.watchClient.end();
        }
        this.watchClient.command(
          ['watch-project', process.cwd()],
          (error, resp) => {
            if (error) {
              return Logger.error('Error initiating watch: ', error);
            }

            if ('warning' in resp) {
              Logger.warn(resp.warning);
            }

            const watchPath = resp.watch;
            const watchRelativePath = resp.relative_path;

            const sub = {
              expression: [
                'allof',
                ['type', 'f'],
                ['match', 'app/**/*', 'wholename'],
              ],
              fields: ['name', 'size', 'mtime_ms', 'exists', 'type'],
            };
            if (watchRelativePath) {
              sub.relative_root = watchRelativePath;
            }
            this.watchClient.command(
              ['subscribe', resp.watch, 'yoruServer', sub],
              (err, resp) => {
                if (error) {
                  return Logger.error('Failed to subscribe: ', error);
                }
                Logger.info(
                  `Now watching ${chalk.cyan(
                    watchPath
                  )} for changes in ${chalk.blue.bold(watchRelativePath)}`
                );

                this.watchClient.on('subscription', resp => {
                  if (resp.subscription !== 'yoruServer') return;
                  const message = 'Detected file changes';
                  Logger.watch(message);
                  Logger.watch(message.replace(/./g, '—'));
                  resp.files.forEach(file => {
                    const alreadyWatched = this.watchedFiles.includes(
                      file.name
                    );
                    let status = chalk.green('+');
                    if (alreadyWatched) {
                      status = file.exists ? chalk.yellow('~') : chalk.red('-');

                      if (!file.exists) {
                        const index = this.watchedFiles.indexOf(file.name);
                        if (~index) {
                          this.watchedFiles.splice(index, 1);
                        }
                      }
                    } else {
                      if (file.exists) {
                        this.watchedFiles.push(file.name);
                      }
                    }

                    Logger.watch(`${status} ${file.name}`);
                  });
                  this.notifyWS({
                    status: 'changed',
                    files: resp.files.map(file => file.name),
                  });
                });
              }
            );
          }
        );
      }
    );
  }

  endWatchClient() {
    if (this.watchClient) {
      this.watchClient.end();
    }
  }

  setupPaths() {
    this.appPath = path.join(process.cwd(), '/app');
    this.assetsPath = path.join(process.cwd(), '/assets/');
    this.scriptPath = path.join(process.cwd(), '/node_modules/yoru/dist/');
    this.notFoundPath = path.join(__dirname, '/../assets/404.html');
    this.notFoundHTML = fs.readFileSync(this.notFoundPath, 'utf8');
  }

  setupMiddleware() {
    this.canAccessIndex =
      this.canAccessIndex ||
      (() => {
        try {
          fs.accessSync(path.join(process.cwd(), '/app/index.html'));
          return true;
        } catch (e) {
          return false;
        }
      })();

    this.app.use((req, res, next) => {
      res.set('X-Powered-By', 'Yoru');
      if ((req.originalUrl || req.url) === '/' && !this.canAccessIndex) {
        Logger.http(getRequestMessage(req, { statusCode: 418 }));
        return res.status(418).send(this.notFoundHTML);
      }
      next();
    });
    this.app.use((req, res, next) => {
      const _end = res.end;
      res.end = (chunk, encoding) => {
        Logger.http(getRequestMessage(req, res));
        res.end = _end;
        res.end(chunk, encoding);
      };
      next();
    });
    this.app.use('/', express.static(this.appPath));
    this.app.use('/assets', express.static(this.assetsPath));
    this.app.use('/vendor', express.static(this.scriptPath));

    this.app.ws('/yoru/server', (ws, req) => {
      this.ws = ws;
    });
  }

  notifyWS(message) {
    if (this.ws && this.ws.readyState === this.ws.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  boot(port = 3000) {
    this.tries++;
    Logger.info(`Booting server for app \`${this.appName}'`);
    this.server = this.app
      .listen(port, () => {
        Logger.info(`Listening on port ${port}`);
        Logger.info(`Serving on ${chalk.green.bold('http://0.0.0.0:' + port)}`);
        opn(`http://0.0.0.0:${port}`);
        process.on('SIGINT', () => {
          Logger.info('Received interrupt, stopping server now');
          this.notifyWS({
            status: 'closing',
            message: 'Server is stopping now, bye!',
          });
          this.endWatchClient();
          Logger.info('Goodbye!');
          this.server.close();
          process.exit(0);
        });
      })
      .on('error', err => {
        Logger.error(err);
        if (this.tries > 5) {
          Logger.error('Cannot find a free port, bailing out now!');
          Logger.warn(
            'Try starting the server by specifying a port number using --port <number>'
          );
          process.exit(1);
        }
        Logger.warn(`Retrying on port ${port + 1}`);
        this.boot(port + 1);
      });
  }
};
