var gulp = require('gulp');
var gettext = require('gulp-angular-gettext');

module.exports = function (options) {

  gulp.task('translation-template', ['html', 'fonts', 'other'], function () {
    return gulp.src([
      options.src + '/app/**/*.html',
      options.dist + '/scripts/**/*.js'
    ]).pipe(gettext.extract('template.pot', {
    }))
      .pipe(gulp.dest(options.src + '/po/'));
  });


  gulp.task('languages', function () {
    return gulp.src(options.src + '/po/**/*.po')
      .pipe(gettext.compile({
        format: 'json'
      }))
      .pipe(gulp.dest(options.src + '/languages'));
  });
}
