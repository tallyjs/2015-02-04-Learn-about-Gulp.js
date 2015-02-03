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


// This task is executed with the command "gulp dev".
// It runs the listed three tasks in parallel.
gulp.task('dev', [
    'browser-sync',
    'watch-js',
    'watch-css'
]);

// This task uses BrowserSync (http://www.browsersync.io) to serve the website.
gulp.task('browser-sync', function () {

    // This call boot the web server that serves all files in the local directory.
    browserSync({
        server: {
            baseDir: "./"
        }
    });

    // Gulp watches the source files and if changes are saved it tells BrowserSync to reload the page in the browser.
    gulp.watch([
        // All files in the local directory and in subdirectories
        './**/*',
        // Except any files in the node_modules folder.
        '!./node_modules/**/*'
    ], browserSync.reload);

});

// This task watches app.js for changes to execute the build-js task.
// Also the build-js task is executed before the watch-js task is executed by the dev task.
gulp.task('watch-js', ['build-js'], function () {
    gulp.watch('./js/app.js', ['build-js']);
});

// This task produces a single JS file that is loaded by the web page.
gulp.task('build-js', function () {

    var filterAppJs = filter('./js/app.js');

    // Gulp takes all JS files that are needed by the web page.
    return gulp.src([
            'bower_components/todomvc-common/base.js',
            'bower_components/jquery/dist/jquery.js',
            'bower_components/handlebars/handlebars.js',
            'bower_components/director/build/director.js',
            './js/app.js'
        ])
        // All files in the stream are filtered for app.js...
        .pipe(filterAppJs)
            // ...to do code linting just for app.js
            .pipe(jshint())
            // Printing the linting results to the console
            .pipe(jshint.reporter('jshint-stylish'))
            // Fail the build if linting errors are found
            .pipe(jshint.reporter('fail'))
        // Reset the filter so that the stream continues with all 5 JS files
        .pipe(filterAppJs.restore())
        // Init for later generation of the sourcmaps file
        .pipe(sourcemaps.init())
        // All JS files are concatenated. The stream continues with just one combined JS file afterwards.
        .pipe(concat('app.js'))
        // The JS code is minified.
        .pipe(uglify())
        // The JS file is renamed.
        .pipe(rename('app.min.js'))
        // The sourcemaps file is generated. The stream then contains app.min.js and app.min.js.map
        .pipe(sourcemaps.write('./'))
        // All files are saved into the build folder.
        .pipe(gulp.dest('build'));

});

// This task watches app.css for changes to execute the build-css task.
// Also the build-css task is executed before the watch-css task is executed by the dev task.
gulp.task('watch-css', ['build-css'], function () {
    gulp.watch('./css/app.css', ['build-css']);
});

gulp.task('build-css', function () {

    // Gulp takes all CSS files that are needed by the web page.
    return gulp.src([
            'bower_components/todomvc-common/base.css',
            './css/app.css'
        ])
        // All CSS files are concatenated. The stream continues with just one combined CSS file afterwards.
        .pipe(concat('app.min.css'))
        // Specific CSS properties are automatically prefixed according to the caniuse.com database.
        .pipe(autoprefixer()) // Better settings: http://analog-ni.co/my-css-autoprefixer-settings-for-ie9-and-up
        // The CSS code is minified.
        .pipe(minifyCSS())
        // The CSS file is saved into the build folder.
        .pipe(gulp.dest('build'));

});
