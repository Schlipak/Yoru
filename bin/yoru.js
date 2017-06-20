#!/usr/bin/env node

const commander = require('commander');
const newApp = require('./scripts/new');
const server = require('./scripts/server');

commander.version('0.1.0');
commander
  .command('new <name>')
  .description('create a new Yoru project')
  .action((name, opts) => newApp(name, opts));
commander
  .command('serve')
  .alias('run')
  .option('-p, --port <n>', 'set the port number to listen to', parseInt)
  .description('runs the app')
  .action((options) => {
    const port = options.port || 3000;
    const serv = new server(port);
    serv.boot(port);
  });
commander.parse(process.argv);
