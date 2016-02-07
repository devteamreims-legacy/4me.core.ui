// Karma configuration
// Generated on Wed Nov 18 2015 14:41:54 GMT+0100 (CET)

var webpackConf = require('../webpack.config.js');


webpackConf.module.noParse = [
    /node_modules\/sinon\//
  ];

webpackConf.resolve = {
    alias: {
      sinon: 'sinon/pkg/sinon.js'
    }
  };

console.log(webpackConf);

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '../',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha'],


    // list of files / patterns to load in the browser
    files: [
      'test/function-bind-polyfill.js', // Workaround for PhantomJS 1.9
      'test/unit/setup.js',
      'test/unit/**/*.js',
      'organs/**/test/**/*.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'test/unit/setup.js': ['webpack', 'sourcemap']
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
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultanous
    concurrency: Infinity,


    // Plugins
    plugins: [
      require('karma-webpack'),
      require('karma-phantomjs-launcher'),
      require('karma-mocha'),
      require('karma-sourcemap-loader')
    ],

    // Webpack configuration

    webpack: webpackConf

  })
}
