const initApp = function initApp() {
  if (window.Yoru) {
    const app = new Yoru();

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
    });

    app.boot().then(() => {
      if (window.hljs) {
        const codeBlocks = app.find('pre code');
        codeBlocks.forEach(block => {
          hljs.highlightBlock(block);
          hljs.lineNumbersBlock(block);
        });
      }
    });
  }
};

document.addEventListener('DOMContentLoaded', initApp);
