'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var wiredep = require('wiredep').stream;
var fs = require('fs');

module.exports = function(options) {

  function doInject() {
    const fileName = options.tmp + '/serve/app/index.js';
    const exists = fs.existsSync(fileName);
    if(!exists) {
      fs.writeFileSync(fileName, 'no content', 'utf8');
    }

    var injectStyles = gulp.src([
      options.tmp + '/serve/app/**/*.css',
      '!' + options.tmp + '/serve/app/vendor.css'
    ], { read: false });

    var injectScripts = gulp.src([
      options.tmp + '/serve/app/**/*.js',
      '!' + options.src + '/app/**/*.spec.js',
      '!' + options.src + '/app/**/*.mock.js'
    ], { read: false });

    var injectSvg = gulp.src([
      options.tmp + '/serve/app/**/*.svg',
    ], { read: false });

    var injectOptions = {
      ignorePath: [options.src, options.tmp + '/serve'],
      addRootSlash: false
    };

    return gulp.src(options.src + '/*.html')
      .pipe($.inject(injectStyles, injectOptions))
      .pipe($.inject(injectScripts, injectOptions))
      .pipe($.inject(injectSvg, injectOptions ))
      .pipe(wiredep(options.wiredep))
      .pipe(gulp.dest(options.tmp + '/serve'));
  }

  gulp.task('inject:watch', ['scripts:watch','styles'], function() {
    return doInject();
  });
  gulp.task('inject', ['scripts','styles'], function() {
    return doInject();
  });
};
