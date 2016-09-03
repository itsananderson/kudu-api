"use strict";

var gulp = require("gulp");
var mocha = require("gulp-mocha");
var jslint = require("gulp-byo-jslint");

var libSources = ["gulpfile.js", "lib/webjobs.js"];
var testSources = ["test/webjobs.js"];

gulp.task("default");

gulp.task("lint-lib", function () {
    return gulp.src(libSources).pipe(jslint({
        jslint: "submodules/JSLint/jslint.js",
        options: {
            node: true
        },
        noFail: true
    }));
});

gulp.task("lint-test", function () {
    return gulp.src(testSources).pipe(jslint({
        jslint: "submodules/JSLint/jslint.js",
        options: {
            node: true,
            this: true
        },
        globals: ["describe", "it", "before", "after", "beforeEach", "afterEach"],
        noFail: true
    }));
});

gulp.task("lint-watch", ["lint-lib", "lint-test"], function () {
    gulp.watch(libSources, ["lint-lib"]);
    gulp.watch(testSources, ["lint-test"]);
});

gulp.task("test", function () {
    return gulp.src(["test/*.js"])
        .pipe(mocha());
});
