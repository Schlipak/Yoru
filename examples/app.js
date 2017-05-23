const initApp = function initApp() {
  if (window.Yoru) {
    const app = new Yoru();

    app.registerComponent('DemoTitle', {
      model() {
        return {
          appLogo: '夜',
          appTitle: 'ＹＯＲＵ',
          generatedAt: new Date(),
        };
      },
    });

    app.registerComponent('MyComponent', {
      title: 'Test of components',

      test: function() {
        return this.get('title');
      },

      model() {
        return {
          title: this.get('test'),
          url: 'https://unsplash.it/150/150',
        };
      },
    });

    app.registerComponent('ImageList', {
      images: [
        { title: 'Walrus', url: 'https://unsplash.it/200/200?image=1084' },
        { title: 'Sling Ring', url: 'https://unsplash.it/200/200?image=1079' },
        { title: 'Strawberry', url: 'https://unsplash.it/200/200?image=1080' },
        { title: 'Kitten', url: 'https://unsplash.it/200/200?image=1074' },
      ],

      model() {
        return {
          images: this.get('images'),
        };
      },
    });

    app.boot();
  }
};

document.addEventListener('DOMContentLoaded', initApp);
