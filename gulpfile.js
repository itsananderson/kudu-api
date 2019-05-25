var gulp = require("gulp");
var mocha = require("gulp-mocha");
var eslint = require("gulp-eslint");
var ts = require("gulp-typescript");
var merge = require("merge2");
var libSources = ["lib/**/*.ts"];
var testSources = ["test/**/*.ts"];
var allSources = libSources.concat(testSources);

var builtTestFiles = ["dist/test/**/*.js"];

gulp.task("build", function() {
    var tsResult = gulp.src(allSources)
        .pipe(ts({
            declaration: true
        }));
    return merge([
        tsResult.dts.pipe(gulp.dest('definitions')),
        tsResult.js.pipe(gulp.dest('dist'))
    ]);
})

gulp.task("lint", function () {
    return gulp.src(allSources)
        .pipe(eslint())
        .pipe(eslint.format());
});

gulp.task("watch-lint", gulp.series("lint", function () {
    return gulp.watch(allSources, ["lint"]);
}));

gulp.task("test", gulp.series("build", function () {
    return gulp.src(builtTestFiles)
        .pipe(mocha());
}));

gulp.task("watch-test", gulp.series("test", function () {
    return gulp.watch(allSources, ["test"]);
}));

gulp.task("watch", gulp.parallel("watch-lint", "watch-test"));
