'use strict';

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const root = path.join(__dirname, '..');

module.exports = {
  _sharedRoot: root,
  entry: [
    path.join(root, 'app', 'main.js')
  ],
  output: {
    path: path.join(root, 'dist'),
    filename: 'static/js/[hash].js',
    publicPath: '/'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'app/index.tpl.html',
      inject: 'body',
      filename: 'index.html'
    })
  ],
  resolve: {
    root: path.resolve(path.join(root, 'app')),
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          'presets': ['react', 'es2015', 'stage-0', 'react-hmre']
        }
      },
      {
        test: /\.json?$/,
        loader: 'json-loader'
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.(jpg|gif|svg|png)$/,
        loader: 'file?name=static/images/[hash].[ext]'
      }
    ]
  },
  postcss: [
    require('autoprefixer')
  ]
};
