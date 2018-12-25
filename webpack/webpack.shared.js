'use strict';

const path = require('path');
const root = path.join(__dirname, '..');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const metaJson = require('../context/meta.json');

module.exports = {
  _sharedRoot: root,
  entry: [
    path.join(root, 'public', 'main.js')
  ],
  resolve: {
    modules: [
      path.resolve('./public'),
      'node_modules'
    ],
    extensions: ['.js', '.jsx']
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: 'public/images/social.png',
        to: 'images'
      }
    ]),
    new HtmlWebpackPlugin({
      title: metaJson.title,
      description: metaJson.description,
      url: metaJson.url,
      template: 'public/templates/default.html',
      inject: 'body',
      filename: process.env.NODE_ENV === 'development' ? 'index.html' : '../index.html'
    })
  ],
  module: {
    rules: [
      {
        test: /\.(jpg|gif|svg|png)$/,
        loader: 'file-loader',
        options: {
          name: 'images/[hash].[ext]'
        }
      },
      {
        test: /\.svg$/,
        issuer: /\.js$/,
        loader: 'svg-inline-loader'
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        issuer: /\.scss$/,
        options: {
          limit: 10000,
          name: 'css/font/[hash].[ext]',
          publicPath: '../'
        }
      }
    ]
  }
};
