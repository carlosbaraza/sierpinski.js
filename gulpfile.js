var gulp        = require('gulp'),
    babelify    = require('babelify'),
    browserify  = require('browserify'),
    source      = require('vinyl-source-stream');

// BrowserSync (Eases development)
var browserSync = require('browser-sync').create(),
    reload      = browserSync.reload;

// NPM dependencies that we don't want to bundle with our scripts.
var dependencies = ['lodash'];

// Bundle ES2015 client scripts
gulp.task('scripts:client', function () {
  return browserify(['client/scripts/app.js'], { debug: true })
    .external(dependencies)
    .transform(babelify)
    .bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest('dist/client/scripts'));
});

// Bundle NPM vendor libs
gulp.task('scripts:vendor:client', function () {
  return browserify()
    .require(dependencies)
    .bundle()
    .pipe(source('vendor.js'))
    .pipe(gulp.dest('dist/client/scripts'));
});

gulp.task('watch', function() {
  // Serve statically all the files in the folder in order to ease development.
  browserSync.init({
      server: { baseDir: "./" }
  });

  gulp.watch('client/**/*.js', ['scripts:client']).on('change', reload);
});

gulp.task('default', ['scripts:client', 'scripts:vendor:client', 'watch']);
