'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var filter = require('gulp-filter');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var autoprefixer = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');


gulp.task('dev', [
    'browser-sync',
    'watch-js',
    'watch-css'
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

gulp.task('watch-css', ['build-css'], function () {
    gulp.watch('./css/app.css', ['build-css']);
});

gulp.task('build-css', function () {

    return gulp.src([
            'bower_components/todomvc-common/base.css',
            './css/app.css'
        ])
        .pipe(concat('app.min.css'))
        .pipe(autoprefixer()) // Good settings: http://analog-ni.co/my-css-autoprefixer-settings-for-ie9-and-up
        .pipe(minifyCSS())
        .pipe(gulp.dest('build'));

});
