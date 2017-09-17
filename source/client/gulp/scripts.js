'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var webpackStream = require('webpack-stream');
var failPlugin = require('webpack-fail-plugin');

var $ = require('gulp-load-plugins')();

module.exports = function (options) {
  function webpack(watch, callback) {
    var webpackOptions = {
      watch: watch,
      debug: true,
      devtool: "inline-source-map",
      resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
      },
      module: {
        preLoaders: [{
          test: /\.ts$/,
          loader: 'tslint-loader',
          exclude: /node_modules|api-services\.js/
        }],
        loaders: [{
          test: /\.ts(x?)$/,
          loader: 'ts-loader',
          exclude: /node_modules|bower_components|typings/
        },
          {
            test: /\.html$/,
            loader: 'raw-loader'
          }
        ]
      },
      plugins: [
        failPlugin
      ],
      externals: [
        'angular'
      ],
      tslint: {
        emitErrors: true,
        failOnHint: true
      },
      output: {
        filename: 'index.js',
        sourceMapFilename: 'index.js.map',
        publicPath: '/app'
      },
    };

    var webpackChangeHandler = function (err, stats) {
      if (err) {
        options.errorHandler('Webpack')(err);
      }
      $.util.log(stats.toString({
        colors: $.util.colors.supportsColor,
        chunks: false,
        hash: false,
        version: false
      }));
      browserSync.reload();
      if (watch) {
        watch = false;
        callback();
      }
    };

    return gulp.src(options.src + '/app/index.ts')
      .pipe(webpackStream(webpackOptions, null, webpackChangeHandler))
      .pipe(gulp.dest(options.tmp + '/serve/app'));
  }

  gulp.task('scripts', function () {
    return webpack(false);
  });

  gulp.task('scripts:watch', function (callback) {
    return webpack(true, callback);
  });
};
