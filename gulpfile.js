'use strict';

let gulp = require('gulp');
let concat = require('gulp-concat');
let sass = require('gulp-sass');
let exec = require('child_process').exec;
let open = require('gulp-open');
let wait = require('gulp-wait2');
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
    const address = '127.0.0.1';
    const PORT = 8001;
    console.log(`Documentation running at http://${address}:${PORT}`);
    exec(`mkdocs serve --dev-addr=${address}:${PORT}`, function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });

    let options = {
        uri: `http://${address}:${PORT}`,
        app: 'opera'
    };

    gulp.src(__filename)
      .pipe(wait(4000))
      .pipe(open(options));
});