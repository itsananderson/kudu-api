var path = require("path");
var del = require("del");
var gulp = require("gulp");
var mocha = require("gulp-mocha");
var eslint = require("gulp-eslint");
var ts = require("gulp-typescript");
var merge = require("merge2");

var libSources = ["index.ts", "lib/**/*.ts"];
var testSources = ["test/**/*.ts"];
var allSources = libSources.concat(testSources);

var builtTestFiles = ["dist/test/**/*.js"];

function tsDestPath(destFolder) {
  return file => {
    const targetFilePath = path.join(
      destFolder,
      file.path.replace(__dirname, "")
    );
    const targetDirectory = path.dirname(targetFilePath);
    return targetDirectory;
  };
}

gulp.task("clean", function() {
  return del(["definitions/**/*", "dist/**/*"]);
});

gulp.task("build:copy-assets", function() {
  return gulp.src(["test/*.PublishSettings"]).pipe(gulp.dest("dist/test"));
});

gulp.task("build:typescript", function() {
  var tsResult = gulp.src(allSources).pipe(
    ts({
      declaration: true
    })
  );
  return merge([
    tsResult.dts.pipe(gulp.dest(tsDestPath("definitions"))),
    tsResult.js.pipe(gulp.dest(tsDestPath("dist")))
  ]);
});

gulp.task("build", gulp.parallel("build:copy-assets", "build:typescript"));

gulp.task("lint", function() {
  return gulp
    .src(allSources)
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task(
  "watch-lint",
  gulp.series("lint", function() {
    return gulp.watch(allSources, ["lint"]);
  })
);

gulp.task(
  "test",
  gulp.series("build", function() {
    return gulp.src(builtTestFiles).pipe(mocha());
  })
);

gulp.task(
  "watch-test",
  gulp.series("test", function() {
    return gulp.watch(allSources, ["test"]);
  })
);

gulp.task("watch", gulp.parallel("watch-lint", "watch-test"));
