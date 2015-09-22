var gulp        = require('gulp'),
    babelify    = require('babelify'),
    browserify  = require('browserify'),
    source      = require('vinyl-source-stream'),
    sass        = require('gulp-sass');

// BrowserSync (Eases development)
var browserSync = require('browser-sync').create(),
    reload      = browserSync.reload;


/******************************************************************************/
// Scripts
/******************************************************************************/

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


/******************************************************************************/
// Styles
/******************************************************************************/

gulp.task('sass', function () {
  gulp.src('client/styles/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist/client/styles'));
});


/******************************************************************************/
// Other tasks
/******************************************************************************/

gulp.task('watch', function() {
  // Serve statically all the files in the folder in order to ease development.
  browserSync.init({
    server: { baseDir: "./" }
  });

  gulp.watch('client/scripts/**/*.js', ['scripts:client']).on('change', reload);
  gulp.watch('client/styles/**/*.scss', ['sass']).on('change', reload);
});

gulp.task('default', [
  'scripts:client',
  'scripts:vendor:client',
  'sass',
  'watch'
]);
