//
// 夜/小物/run.js
//

import { Logger } from 'yoru/komono';

class RunInstance {
  constructor(id) {
    this.id = id;
    this.done = false;
  }

  cancel() {
    clearTimeout(this.get('id'));
    this.set('done', true);
  }
}

const Run = {
  RunInstance: RunInstance,

  async: function() {
    return Run.later(...arguments, 0);
  },

  later: function() {
    const args = Array.from(arguments);
    let [timeout, ...callbacks] = args.reverse();
    timeout = parseInt(timeout) || 0;
    callbacks = callbacks.reverse();

    let runs = [];
    callbacks.forEach(callback => {
      if (typeof callback !== typeof (() => {})) {
        throw new Error('Callback is not a function');
      }
      let runInstance = new RunInstance(setTimeout(callback, timeout));
      runs.push(runInstance);
    });
    return runs;
  },

  cancel: function() {
    const args = Array.from(arguments);
    args.forEach(run => {
      if (
        typeof run !== typeof {} ||
        run.constructor.name !== RunInstance.name
      ) {
        let type = typeof run;
        if (type === typeof {}) {
          type += `[${run.constructor.name}]`;
        }
        Logger.warn(`Argument is not a RunInstance (was ${type})`);
      } else {
        run.cancel();
      }
    });
  },
};

export default Run;
