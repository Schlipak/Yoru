#!/usr/bin/env node

const chalk = require('chalk');
const commander = require('commander');
const fs = require('fs-extra');
const ora = require('ora');
const path = require('path');
const spawnAsync = require('spawn-async');

const verbs = [
  { name: 'log', color: 'bold' },
  { name: 'debug', color: 'magenta' },
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

const SilentLogger = {};
verbs.forEach(verb => {
  SilentLogger[verb.name] = () => {};
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

const shspawn = async function shspawn(command, opts) {
  const worker = spawnAsync.createWorker({ log: SilentLogger });
  return new Promise((resolve, reject) => {
    worker.aspawn([command, ...opts], (err, stdout, stderr) => {
      if (err) {
        return reject(err);
      }
      worker.destroy();
      return resolve({ stdout: stdout, stderr: stderr });
    });
  });
};

const Scribe = {
  upper: function(str = '') {
    return str.toUpperCase();
  },

  lower: function(str = '') {
    return str.toLowerCase();
  },

  capitalize: function(str = '') {
    return Scribe.upper(str.charAt(0)) + Scribe.lower(str.slice(1));
  },

  camelize: function(str = '') {
    let words = str.split(/[-_\s]/);
    return words
      .map(word => {
        return Scribe.capitalize(Scribe.lower(word));
      })
      .join('');
  },

  dasherize: function(str = '') {
    let words = str.split(/(?=[A-Z])/);
    return words
      .map(word => {
        return Scribe.lower(word);
      })
      .join('-');
  },
};

const createSkeleton = async function createSkeleton(name) {
  if (fs.existsSync(name)) {
    throw `Path ./${name} already exists, please choose another name`;
  }
  await fs.ensureDir(name);
  process.chdir(name);
  fs.closeSync(fs.openSync('index.html', 'w'));
  await fs.ensureDir('app');
  process.chdir('app');
  fs.closeSync(fs.openSync(`${name}.js`, 'w'));
  await fs.ensureDir('templates');
  await fs.ensureDir('routes');
  return `Created skeleton directory structure in ./${name}`;
};

const createPackageJson = async function createPackageJson(name) {
  const packageDefaults = {
    name: name,
    version: '0.1.0',
    description: 'My new Yoru app',
    main: `app/${name}.js`,
    scripts: {
      test: 'echo "Error: no test specified" && exit 1',
    },
    keywords: ['yoru'],
    author: '',
    license: 'MIT',
    dependencies: {
      yoru: 'https://github.com/Schlipak/Yoru',
    },
  };

  await fs.ensureDir(name);
  process.chdir(name);
  fs.writeFileSync('package.json', JSON.stringify(packageDefaults, null, 2));
  return 'Created package.json';
};

const installDependencies = async function installDependencies(name) {
  await fs.ensureDir(name);
  process.chdir(name);
  const output = await shspawn('npm', ['install']);
  if (output) {
    Run.later(() => {
      if (output.stderr) {
        output.stderr.trim().split('\n').forEach(line => Logger.warn(line));
      }
      if (output.stdout) {
        output.stdout.trim().split('\n').forEach(line => Logger.info(line));
      }
    }, 10);
  }
  return 'Installed dependencies';
};

const newApp = async function newApp(name) {
  name = Scribe.dasherize(name);
  Logger.info(`Creating new Yoru app \`${name}'`);
  try {
    let promise = createSkeleton(name);
    ora.promise(promise, 'Creating skeleton directory structure');
    await promise;
    promise = createPackageJson(name);
    ora.promise(promise, 'Creating package.json');
    await promise;
    promise = installDependencies(name);
    ora.promise(promise, 'Installing dependencies');
    await promise;
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

commander.version('0.1.0');
commander
  .command('new <name>')
  .description('create a new Yoru project')
  .action((name, opts) => newApp(name, opts));
commander.parse(process.argv);
