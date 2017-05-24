// Webpack config

const path = require('path');

module.exports = {
  resolve: {
    alias: {
      handlebars: 'handlebars/dist/handlebars.js',
    },
    modules: [path.resolve(__dirname, 'tmp'), 'node_modules'],
  },
};
