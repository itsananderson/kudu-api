"use strict";

var gulp = require("gulp");
var mocha = require("gulp-mocha");
var eslint = require("gulp-eslint");

var libSources = ["gulpfile.js", "lib/**/*.js"];
var testSources = ["test/**/*.js"];
var allSources = libSources.concat(testSources);

gulp.task("lint", function () {
    return gulp.src(allSources)
        .pipe(eslint())
        .pipe(eslint.format());
});

gulp.task("watch-lint", gulp.series("lint", function () {
    return gulp.watch(allSources, ["lint"]);
}));

gulp.task("test", function () {
    return gulp.src(testSources)
        .pipe(mocha());
});

gulp.task("watch-test", gulp.series("test", function () {
    return gulp.watch(allSources, ["test"]);
}));

gulp.task("watch", gulp.parallel("watch-lint", "watch-test"));
