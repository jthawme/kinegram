'use strict';

const webpack = require('webpack');
const merge = require('webpack-merge');
const shared = require('./webpack.shared.js');

module.exports = merge.smart(shared, {
  devtool: 'eval-source-map',
  entry: [
    'webpack-hot-middleware/client?reload=true'
  ],
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ],
  module: {
    loaders: [
      {
        test: /\.scss$/,
        loaders: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
      }
    ]
  }
});
