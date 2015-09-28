module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['browserify', 'jasmine'],

    files: [
      'dist/client/scripts/vendor.js',
      'test/**/*.js'
    ],

    exclude: [
    ],

    preprocessors: {
      'test/**/*.js': ['browserify']
    },

    browserify: {
      debug: true,
      transform: [ 'babelify' ]
    },

    browsers: ['PhantomJS'],
    phantomjsLauncher: {
      exitOnResourceError: true
    }
  });
};
