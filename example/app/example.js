const initApp = function initApp() {
  if (window.Yoru) {
    const app = new Yoru.App();

    app.registerComponent('DemoHeading', {
      classes: ['heading'],

      model() {
        return {
          appLogo: '夜',
          appTitle: 'ＹＯＲＵ',
          versionNumber: Yoru.VERSION,
        };
      },
    });

    app.registerComponent('AppIcon', {
      color: '#FFF',
      strokeColor: '#000',

      model() {
        return {
          color: this.get('color'),
          strokeColor: this.get('strokeColor'),
        };
      },

      afterAppend() {
        const shadow = this.get('shadow');
        const icon = shadow.querySelector('svg');
        Yoru.Run.later(() => {
          icon.classList.add('animating');
          Yoru.Run.later(() => {
            icon.classList.remove('animating');
          }, 4500);
        }, 5000);
      },
    });

    app.registerComponent('DemoContent', {
      model() {
        return {
          appName: '\\{{appName}}',
          content: '\\{{content}}',
        };
      },
    });

    app.registerComponent('CodeBlock', {
      model() {
        return { lang: 'js' };
      },

      afterAppend() {
        if (window.hljs) {
          const block = this.get('shadow').querySelector('pre code');
          hljs.highlightBlock(block);
          hljs.lineNumbersBlock(block);
        }
      }
    });

    app.registerComponent('demoFooter', {
      model() {
        return {};
      },
    });

    app.boot().then(() => {
      Yoru.Logger.info('App is now done booting');
    });
  }
};

document.addEventListener('WebComponentsReady', initApp);
