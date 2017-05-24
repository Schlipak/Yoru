// Webpack config

const path = require('path');

module.exports = {
  entry: ['babel-polyfill', './tmp/yoru.js'],
  resolve: {
    alias: {
      handlebars: 'handlebars/dist/handlebars.js',
    },
    modules: [path.resolve(__dirname, 'tmp'), 'node_modules'],
  },
};
