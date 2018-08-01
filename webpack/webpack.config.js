'use strict';

const webpack = require('webpack');
const merge = require('webpack-merge');
const shared = require('./webpack.shared.js');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const sharedRoot = shared._sharedRoot;
delete shared._sharedRoot;

module.exports = merge.smart(shared, {
  devtool: 'eval-source-map',
  entry: [
    'webpack-hot-middleware/client?reload=true'
  ],
  output: {
    path: path.join(sharedRoot, '/dist/'),
    filename: '[name].js',
    publicPath: '/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    new HtmlWebpackPlugin({
      template: 'app/index.tpl.html',
      inject: 'body',
      filename: 'index.html'
    })
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['react', 'env', 'react-hmre'],
            plugins: ['syntax-dynamic-import', 'transform-class-properties']
          }
        }
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader",
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: function () {
                return [
                  require('autoprefixer')
                ];
              }
            }
          },
          {
            loader: "sass-loader"
          }
        ]
      },
    ]
  }
});
