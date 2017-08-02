'use strict'

var gulp = require('gulp');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var exec = require('child_process').exec;
//var spawn = require('child_process').spawn;

gulp.task('sass', function () {
  return gulp.src('./scss/style.scss')
  .pipe(sass().on('error', sass.logError))
  .pipe(concat('style.css'))
  .pipe(gulp.dest('./public/css'))
  .pipe(sass({outputStyle: 'compressed'}))
  .pipe(concat('style.min.css'))
  .pipe(gulp.dest('./public/css'));
});

// Watching SCSS files
gulp.task('sass:watch', function () {
  gulp.watch('./scss/**/*.scss', ['sass']);
});

gulp.task('default', ['sass:watch']);

gulp.task('webdocs', function (cb) {
  console.log('Documentation running at http://127.0.0.1:8000');
  exec('mkdocs serve', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});