//
// 夜/小物/run.js
//

const Run = {
  async: function() {
    return Run.later(...arguments, 0);
  },

  later: function() {
    const args = Array.from(arguments);
    let [timeout, ...callbacks] = args.reverse();
    timeout = parseInt(timeout) || 0;
    callbacks = callbacks.reverse();

    let runIds = [];
    callbacks.forEach(callback => {
      if (typeof callback !== typeof (() => {})) {
        throw new Error('Callback is not a function');
      }
      runIds.push(setTimeout(callback, timeout));
    });
    return runIds;
  },
};

export default Run;
