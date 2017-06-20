#!/usr/bin/env node

const chalk = require('chalk');
const commander = require('commander');
const fs = require('fs-extra');
const ora = require('ora');
const path = require('path');

// Import Scribe

const verbs = [
  { name: 'log', color: 'bold' },
  { name: 'info', color: 'blue' },
  { name: 'warn', color: 'yellow' },
  { name: 'error', color: 'red' },
];

const Logger = {};
verbs.forEach(verb => {
  Logger[verb.name] = message => {
    console[verb.name](
      `[${chalk[verb.color](verb.name.toUpperCase())}] ${message}`
    );
  };
});

const Run = {
  later: function(callback, time) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(callback());
      }, time);
    });
  },
};

const createSkeleton = async function createSkeleton(name) {
  if (fs.existsSync(name)) {
    throw `Path ./${name} already exists, please choose another name`;
  }
  try {
    await fs.ensureDir(name);
    process.chdir(name);
    fs.closeSync(fs.openSync('index.html', 'w'));
    await fs.ensureDir('app');
    process.chdir('app');
    fs.closeSync(fs.openSync(`${name}.js`, 'w'));
    await fs.ensureDir('templates');
    await fs.ensureDir('routes');
    return `Created skeleton directory structure in ./${name}`;
  } catch (err) {
    throw err;
  }
};

const newApp = async function newApp(name) {
  Logger.info(`Creating new Yoru app \`${name}'`);
  try {
    const skel = createSkeleton(name);
    ora.promise(skel, 'Creating skeleton directory structure');
    await skel;
  } catch (err) {
    process.exit(1);
  }
};

commander.version('0.1.0');
commander
  .command('new <name>')
  .description('create a new Yoru project')
  .action((name, opts) => newApp(name, opts));
commander.parse(process.argv);
