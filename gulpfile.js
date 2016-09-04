"use strict";

var gulp = require("gulp");
var mocha = require("gulp-mocha");
var eslint = require("gulp-eslint");

var libSources = ["gulpfile.js", "lib/**/*.js"];
var testSources = ["test/**/*.js"];

gulp.task("lint-lib", function () {
    return gulp.src(libSources)
        .pipe(eslint())
        .pipe(eslint.format());
});

gulp.task("lint-test", function () {
    return gulp.src(testSources)
        .pipe(eslint())
        .pipe(eslint.format());
});

gulp.task("lint", ["lint-lib", "lint-test"]);

gulp.task("lint-watch", ["lint"], function () {
    return gulp.watch(libSources.concat(testSources), ["lint"]);
});

gulp.task("test", function () {
    return gulp.src(testSources)
        .pipe(mocha());
});

gulp.task("test-watch", ["test"], function () {
    return gulp.watch(libSources.concat(testSources), ["test"]);
});

gulp.task("watch", ["lint-watch", "test-watch"]);
