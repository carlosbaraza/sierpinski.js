var gulp        = require('gulp'),
    babelify    = require('babelify'),
    browserify  = require('browserify'),
    source      = require('vinyl-source-stream'),
    sass        = require('gulp-sass'),
    gutil       = require('gulp-util'),
    exec        = require('child_process').exec,
    through     = require('through2');

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

// Bundle ES2015 client web worker scripts
gulp.task('scripts:client:workers', function () {
  return browserify(['client/scripts-workers/grid-controller.js'], { debug: true })
    .external(dependencies)
    .transform(babelify)
    .bundle()
    .pipe(source('grid-worker.js'))
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
// Tests
/******************************************************************************/
var Server = require('karma').Server;

// Run test once and exit
gulp.task('test', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

// Watch for file changes and re-run tests on each change
gulp.task('tdd', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js'
  }, done).start();
});

/******************************************************************************/
// Documentation
/******************************************************************************/

gulp.task('doc',function () {
  var sourceFilePaths = [];

  gulp.src('client/**/*.js')
    .pipe(through.obj(function getPaths(file, enc, done) {
      sourceFilePaths.push(file.path);
      done();
    }))
    .on('finish', function () {
      runDocGenerator();
    });

  function runDocGenerator() {
    var cmd = './node_modules/.bin/jsdoc -c jsdoc.conf.json ' +
              sourceFilePaths.join(' ');
    gutil.log('Generating documentation...');
    gutil.log('Executing command:', gutil.colors.magenta(cmd));
    exec(cmd, function (err, stdout, stderr) {
      if (stdout) console.log(stdout);
      if (stderr) console.log(stderr);
      if (err) console.log(err);
      gutil.log(gutil.colors.cyan('Documentation generated in ./doc/!'));
    });
  }
});

/******************************************************************************/
// Other tasks
/******************************************************************************/

gulp.task('watch', function() {
  // Serve statically all the files in the folder in order to ease development.
  browserSync.init({
    server: { baseDir: "./" }
  });

  gulp.watch('client/scripts/**/*.js', ['scripts:client'])
    .on('change', reload);

  gulp.watch('client/scripts-workers/**/*.js', ['scripts:client:workers'])
    .on('change', reload);

  gulp.watch('client/styles/**/*.scss', ['sass'])
    .on('change', reload);
});

gulp.task('default', [
  'scripts:client',
  'scripts:client:workers',
  'scripts:vendor:client',
  'sass',
  'watch',
  'tdd'
]);
