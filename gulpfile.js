var gulp = require('gulp'),
    webserver = require('gulp-webserver'),
    del = require('del'),
    sass = require('gulp-sass'),
    debug = require('gulp-debug'),
    eslint = require('gulp-eslint'),
    sourcemaps = require('gulp-sourcemaps'),
//    spritesmith = require('gulp.spritesmith'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    uglify = require('gulp-uglify'),
    gutil = require('gulp-util'),
    concat = require('gulp-concat'),
    replace = require('gulp-replace'),
    mainBowerFiles = require('main-bower-files'),
    debowerify = require('debowerify'),
    wiredep = require('wiredep').stream,
    runSequence = require('run-sequence'),
    connect = require('gulp-connect'),
    CacheBuster = require('gulp-cachebust'),
    babel = require('gulp-babel'),
    karma = require('karma').server;

var cachebust = new CacheBuster();

var config = {
    appFolder:      [
        'app/**/*',
        'styles/**/*',
        'organs/*/styles/**/*',
        'organs/*/app/**/*'
    ],
    sassFolder:     [
        'styles/**/*',
        'organs/*/styles/**/*'
    ],
    jsFolder:       [
        'app/**/*.js',
        'organs/*/app/**/*.js'
    ],
    viewsFolder:    [
        'app/**/*.html',
        'organs/*/app/**/*.html'
    ],
    sourceIconsFolder:[
        'app/icons/**.svg',
    ],
    testFolder:     [
      'test/**/*',
      'organs/*/test/**/*'
    ],
    fontsFolder:    'fonts',
    destFolder:     'dist',
    mapsFolder:     'maps',
    bowerFolder:    'bower_components',
};


/////////////////////////////////////////////////////////////////////////////////////
//
// cleans the build output
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('clean', function (cb) {
    return del([
        config.destFolder
    ], cb);
});


/////////////////////////////////////////////////////////////////////////////////////
//
// runs bower to install frontend dependencies
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('install-bower', function() {

    var install = require("gulp-install");

    return gulp.src(['./bower.json'])
        .pipe(install());
});


/////////////////////////////////////////////////////////////////////////////////////
//
// runs sass, creates css source maps
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('build-css', function() {
    return gulp.src(config.sassFolder)
        .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: [
                config.sassFolder
            ],
            errLogToConsole: true
        }))
        .pipe(concat('main.css'))
        .pipe(cachebust.resources())
        .pipe(sourcemaps.write(config.mapsFolder))
        .pipe(gulp.dest(config.destFolder + '/styles/'))
        .pipe(connect.reload());
});

/////////////////////////////////////////////////////////////////////////////////////
//
// runs sass, creates css source maps for bower components
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('build-bower-css', function() {
    return gulp.src(mainBowerFiles({
        filter: /.*s?(c|a)ss$/
    }))
//        .pipe(debug())
        // Hack for angular material
        // See here : https://github.com/angular/material/issues/6304#issuecomment-172341605
        .pipe(replace('screen\\0','screen'))
        .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: [
                config.bowerFolder
            ],
            errLogToConsole: true
        }))
        .pipe(concat('vendor.css'))
        .pipe(cachebust.resources())
        .pipe(sourcemaps.write(config.mapsFolder))
        .pipe(gulp.dest(config.destFolder + '/styles/'))
        .pipe(connect.reload());
});


/////////////////////////////////////////////////////////////////////////////////////
//
// runs linter
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('lint', function() {
    return gulp.src(config.jsFolder)
        .pipe(eslint())
        .pipe(eslint.format());
});

/////////////////////////////////////////////////////////////////////////////////////
//
// fills in the Angular template cache, to prevent loading the html templates via
// separate http requests
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('build-template-cache', function() {

    var ngHtml2Js = require("gulp-ng-html2js"),
        concat = require("gulp-concat");

    return gulp.src(config.viewsFolder)
        //.pipe(debug())
        .pipe(ngHtml2Js({
            moduleName: "4me.core.partials",
            prefix: "views/"
        }))
        .pipe(concat("templateCachePartials.js"))
        .pipe(cachebust.resources())
        .pipe(gulp.dest(config.destFolder + '/scripts/'))
        .pipe(connect.reload());
});

/////////////////////////////////////////////////////////////////////////////////////
//
// Build a minified Javascript bundle - the order of the js files is determined
// by browserify
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('build-js', function() {

/*    return gulp.src(config.jsFolder)
        .pipe(concat('bundle.js'))
        .pipe(cachebust.resources())
        .pipe(gulp.dest(config.destFolder + '/scripts/'));
*/
    var b = browserify({
        entries: 'app/main.js',
        debug: true,
        paths: config.jsFolder,
        transform: [
            ['babelify', {presets: ['es2015']}],
            debowerify
        ]
    });

    return b
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(cachebust.resources())
        .pipe(sourcemaps.init({loadMaps: true}))
        //.pipe(uglify())
        .on('error', gutil.log)
        .pipe(sourcemaps.write(config.mapsFolder))
        .pipe(gulp.dest(config.destFolder + '/scripts/'))
        .pipe(connect.reload());
});

/////////////////////////////////////////////////////////////////////////////////////
//
// Build a minified Javascript bundle of bower_components
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('build-bower-js', function() {
    return gulp.src(
        mainBowerFiles({
            filter: /.*\.js$/
        })
        .concat(config.bowerFolder + '/socket.io-client/socket.io.js')
    )
        //.pipe(debug())
        .pipe(sourcemaps.init())
        .pipe(concat('vendor.js'))
        .pipe(cachebust.resources())
        .pipe(sourcemaps.write(config.mapsFolder))
        .pipe(gulp.dest(config.destFolder + '/scripts/'))
        .pipe(connect.reload());
});


/////////////////////////////////////////////////////////////////////////////////////
//
// Build a minified Javascript bundle of bower_components
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('build-fonts', function() {

    return gulp.src(
        mainBowerFiles({
            filter: /.*\.(woff2|eot|woff|ttf|svg)$/
        })
        .concat(config.sourceIconsFolder)
    )
        //.pipe(debug())
        .pipe(gulp.dest(config.destFolder + '/fonts/'))
        .pipe(connect.reload());
});


/////////////////////////////////////////////////////////////////////////////////////
//
// Build index.html
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('build-index', function() {
    return gulp.src('app/index.html')
        .pipe(cachebust.references())
        .pipe(gulp.dest('dist'))
        .pipe(connect.reload());
});

/////////////////////////////////////////////////////////////////////////////////////
//
// Watch and rebuild
//
/////////////////////////////////////////////////////////////////////////////////////
gulp.task('watch', function() {
    gulp.watch(config.appFolder, ['build']);
});


/////////////////////////////////////////////////////////////////////////////////////
//
// Serve (and watch)
//
/////////////////////////////////////////////////////////////////////////////////////
var cors = function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
};
gulp.task('serve', ['build', 'watch'], function() {
    connect.server({
        root: config.destFolder,
        livereload: true,
        port: 4000,
        middleware: function() {
          return [cors];
        }
    });
});


/////////////////////////////////////////////////////////////////////////////////////
//
// Test : Unit + E2E
//
/////////////////////////////////////////////////////////////////////////////////////
gulp.task('test', ['test:unit'], function(done) {
    done();
});

/////////////////////////////////////////////////////////////////////////////////////
//
// Unit test : karma
//
/////////////////////////////////////////////////////////////////////////////////////
gulp.task('test:unit', function(done) {
    karma.start({
        configFile: __dirname + '/test/karma.conf.js',
        singleRun: true,
        browsers: ['PhantomJS']
    }, done);
});

/////////////////////////////////////////////////////////////////////////////////////
//
// Unit test coverage : karma + coverage reporter
//
/////////////////////////////////////////////////////////////////////////////////////
gulp.task('test:unit:coverage', function(done) {
    karma.start({
        configFile: __dirname + '/test/karma.conf.js',
        singleRun: true,
        reporters: ['progress', 'coverage'],
        browsers: ['PhantomJS']
    }, done);
});


/////////////////////////////////////////////////////////////////////////////////////
//
// full build (except sprites), applies cache busting to the main page css and js bundles
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('build', function(cb) {
    return runSequence('clean',
        'install-bower',
        [
            'build-css', 'build-bower-css',
            'build-fonts',
            'build-template-cache', 'lint',
            'build-js', 'build-bower-js'
        ],
        'build-index',
        cb);
});
