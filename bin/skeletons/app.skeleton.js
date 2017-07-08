const init = function init() {
  if (window.Yoru) {
    // Change mode to 'production' before deploying
    const app = new Yoru.App('development');

    // Register your components
    app.registerComponent('HelloYoru', {
      model() {
        return {};
      },
    });

    app.boot().then(() => {
      // Run after booting
    });
  }
};

document.addEventListener('DOMContentLoaded', init);
