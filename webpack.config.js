// Webpack config

const webpack = require('webpack');
const path = require('path');

module.exports = {
  target: 'web',
  entry: ['babel-polyfill', './tmp/yoru.js'],
  resolve: {
    alias: {
      handlebars: 'handlebars/dist/handlebars.js',
    },
    modules: [path.resolve(__dirname, 'tmp'), 'node_modules'],
  },
  plugins: [
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(require('./package.json').version),
    }),
    new webpack.IgnorePlugin(/vertx/),
  ],
};
