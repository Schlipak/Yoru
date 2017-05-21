// 小物/run.js

const Run = {
  async: function() {
    Run.later(...arguments, 0);
  },

  later: function() {
    const args = Array.from(arguments);
    let [timeout, ...callbacks] = args.reverse();
    timeout = parseInt(timeout) || 0;
    callbacks = callbacks.reverse();

    callbacks.forEach(callback => {
      if (typeof callback !== typeof (() => {})) {
        throw new Error('Callback is not a function');
      }
      setTimeout(callback, timeout);
    });
  },
};

export default Run;
