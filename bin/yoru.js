#!/usr/bin/env node

const program = require('commander');
const newApp = require('./scripts/new');
const server = require('./scripts/server');

program.version('0.1.0');
program
  .command('new <name>')
  .description('create a new Yoru project')
  .action((name, opts) => newApp(name, opts));
program
  .command('serve')
  .alias('run')
  .option('-p, --port <n>', 'set the port number to listen to', parseInt)
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
