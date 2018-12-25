'use strict';

const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const shared = require('./webpack.shared.js');
const StatsPlugin = require('stats-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')

const metaJson = require('../context/meta.json');

const sharedRoot = shared._sharedRoot;
delete shared._sharedRoot;

module.exports = merge.smart(shared, {
  mode: 'production',
  output: {
    path: path.join(sharedRoot, 'dist', 'static'),
    filename: 'js/[name]-[hash].js',
    chunkFilename: 'js/[name]-[hash].js',
    publicPath: '/static/'
  },
  plugins: [
    new StatsPlugin('webpack.stats.json', {
      source: false,
      modules: false
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new WorkboxPlugin.GenerateSW({
      swDest: '../sw.js',
      clientsClaim: true,
      skipWaiting: true,
      runtimeCaching: [
        {
          handler: 'cacheOnly',
          urlPattern: /https?:\/\/fonts.+/
        }
      ],
      navigateFallback: '/index.html',
    }),
    new WebpackPwaManifest({
      name: metaJson.title,
      short_name: metaJson.short_title,
      description: metaJson.description,
      background_color: metaJson.colour,
      crossorigin: null,
      inject: true,
      publicPath: '/static/',
      icons: [
        {
          src: path.resolve('public/images/favicon.png'),
          sizes: [96, 128, 192, 256, 384, 512] // multiple sizes
        }
      ]
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[hash].min.css',
      chunkFilename: 'css/[id].[hash].min.css'
    }),
    new FaviconsWebpackPlugin({
      logo: path.resolve('public/images/favicon.png'),
      prefix: '../icons/',
      emitStats: false,
      persistentCache: true,
      inject: true,
      background: '#fff',
      title: metaJson.title,
      icons: {
        android: true,
        appleIcon: true,
        appleStartup: true,
        coast: false,
        favicons: true,
        firefox: true,
        opengraph: false,
        twitter: false,
        yandex: false,
        windows: false
      }
    })
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
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
            plugins: ['@babel/syntax-dynamic-import', '@babel/plugin-proposal-class-properties']
          }
        }
      }
    ]
  }
});
