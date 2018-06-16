'use strict';

const webpack = require('webpack');
const merge = require('webpack-merge');
const shared = require('./webpack.shared.js');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const ManifestCreatePlugin = require('../config/manifestCreate.js');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');

const appConfig = require('../app/config.js');

const sharedRoot = shared._sharedRoot;
delete shared._sharedRoot;

const themeName = 'custom-theme';
const publicPath = '/wp-content/themes/' + themeName + '/dist/';

const cssText = new ExtractTextPlugin({ filename: 'static/css/styles.min.css' });
const manifestText = new ExtractTextPlugin({ filename: 'manifest.json' });

module.exports = merge.smart(shared, {
  output: {
    path: path.join(sharedRoot, '../' + themeName + '/dist'),
    filename: 'static/js/bundle.js',
    chunkFilename: 'static/js/[name]-[hash].js',
    publicPath: publicPath
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
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest'],
      filename: 'static/js/[name]-[hash].js',
      minChunks: function commonChunks(module) {
        return module.context && module.context.indexOf('node_modules') !== -1;
      }
    }),
    new CopyWebpackPlugin([
      { from: 'app/wordpress', to: '../' },
      { from: 'app/images/social.png', to: 'static/images' }
    ]),
    new ManifestCreatePlugin(appConfig),
    new SWPrecacheWebpackPlugin(
      {
        cacheId: themeName,
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
    cssText
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
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        issuer: /\.scss$/,
        options: {
          limit: 10000,
          name: 'static/css/font/[hash].[ext]',
          publicPath: publicPath
        }
      },
    ]
  }
});
