'use strict';

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const root = path.join(__dirname, '..');

module.exports = {
  _sharedRoot: root,
  entry: [
    path.join(root, 'app', 'main.js')
  ],
  plugins: [
    new HtmlWebpackPlugin({
      template: 'app/index.tpl.html',
      inject: 'body',
      filename: 'index.html'
    })
  ],
  resolve: {
    modules: [
      path.resolve('./app'),
      'node_modules'
    ],
    extensions: ['.js', '.jsx']
  },
  module: {
    loaders: [
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
