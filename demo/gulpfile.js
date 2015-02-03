'use strict';
// autoprefix
// jshint
// imagemin

var gulp = require('gulp');
var browserSync = require('browser-sync');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");
var concat = require('gulp-concat');


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

    gulp.src([
            'bower_components/todomvc-common/base.js',
            'bower_components/jquery/dist/jquery.js',
            'bower_components/handlebars/handlebars.js',
            'bower_components/director/build/director.js',
            './js/app.js'
        ])
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(rename(function (path) {
            path.extname = '.min.js';
        }))
        .pipe(gulp.dest('build'));

});
