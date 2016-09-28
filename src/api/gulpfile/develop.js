var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    livereload = require('gulp-livereload'),
    less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    handlebars = require('gulp-handlebars'),
    concat = require('gulp-concat'),
    wrap = require('gulp-wrap'),
    declare = require('gulp-declare'),
    path = require("path"),
    through = require('through2'),
    rename = require("gulp-rename"),
    multiline = require('multiline');


module.exports = function(envCfg) {
    var envCfg = envCfg;

    gulp.task('less', function () {
        gulp.src( envCfg.rootDir + '/public/less/**/*.less')
            .pipe(less())
            .pipe(autoprefixer({
                browsers: ['IE 8', 'IE 9', 'last 5 versions', 'Firefox 14', 'Opera 11.1', 'ios 6', 'android 4', 'safari 5']
            }))
            .pipe(gulp.dest( envCfg.rootDir +'/public/css'))
    });


    gulp.task('develop:mobilesite', function () {
        livereload.listen(35720);
        nodemon({
            script: envCfg.rootDir + '/app.js',
            ext   : 'js',
            ignore: ['dist/**', 'node_modules/**', 'website/controllers/**/*.js', 'mobilesite/public/js/**/*.js' ]
        }).on('restart', function () {
            setTimeout(function () {
                livereload.reload();
            }, 1000);
        });

        gulp.watch(envCfg.rootDir + '/public/less/**/*.less', function(event){
            gulp.src(event.path)
                .pipe(less())
                .pipe(autoprefixer({
                    browsers: ['IE 8', 'IE 9', 'last 5 versions', 'Firefox 14', 'Opera 11.1', 'ios 6', 'android 4', 'safari 5']
                }))
                .pipe(gulp.dest(envCfg.rootDir + '/public/css'))
                .pipe(livereload());
        });

        gulp.watch(envCfg.rootDir + '/views/**/*.html', livereload.reload);
    });


    gulp.task('develop:website', function () {
        livereload.listen(35729);

        nodemon({
            script: envCfg.rootDir + '/app.js',
            ext: 'js',
            ignore: ['dist/**', 'node_modules/**', 'mobilesite/controllers/**/*.js', 'website/public/**/*.js']
        }).on('restart', function () {
            setTimeout(function () {
                livereload.reload();
            }, 1000);
        });

        gulp.watch(envCfg.rootDir + '/public/less/**/*.less', function(event){
            gulp.src(event.path)
                .pipe(less())
                .pipe(autoprefixer({
                    browsers: ['IE 8', 'IE 9', 'last 5 versions', 'Firefox 14', 'Opera 11.1', 'ios 6', 'android 4', 'safari 5']
                }))
                .pipe(gulp.dest(envCfg.rootDir + '/public/css'))
                .pipe(livereload());
        });
        gulp.watch(envCfg.rootDir + '/views/client_partials/*.html', ['develop:client_partials']);
        gulp.watch(envCfg.rootDir + '/views/**/*.html', livereload.reload);
    });

    gulp.task("client_partials", function (cb) {
        return gulp.src(envCfg.rootDir + "/views/client_partials/**/*.html")
            .pipe(handlebars())
            .pipe(wrap('define(["handlebars-runtime"],function(Handlebars){return Handlebars.template(<%= contents %>);});'))
            .pipe(gulp.dest(envCfg.rootDir + "/public/js/partials"));
    });


    gulp.task("gen_rest_api_conf", function () {
        if(!envCfg.isDevelopment){
            process.env.NODE_ENV = envCfg.env;
        }
        var libs = require("../libs");
        var config = libs.common.config;

        var src = path.join(__dirname + "/../config/common/sotao_rest_service.js");
        var mobilesitedest = path.join(__dirname + "/../mobilesite/public/js/");
        var websitedest = path.join(__dirname + "/../website/public/js/");

        gulp.src(src)
            .pipe(through.obj(function (file, enc, callback) {
                var text = multiline(function(){
/*
define(function(){
    return %s;
});
*/});
                var sotaoRestServiceConfig = require(src)(config.app.servicePublicUrl);
                text = text.replace("%s", JSON.stringify(sotaoRestServiceConfig, null, "\t"));
                file.contents = new Buffer(text,"utf-8");
                callback(null, file);
            }))
            .pipe(rename('api.js'))
            .pipe(gulp.dest(mobilesitedest))
            .pipe(gulp.dest(websitedest));
    });
};

