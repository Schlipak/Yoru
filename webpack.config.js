// Webpack config

const Webpack = require('webpack');
const Path    = require('path');

module.exports = {
  entry: ['babel-polyfill', './tmp/yoru.js'],
  resolve: {
    alias: {
      handlebars: 'handlebars/dist/handlebars.js',
    },
    modules: [Path.resolve(__dirname, 'tmp'), 'node_modules'],
  },
  plugins: [
    new Webpack.DefinePlugin({
      VERSION: JSON.stringify(require('./package.json').version),
    }),
  ],
};
