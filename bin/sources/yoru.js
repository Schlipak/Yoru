#!/usr/bin/env node

require('babel-core/register');
require('babel-polyfill');

const program = require('commander');
const newApp = require('./scripts/new');
const server = require('./scripts/server');

const { Scribe } = require('./scripts/utils');
const pjson = require('../package.json');

program.version(pjson.version);
program
  .command('new <name>')
  .option(
    '-m, --manager <manager>',
    'sets the package manager to use for dependencies',
    /^(npm|yarn)$/i,
    'npm'
  )
  .description('create a new Yoru project')
  .action((name, opts) => {
    const manager = Scribe.lower(opts.manager);
    newApp(name, manager);
  });
program
  .command('serve')
  .alias('run')
  .option('-p, --port <number>', 'set the port number to listen to', parseInt)
  .description('runs the app')
  .action(options => {
    const port = options.port || 3000;
    const serv = new server(port);
    serv.boot(port);
  });
program.parse(process.argv);

if (program.args.length === 0) {
  program.help();
}
