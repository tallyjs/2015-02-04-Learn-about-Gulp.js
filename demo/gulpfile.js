'use strict';
// uglify
// concatenate
// autoprefix
// watch
// jshint
// imagemin

var gulp = require('gulp');
var browserSync = require('browser-sync');


gulp.task('dev', function () {

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
