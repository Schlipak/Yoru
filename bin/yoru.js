#!/usr/bin/env node
'use strict';

require('babel-core/register');
require('babel-polyfill');

var program = require('commander');
var newApp = require('./scripts/new');
var server = require('./scripts/server');

var _require = require('./scripts/utils'),
    Scribe = _require.Scribe;

var pjson = require('../package.json');

program.version(pjson.version);
program.command('new <name>').option('-m, --manager <manager>', 'sets the package manager to use for dependencies', /^(npm|yarn)$/i, 'npm').description('create a new Yoru project').action(function (name, opts) {
  var manager = Scribe.lower(opts.manager);
  newApp(name, manager);
});
program.command('serve').alias('run').option('-p, --port <number>', 'set the port number to listen to', parseInt).description('runs the app').action(function (options) {
  var port = options.port || 3000;
  var serv = new server(port);
  serv.boot(port);
});
program.parse(process.argv);

if (program.args.length === 0) {
  program.help();
}