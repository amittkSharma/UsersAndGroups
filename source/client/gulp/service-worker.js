'use strict';

var gulp = require('gulp');
var swPrecache = require('sw-precache');
var path = require('path');
var webpackStream = require('webpack-stream');

module.exports = function (options) {
  gulp.task('generate-service-worker-custom', function() {
    var webpackOptions = {
      watch: false,
      debug: true,
      devtool: "inline-source-map",
      resolve: {
        extensions: ['', '.ts', '.tsx', '.js']
      },
      module: {
        loaders: [{
          test: /\.ts(x?)$/,
          loader: 'ts-loader',
          exclude: /node_modules|bower_components|typings/
        }]
      },
      output: {
        filename: 'sw-dynamic.js',
        sourceMapFilename: 'sw-dynamic.js.map',
        publicPath: '/app'
      },
    };
    return gulp.src(options.src + '/app/sw-dynamic.ts')
      .pipe(webpackStream(webpackOptions))
      .pipe(gulp.dest(options.dist));
  });

 // gulp.task('generate-service-worker',  function (callback) {
  gulp.task('generate-service-worker', ['generate-service-worker-custom'], function (callback) {
    var rootDir = options.dist;
    swPrecache.write(path.join(rootDir, 'sw.js'), {
      cacheId: 'repo-search-app-ui',
      staticFileGlobs: [rootDir + '/**/*.{js,html,css,png,svg}'],
      stripPrefix: rootDir,
      //importScripts: ['/sw-dynamic.js'],
      // maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
      // navigateFallback: '/index.html',
      // runtimeCaching: [
      //   { urlPattern: /\/api\//,
      //     handler: 'networkFirst'
      //   },
      //   { urlPattern: /\/floorplans\/.+\.png/,
      //     handler: 'cacheFirst',
      //     options: {
      //       cache: {
      //         maxEntries: 8,
      //         name: 'floorplan-cache'
      //       }
      //     }
      //   },
      //   { urlPattern: /\.woff/,
      //     handler: 'cacheFirst'
      //   },
      //   { urlPattern: /\/events\//,
      //     handler: 'fastest',
      //     options: {
      //       cache: {
      //         maxEntries: 10,
      //         name: 'event-cache'
      //       }
      //     }
      //   }
      // ]
    }, callback);
  });
}
