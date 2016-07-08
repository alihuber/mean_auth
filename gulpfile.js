var gulp       = require('gulp');
var concat     = require('gulp-concat');
var uglify     = require('gulp-uglify');
var watch      = require('gulp-watch');
var sourcemaps = require('gulp-sourcemaps');
var ngHtml2Js  = require('gulp-ng-html2js');
var pug        = require('gulp-pug');

gulp.task('scripts', function() {
  gulp.src(['./frontend/**/*.js', '!./frontend/**/*.test.js','!./frontend/app.min.js'])
    .pipe(sourcemaps.init())
      .pipe(concat('./app.min.js'))
      .pipe(uglify({mangle: true}))
      .pipe(gulp.dest('frontend'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('frontend'));
});

gulp.task('maps', function() {
  gulp.src(['./public/lib/*.js'])
  .pipe(sourcemaps.init())
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest('./public/lib'));
});

gulp.task('pug', function() {
  gulp.src(['./frontend/**/*.pug']).pipe(pug({})).pipe(gulp.dest('./frontend'));
});

gulp.task('watch', function() {
  watch(['./frontend/**/*.js', '!./frontend/**/*.test.js', '!./frontend/app.min.js'], function () {
    gulp.start('scripts');
  });
});

gulp.task('default', ['scripts', 'maps', 'pug', 'watch']);
