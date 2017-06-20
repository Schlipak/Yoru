// Server

const path = require('path');
const express = require('express');
const chalk = require('chalk');

const { Logger, SilentLogger, Run, ShSpawn, Scribe } = require('./utils');

const getRequestMessage = function getRequestMessage(req, res) {
  return [
    `[${req.headers.host}] -->`,
    req.method,
    req.originalUrl || req.url,
  ].join(' ');
};

const getAppName = function getAppName(path) {
  return Scribe.constantize(path.split('/')[path.split('/').length - 1]);
};

module.exports = class server {
  constructor() {
    this.server = express();
    this.appName = getAppName(process.cwd());
    this.staticPath = path.join(process.cwd(), '/app');
    this.scriptPath = path.join(process.cwd(), '/node_modules/yoru/dist/');
    this.server.use((req, res, next) => {
      Logger.log(getRequestMessage(req, res));
      next();
    });
    this.server.use('/', express.static(this.staticPath));
    this.server.use('/vendor', express.static(this.scriptPath));
    Logger.info(`Serving for path \`${this.staticPath}'`);
  }

  boot(port = 3000) {
    Logger.info(`Booting server for app \`${this.appName}'`);
    this.server.listen(port, () => {
      Logger.info(`Listening on port ${port}`);
      Logger.info(`Serving on ${chalk.green.bold('http://0.0.0.0:' + port)}`);
    });
  }
};
