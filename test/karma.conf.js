// Karma configuration
// Generated on Wed Nov 18 2015 14:41:54 GMT+0100 (CET)

module.exports = function(config) {
  var wiredep = require('wiredep');
  var bowerFiles = wiredep({devDependancies: true})['js'];

  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '../',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['browserify', 'source-map-support', 'mocha'],


    // list of files / patterns to load in the browser
    files: bowerFiles.concat([
      'test/function-bind-polyfill.js', // Workaround for PhantomJS 1.9
      'test/unit/setup.js',
      'app/**/*.js',
      'organs/**/*.js',
      'dist/scripts/template*.js',
      'test/unit/**/*.js',
      // Fuck Socket.io
      'bower_components/socket.io-client/socket.io.js',
      'bower_components/angular-socket.io-mock/angular-socket.io-mock.js'
    ]),


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'test/unit/setup.js': ['browserify']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultanous
    concurrency: Infinity,

    // Include source maps
    browserify: {
      transform: [
        ['babelify', {presets: ['es2015']}]
      ],
      debug: true // include inline source maps
    }

  })
}
