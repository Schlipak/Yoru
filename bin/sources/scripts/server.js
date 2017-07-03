// Server

const path = require('path');
const express = require('express');
const chalk = require('chalk');
const opn = require('opn');
const fs = require('fs-extra');

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
    this.appName = getAppName(process.cwd());
    this.setupPaths();
    this.setupMiddleware();
    Logger.info(`Serving for path \`${this.appPath}'`);
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
      if ((req.originalUrl || req.url) === '/' && !this.canAccessIndex) {
        Logger.log(getRequestMessage(req, { statusCode: 418 }));
        return res.status(418).send(this.notFoundHTML);
      }
      next();
    });
    this.app.use((req, res, next) => {
      const _end = res.end;
      res.end = (chunk, encoding) => {
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
