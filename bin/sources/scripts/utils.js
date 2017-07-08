// Utils

const chalk = require('chalk');
const spawnAsync = require('spawn-async');

const VERBS = [
  { name: 'log', color: 'bold' },
  { name: 'debug', color: 'cyan' },
  { name: 'info', color: 'blue' },
  { name: 'warn', color: 'yellow' },
  { name: 'error', color: 'red' },
  { name: 'http', color: 'bold' },
];

const LoggerProxyHandler = {
  get: (target, req) => {
    const verb = VERBS.find(v => v.name === req) || {
      name: req,
      color: 'magenta',
    };
    return message => {
      (console[verb.name] || console.log)(
        `\r[${chalk[verb.color](verb.name.toUpperCase())}] ${message}`
      );
    };
  },
};
const Logger = new Proxy({}, LoggerProxyHandler);

const SilentLogger = {};
VERBS.forEach(verb => {
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

const ShSpawn = async function ShSpawn(command, opts) {
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

  constantize: function(str = '') {
    let words = str.split(/[-_\s]|(?=[A-Z])/);
    return words
      .map(word => {
        return Scribe.capitalize(Scribe.lower(word));
      })
      .join('');
  },

  camelize: function(str = '') {
    const constant = Scribe.constantize(str);
    return Scribe.lower(constant.charAt(0)) + constant.slice(1);
  },

  dasherize: function(str = '') {
    let words = str.split(/(?=[A-Z])|[-_]/);
    return words
      .map(word => {
        return Scribe.lower(word);
      })
      .join('-');
  },
};

module.exports = {
  Logger: Logger,
  SilentLogger: SilentLogger,
  Run: Run,
  ShSpawn: ShSpawn,
  Scribe: Scribe,
};
