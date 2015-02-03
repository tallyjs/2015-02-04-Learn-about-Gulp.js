'use strict';
// uglify
// concatenate
// autoprefix
// watch
// jshint
// imagemin

var gulp = require('gulp');
var browserSync = require('browser-sync');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");


gulp.task('dev', [
    'browser-sync',
    'watch-js'
]);

gulp.task('browser-sync', function () {

    browserSync({
        server: {
            baseDir: "./"
        }
    });

    gulp.watch([
        './**/*',
        '!./bower_components/**/*',
        '!./node_modules/**/*'
    ], browserSync.reload);

});

gulp.task('watch-js', ['build-js'], function () {
    gulp.watch('./js/app.js', ['build-js']);
});

gulp.task('build-js', function () {

    gulp.src('./js/app.js')
        .pipe(uglify())
        .pipe(rename(function (path) {
            path.extname = '.min.js';
        }))
        .pipe(gulp.dest('build'));

});
