'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();
var stylelint = require("stylelint");
var reporter = require("postcss-reporter");
var autoprefixer = require('autoprefixer');
var autoprefixerConfig = {
  browsers: ['chrome >= 47', 'firefox >= 43', 'ie >= 11', 'ChromeAndroid >= 47', 'ios_saf >= 8.4']
};

var es = require('event-stream');
var wiredep = require('wiredep').stream;

module.exports = function(options) {

  gulp.task('styles:lint', function() {
    gulp.src([
      options.src + '/app/**/*.scss',
      options.src + '/components/**/*.scss'
    ])
    .pipe($.postcss([
      stylelint(),
      reporter({ clearMessages: true })
    ], {syntax: require('postcss-scss')} ))
    .pipe($.size()); // critical: ensures gulp doesn't stop after 16 files: https://github.com/gulpjs/gulp/issues/716
  });

  gulp.task('styles', ['styles:lint'], function() {
    var sassOptions = {
      style: 'expanded'
    };

    var injectFiles = gulp.src([
      options.src + '/{app,components}/**/*.scss',
      '!' + options.src + '/app/index.scss'
    ], { read: false });

    var injectOptions = {
      transform: function(filePath) {
        filePath = filePath.replace(options.src + '/app/', '');
        return '@import \'' + filePath + '\';';
      },
      starttag: '// injector',
      endtag: '// endinjector',
      addRootSlash: false
    };

    return gulp.src([
      options.src + '/app/index.scss'
    ])
      .pipe($.inject(injectFiles, injectOptions))
      .pipe(wiredep(options.wiredep))
      .pipe($.sourcemaps.init())
      .pipe($.sass(sassOptions)).on('error', options.errorHandler('Sass'))
      .pipe($.postcss([
          autoprefixer(autoprefixerConfig)
        ], {syntax: require('postcss-scss')}
      )).on('error', options.errorHandler('Autoprefixer'))
      .pipe($.sourcemaps.write())
      .pipe(gulp.dest(options.tmp + '/serve/app/'))
      .pipe(browserSync.reload({ stream: true }));
  });
};
