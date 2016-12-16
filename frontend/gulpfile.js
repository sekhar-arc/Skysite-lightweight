'use strict';
var require;
var gulp = require('gulp'),
    gulpIf = require('gulp-if'),
    rename = require('gulp-rename'),
    cssmin = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    plumber = require('gulp-plumber'),
    browserify = require('gulp-browserify'),
    stringify = require('stringify'),
    uglify = require('gulp-uglify'),
    ngAnnotate = require('gulp-ng-annotate'),
    options = {
        env: process.env.NODE_ENV || 'development',
        outputClientDir: process.env.OUTPUT_DIR || '../backend/public/',
        css: process.env.sass || 'css/app.css',
        js: process.env.js || 'script/app.js',
        libCss: [
            './bower_components/font-awesome/css/font-awesome.min.css',
            './bower_components/bootstrap/dist/css/bootstrap.css',
            './bower_components/angularjs-toaster/toaster.min.css',
            './bower_components/nanoscroller/bin/css/nanoscroller.css',
            './bower_components/angular-loading-bar/build/loading-bar.min.css',
            './bower_components/angular-ui-select/dist/select.css',
            './bower_components/angular-ui-grid/ui-grid.min.css',
            './bower_components/ng-sortable/dist/ng-sortable.css',
            './bower_components/angular-ui-select/dist/select.css'
        ],
        libJS: [
            './bower_components/jquery/dist/jquery.min.js',
            './bower_components/angular/angular.js',
            './bower_components/angular-sanitize/angular-sanitize.js',
            './bower_components/angular-ui-select/dist/select.js',
            './bower_components/angular-animate/angular-animate.min.js',
            './bower_components/angularjs-toaster/toaster.min.js',
            './bower_components/angular-ui-router/release/angular-ui-router.min.js',
            './bower_components/angular-bootstrap/ui-bootstrap.min.js',
            './bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
            './bower_components/ng-file-upload/ng-file-upload-shim.min.js',
            './bower_components/ng-file-upload/ng-file-upload.min.js',
            './bower_components/bootstrap-ui-datetime-picker/dist/datetime-picker.min.js',
            './bower_components/angular-cookies/angular-cookies.js',
            './bower_components/nanoscroller/bin/javascripts/jquery.nanoscroller.js',
            './bower_components/angular-nanoscroller/scrollable.js',
            './bower_components/angular-one-drive-picker/dist/angular-one-drive-picker.js',
            './bower_components/ngDraggable/ngDraggable.js',
            './bower_components/angular-loading-bar/build/loading-bar.min.js',
            './bower_components/angular-ui-select/dist/select.js',
            './bower_components/angular-google-picker/dist/google-picker.js',
            './bower_components/angular-bootstrap-contextmenu/contextMenu.js',
            './bower_components/angular-bootstrap-show-errors/src/showErrors.js',
            './bower_components/angular-ui-grid/ui-grid.js',
            './bower_components/jquery/dist/jquery.js',
            './bower_components/ng-sortable/dist/ng-sortable.js',
            './node_modules/egnyte-js-sdk/dist/egnyte.min.js',
            './node_modules/egnyte-js-sdk/dist/slim.min.js'
        ]
    };
var onError = function(err) {
    notify.onError({
        title: "Gulp",
        subtitle: "Failure!",
        message: "Error: <%= error.message %>",
        sound: "Beep"
    })(err);

    this.emit('end');
};


gulp.task('vendorCss', function() {
    return gulp.src(options.libCss)
        .pipe(cssmin())
        .pipe(concat('vendor.min.css'))
        .pipe(gulp.dest(options.outputClientDir + '/css'));
});

gulp.task('css', function() {
    var config = {};
    return gulp.src(options.css)
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(cssmin())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(options.outputClientDir + '/css'))
        .pipe(notify({
            title: 'Gulp',
            subtitle: 'success',
            message: 'Css task completed',
            sound: "Pop"
        }));
});

gulp.task('js', function() {
    return gulp.src(options.js, {
            read: false
        })
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(ngAnnotate())
        .pipe(browserify({
            transform: stringify({
                extensions: ['.html', '.tpl'],
                minify: true
            })
        }))
        .pipe(gulpIf(options.env !== 'development', uglify()))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(options.outputClientDir + '/js'))
        .pipe(notify({
            title: 'Gulp',
            subtitle: 'success',
            message: 'Js task completed',
            sound: "Pop"
        }));
});

gulp.task('vendorJs', function() {
    return gulp.src(options.libJS)
        .pipe(concat('vendor.min.js'))
        .pipe(gulp.dest(options.outputClientDir + '/js'));
});

gulp.task('fonts', function() {
    return gulp.src('./fonts/**')
        .pipe(gulp.dest(options.outputClientDir + 'fonts'));
});

gulp.task('assets', function() {
    return gulp.src('./resources/**/*')
        .pipe(gulp.dest(options.outputClientDir + '/resources'));
});

gulp.task('index', function() {
    return gulp.src('./index.html')
        .pipe(gulp.dest(options.outputClientDir));
});


gulp.task('watch', function() {
    gulp.watch('script/**/*.js', ['js']);
    gulp.watch('script/**/*.html', ['js']);
    gulp.watch(['css/**/*.css'], ['css']);
    gulp.watch(['resources/**/*'], ['assets']);
    gulp.watch(['./index.html'], ['index']);
});

gulp.task('build', ['index', 'assets', 'css', 'js', 'vendorJs', 'vendorCss', 'fonts']);
gulp.task('default', ['build', 'watch']);
