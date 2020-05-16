"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var sass = require("gulp-sass");
var concat = require("gulp-concat");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var mqpacker = require("css-mquery-packer");
var sortCSSmq = require("sort-css-media-queries");
var minify = require("gulp-csso");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var svgstore = require("gulp-svgstore");
var svgmin = require("gulp-svgmin");
var webp = require("gulp-webp");
var del = require("del");
var posthtml = require("gulp-posthtml");
var htmlmin = require("gulp-html-minifier-terser");
var jsmin = require("gulp-terser-js");
var server = require("browser-sync").create();

gulp.task("css", function () {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer(),
      mqpacker({sort: sortCSSmq})
    ]))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("images", function() {
  return gulp.src(["!source/img/icons/icon-*.svg", "source/img/**/*.{png,jpg,jpeg,svg}"])
  .pipe(imagemin([
    imagemin.optipng({optimizationLevel: 3}),
    imagemin.mozjpeg({quality: 95, progressive: true}),
    imagemin.svgo()
  ]))
  .pipe(gulp.dest("build/img"));
});

gulp.task("sprite", function() {
  return gulp.src("source/img/icons/icon-*.svg")
  .pipe(svgmin())
  .pipe(svgstore({inlineSvg: true}))
  .pipe(rename("sprite.svg"))
  .pipe(gulp.dest("build/img"));
});

gulp.task("webp", function() {
  return gulp.src("img/**/*.{png,jpg,jpeg}")
  .pipe(webp({quality: 90}))
  .pipe(gulp.dest("build/img"));
});

gulp.task("html", function() {
  return gulp.src("source/*.html")
  .pipe(htmlmin({collapseWhitespace: true, minifyCSS: true}))
  .pipe(gulp.dest("build"));
});

var minifyJS = () =>
  gulp.src("source/js/*.js")
    .pipe(sourcemap.init())
    .pipe(concat("scripts.min.js"))
    .pipe(jsmin({
      mangle: {
        toplevel: true
      }
    }))
    .on("error", function (error) {
      if (error.plugin !== "gulp-terser-js") {
        console.log(error.message)
      }
      this.emit("end")
    })
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/js"))
    .pipe(server.stream());

gulp.task("minifyJS", minifyJS)

gulp.task("clean", function () {
  return del("build");
});

gulp.task("copy", function () {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    "source/img/**",
    "source/*.ico"
    ], {
      base: "source"
    })
.pipe(gulp.dest("build"));
});

gulp.task("refresh", function (done) {
  server.reload();
  done();
});

gulp.task("server", function () {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.scss", gulp.series("css"));
  gulp.watch("source/img/icons/icon-*.svg", gulp.series("sprite", "html", "refresh"));
  gulp.watch("source/js/*.js", gulp.series("minifyJS"));
  gulp.watch("source/*.html", gulp.series("html", "refresh"));
});

gulp.task("build", gulp.series("clean", "copy", "images", "webp", "css", "sprite", "minifyJS", "html"));
gulp.task("start", gulp.series("build", "server"));
