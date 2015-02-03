'use strict';
// autoprefix
// imagemin

var gulp = require('gulp');
var browserSync = require('browser-sync');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var filter = require('gulp-filter');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');


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

    var filterAppJs = filter('./js/app.js');

    return gulp.src([
            'bower_components/todomvc-common/base.js',
            'bower_components/jquery/dist/jquery.js',
            'bower_components/handlebars/handlebars.js',
            'bower_components/director/build/director.js',
            './js/app.js'
        ])
        .pipe(filterAppJs)
            .pipe(jshint())
            .pipe(jshint.reporter('jshint-stylish'))
            .pipe(jshint.reporter('fail'))
        .pipe(filterAppJs.restore())
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(rename('app.min.js'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('build'));

});
