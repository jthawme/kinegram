'use strict';

const path = require('path');
const root = path.join(__dirname, '..');

module.exports = {
  _sharedRoot: root,
  entry: [
    path.join(root, 'app', 'main.js')
  ],
  resolve: {
    modules: [
      path.resolve('./app'),
      'node_modules'
    ],
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(jpg|gif|svg|png)$/,
        loader: 'file-loader',
        options: {
          name: 'static/images/[hash].[ext]'
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
          name: 'static/css/font/[hash].[ext]',
          publicPath: '../'
        }
      },
      {
        test: /app\.yaml$/,
        use: [
          'raw-loader',
          {
            loader: 'string-replace-loader',
            options: {
              search: '[test]',
              replace: 'bitching'
            }
          }
        ]
      }
    ]
  }
};
