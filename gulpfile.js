const gulp       = require('gulp');
const concat     = require('gulp-concat');
const uglify     = require('gulp-uglify');
const watch      = require('gulp-watch');
const sourcemaps = require('gulp-sourcemaps');
const ngHtml2Js  = require('gulp-ng-html2js');
const pug        = require('gulp-pug');

gulp.task('scripts', () => {
  gulp.src(['./frontend/**/*.js', '!./frontend/**/*.test.js','!./frontend/app.min.js'])
    .pipe(sourcemaps.init())
      .pipe(concat('./app.min.js'))
      .pipe(uglify({mangle: true}))
      .pipe(gulp.dest('frontend'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('frontend'));
});

gulp.task('maps', () => {
  gulp.src(['./public/lib/*.js'])
  .pipe(sourcemaps.init())
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest('./public/lib'));
});

gulp.task('pug', () => {
  gulp.src(['./frontend/**/*.pug']).pipe(pug({})).pipe(gulp.dest('./frontend'));
});

gulp.task('watchJS', () => {
  watch(['./frontend/**/*.js', '!./frontend/**/*.test.js', '!./frontend/app.min.js'], () => {
    gulp.start('scripts');
  });
});

gulp.task('watchPug', () => {
  watch(['./frontend/**/*.pug'], () => {
    gulp.start('pug');
  });
});

gulp.task('default', ['scripts', 'maps', 'pug', 'watchJS', 'watchPug']);
