'use strict';

const webpack = require('webpack');
const merge = require('webpack-merge');
const shared = require('./webpack.shared.js');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const sharedRoot = shared._sharedRoot;
delete shared._sharedRoot;

module.exports = merge.smart(shared, {
  mode: 'development',
  devtool: 'eval-source-map',
  output: {
    path: path.join(sharedRoot, 'dist'),
    filename: 'js/[name].js',
    chunkFilename: 'js/[name].js',
    publicPath: '/'
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 8080
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
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
          'sass-loader'
        ]
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/react', '@babel/env'],
            plugins: ['@babel/syntax-dynamic-import', '@babel/plugin-proposal-class-properties', 'react-hot-loader/babel']
          }
        }
      }
    ]
  }
});
