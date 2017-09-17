var gulp = require('gulp');
var fs = require('fs');
var tagVersion = require('gulp-tag-version');
var conventionalChangelog = require('gulp-conventional-changelog');
var markdown = require('gulp-markdown');

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*']
});



module.exports = function (options) {

  function inc(importance, done) {
    return gulp.src(['./bower.json', './package.json'])
      .pipe($.bump({ type: importance }))
      .pipe(gulp.dest('./'))
      .pipe($.git.commit('chore: bumps package version'))
      .pipe($.filter('package.json'))
      .pipe(tagVersion())
      .on('end', done);
  }

  gulp.task('changelog', function () {
    return gulp.src('CHANGELOG.md', { buffer: false })
      .pipe(conventionalChangelog({ preset: 'angular' }))
      .pipe(gulp.dest('./'));
  });

  gulp.task('changelog-html', ['changelog'], function () {
    return gulp.src('CHANGELOG.md')
      .pipe($.markdown())
      .pipe(gulp.dest('./'));
  });


  gulp.task('version:patch', ['changelog-html'], function (done) {
    inc('patch', done);
  });
  gulp.task('version:minor', ['changelog-html'], function (done) {
    inc('minor', done);
  });
  gulp.task('version:major', ['changelog-html'], function (done) {
    inc('major', done);
  });
}
