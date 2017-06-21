#!/usr/bin/env node

const program = require('commander');
const newApp = require('./scripts/new');
const server = require('./scripts/server');

const { Scribe } = require('./scripts/utils');

program.version('0.1.0');
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
