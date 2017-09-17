'use strict';

var gulp = require('gulp');
var map = require('map-stream');
var es = require('event-stream');
var fs = require('fs');

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

function onlyDir(es) {
  return es.map(function (file, cb) {
    if (file.stat.isFile()) {
      return cb(null, file);
    } else {
      return cb();
    }
  });
};

module.exports = function (options) {

  gulp.task('html', ['inject'], function () {
    var htmlFilter = $.filter('*.html');
    var jsFilter = $.filter('**/*.js');
    var cssFilter = $.filter('**/*.css');
    var assets;

    var pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    var gitSha = '1'

    return gulp.src(options.tmp + '/serve/*.html')
      .pipe(assets = $.useref.assets())
      .pipe($.rev())
      .pipe(jsFilter)
      .pipe($.sourcemaps.init({ loadMaps: true }))
      .pipe($.ngAnnotate())
      .pipe($.uglify({ preserveComments: $.uglifySaveLicense, mangle: false })).on('error', options.errorHandler('Uglify'))
      .pipe($.sourcemaps.write('./'))
      .pipe(jsFilter.restore())
      .pipe(cssFilter)
      .pipe($.csso())
      .pipe(cssFilter.restore())
      .pipe(assets.restore())
      .pipe($.useref())
      .pipe($.revReplace())
      .pipe(htmlFilter)
      .pipe($.replace('@@version', pkg.version))
      .pipe($.replace('@@commitSha', gitSha))
      .pipe($.minifyHtml({
        empty: true,
        spare: true,
        quotes: true,
        conditionals: true
      }))
      .pipe(htmlFilter.restore())
      .pipe(gulp.dest(options.dist + '/'))
      .pipe($.size({ title: options.dist + '/', showFiles: true }));
  });

  // Only applies for fonts from bower dependencies
  // Custom fonts are handled by the "other" task
  gulp.task('fonts', function () {
    return gulp.src($.mainBowerFiles())
      .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
      .pipe($.flatten())
      .pipe(gulp.dest(options.dist + '/fonts/'));
  });

  gulp.task('other', function () {
    return gulp.src([
      options.src + '/**/*',
      '!' + options.src + '/**/*.{html,css,js,ts,scss}'
    ])
      .pipe(onlyDir(es))
      .pipe(gulp.dest(options.dist + '/'));
  });

  gulp.task("checkLinting", function () {
    gulp.src([
      options.src + '/app/**/*.ts'
    ])
      .pipe($.tslint({
        formatter: "verbose"
      }))
      .pipe($.tslint.report({
        emitError: true,
        reportLimit: 0,
        summarizeFailureOutput: false
      }))
  });

  gulp.task('clean', function (done) {
    $.del([options.dist + '/', options.tmp + '/'], { force: true }, done);
  });


  gulp.task('dist', ['html', 'fonts', 'other', 'languages']);
  gulp.task('build', ['dist', 'generate-service-worker']);

};
