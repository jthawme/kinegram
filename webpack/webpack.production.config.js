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
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const appConfig = require('../app/config.js');

const cssText = new ExtractTextPlugin({ filename: 'static/css/[hash].min.css' });
const manifestText = new ExtractTextPlugin({ filename: 'manifest.json' });

const sharedRoot = shared._sharedRoot;
delete shared._sharedRoot;

module.exports = merge.smart(shared, {
  output: {
    path: path.join(sharedRoot, 'dist'),
    filename: 'static/js/[name]-[hash].js',
    chunkFilename: 'static/js/[name]-[hash].js',
    publicPath: '/'
  },
  plugins: [
    new FaviconsWebpackPlugin({
      logo: path.join(sharedRoot, 'app', 'images', 'favicon.png'),
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
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest'],
      filename: 'static/js/[name]-[hash].js',
      minChunks: function commonChunks(module) {
        return module.context && module.context.indexOf('node_modules') !== -1;
      }
    }),
    new CopyWebpackPlugin([
      // { from: 'app/.well-known/acme-challenge', to: 'acme-challenge' },
      { from: 'app/app.yaml' },
      { from: 'app/images/social.png', to: 'static/images' }
    ]),
    new ManifestCreatePlugin(appConfig),
    new SWPrecacheWebpackPlugin(
      {
        cacheId: 'react-boilerplate',
        filename: 'sw.js',
        maximumFileSizeToCacheInBytes: 4194304,
        minify: true,
        staticFileGlobs: [
          'dist/static/images/**.*',
          'dist/static/css/*',
          'dist/static/js/*',
          'dist/index.html'
        ],
        stripPrefix: 'dist/',
        runtimeCaching: [
          {
            handler: 'fastest',
            urlPattern: /https?:\/\/fonts.+/
          }
        ]
      }
    ),
    manifestText,
    cssText,
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
            presets: ['react', 'env'],
            plugins: ['syntax-dynamic-import']
          }
        }
      },
      {
        test: /\.scss$/,
        loader: cssText.extract({
          fallback: 'style-loader',
          use: [
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
        })
      }
    ]
  }
});
