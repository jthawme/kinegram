'use strict';

const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const shared = require('./webpack.shared.js');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const StatsPlugin = require('stats-webpack-plugin');
const ManifestCreatePlugin = require('../config/manifestCreate.js');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const appConfig = require('../app/config.js');

module.exports = merge.smart(shared, {
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new ExtractTextPlugin('static/css/[hash].min.css'),
    new FaviconsWebpackPlugin({
      logo: path.join(shared._sharedRoot, 'app', 'images', 'favicon.png'),
      persistentCache: true,
      inject: true,
      prefix: 'icons/'
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
        screw_ie8: true
      }
    }),
    new StatsPlugin('webpack.stats.json', {
      source: false,
      modules: false
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new CopyWebpackPlugin([
      { from: 'app/app.yaml' },
      { from: 'app/.well-known/acme-challenge', to: 'acme-challenge' },
      { from: 'app/images/social.png', to: 'static/images' }
    ]),
    new ManifestCreatePlugin(appConfig)
  ],
  module: {
    loaders: [
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader!postcss-loader')
      }
    ]
  }
});
