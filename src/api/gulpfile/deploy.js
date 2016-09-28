var gulp = require('gulp'),
    zip = require('gulp-zip'),
    path = require("path"),
    md5res = require('./sotao-md5-res'),
    gulpRimraf = require("gulp-rimraf"),
    gulpif = require('gulp-if'),
    uglify = require("gulp-uglify"),
    rename = require("gulp-rename"),
    debug = require('gulp-debug'),
    minifyCSS = require("gulp-minify-css"),
    sourcemaps = require('gulp-sourcemaps'),
    fs = require("fs"),
    util = require("util"),
    ossup = require('./sotao-oss-up'),
    sotaoSSH = require('./sotao-ssh');

module.exports = function (envCfg, cfg) {
    var envCfg = envCfg;
    var cfg = cfg;
    var config = require(path.normalize(path.join(__dirname, "../config/") + envCfg.env + '.js'));

    gulp.task('copyWebSiteToDist', function () {
        return gulp.src(["*js",
            "*json",
            "libs/**",
            "config/**",
            envCfg.type+"/public/exclude/**/*",
            envCfg.type+"/public/fonts/**/*",
            envCfg.type+"/controllers/**",
            envCfg.type+"/*",
            envCfg.type+"/public/*"],{ base: './' })
            .pipe(gulp.dest("./dist"));
    });

    gulp.task('zipPublishFile', function () {
        var src = ["dist/**"];
        if(envCfg.env == "production"){
            src.push("!dist/" + envCfg.type + "/public/js/**/*");
            src.push("!dist/" + envCfg.type + "/public/img/**/*");
            src.push("!dist/" + envCfg.type + "/public/css/**/*");
        }
        return gulp.src(src, {base: './'})
            .pipe(zip('publish.zip'))
            .pipe(gulp.dest("./dist"))
    });

    gulp.task('startDeploy', function () {
        var logName = "deploy-" + envCfg.type;
        return gulp.src("dist/publish.zip")
            .pipe(sotaoSSH({
                servers: cfg.deployServers,
                dest: cfg.deployPath + '/publish.zip',
                shell:['cd ' + cfg.deployPath,
                    'shopt -s extglob',
                    'rm -rf !(logs|node_modules|publish.zip)',
                    'unzip -o publish.zip',
                    'cp -rf dist/** .',
                    'rm -rf dist',
                    "rm publish.zip",
                    util.format("mv  %s/public/faq.html %s/public/faq_1.html", envCfg.type, envCfg.type),
                    'sleep 15',
                    'npm install --production',
                    util.format("pm2 startOrRestart pm2-%s-%s.json", envCfg.type, envCfg.env),
                    util.format("mv  %s/public/faq_1.html %s/public/faq.html", envCfg.type, envCfg.type),
                    'sleep 15'],
                logPath: logName
            }));
    });

    gulp.task('copytoOss', function (cb) {
        if (envCfg.env == "production") {
            var src = "dist/" + envCfg.type + "/public/**/*";
            return gulp.src(src)
                .pipe(ossup({
                    "accessKeyId": config.aliyun.accessKeyId,
                    "secretAccessKey": config.aliyun.secretAccessKey,
                    "endpoint": config.aliyun.endpoint,
                    "apiVersion": config.aliyun.apiVersion,
                    "incrementMode": true,
                    "cacheControl": "max-age=31536000",
                    "bucket": "sotao-res-hz",
                    "objectDir": envCfg.type
                }));
        } else {
            cb();
        }
    });

    gulp.task("clean:dist", function (cb) {
        return gulp.src(envCfg.distDir, {read: false})
            .pipe(gulpRimraf({force: true}));
    });

    gulp.task("clean:distTemp", function (cb) {
        return gulp.src(envCfg.distTempDir, {read: false})
            .pipe(gulpRimraf({force: true}));
    });

    gulp.task("img", function () {
        var subdir = "public/img/";
        var srcDir = path.normalize(path.join(envCfg.rootDir, subdir));

        return gulp.src(srcDir + "**/*")
            .pipe(md5res({
                cdnUrl: envCfg.type.toLowerCase() == "website" ? config.app.cdnUrl : config.app.mobileSiteCdnUrl,
                resDir: "public",
                distDir: envCfg.distDir
            }))
            .pipe(gulp.dest(path.join(envCfg.distDir, envCfg.type, subdir)));
    });


    gulp.task("css", function () {
        var subdir = "public/css/";
        var srcDir = path.normalize(path.join(envCfg.rootDir, subdir));

        return gulp.src(srcDir + "**/*.css")
            .pipe(md5res.replace())
            .pipe(gulpif(envCfg.env == "test", sourcemaps.init()))
            .pipe(minifyCSS({
                compatibility: 'ie8'
                , advanced: false
                //,aggressiveMerging:false
                //,mediaMerging:false
                //,restructuring:false
                //,shorthandCompacting:false
            }))
            .pipe(gulpif(envCfg.env == "test", sourcemaps.write()))
            .pipe(md5res({
                cdnUrl: envCfg.type.toLowerCase() == "website" ? config.app.cdnUrl : config.app.mobileSiteCdnUrl,
                resDir: "public",
                distDir: envCfg.distDir
            }))
            .pipe(gulp.dest(path.join(envCfg.distDir, envCfg.type, subdir)));
    });


    gulp.task("js", function () {
        var subdir = "public/js/";
        var srcDir = path.normalize(path.join(envCfg.rootDir, subdir));
        var srcTempDir = path.normalize(envCfg.distTempDir + "/" + envCfg.type + "/" + subdir) + "**/*.js"
        return gulp.src([srcDir + "**/*.js", srcTempDir, "!" + srcDir + "/main.js" ])
            .pipe(md5res.replace())
            .pipe(gulpif(envCfg.env=="test",sourcemaps.init()))
            .pipe(uglify({
                compress:{
                    drop_console:true
                }
            }))
            .pipe(gulpif(envCfg.env=="test",sourcemaps.write()))
            .pipe(md5res({
                cdnUrl: envCfg.type.toLowerCase() == "website" ? config.app.cdnUrl : config.app.mobileSiteCdnUrl,
                resDir: "public",
                distDir: envCfg.distDir
            }))
            .pipe(gulp.dest(path.join(envCfg.distDir, envCfg.type, subdir)));
    });


    gulp.task("mainjs", function () {
        var subdir = "public/js/";
        var srcDir = path.normalize(path.join(envCfg.rootDir, subdir));
        return gulp.src([srcDir + "/main.js"])
            .pipe(gulpif((envCfg.env == "production"), uglify({
                compress: {
                    drop_console: true
                }
            })))
            .pipe(md5res.replace())
            .pipe(md5res({
                cdnUrl: envCfg.type.toLowerCase() == "website" ? config.app.cdnUrl : config.app.mobileSiteCdnUrl,
                resDir: "public",
                distDir: envCfg.distDir
            }))
            .pipe(gulp.dest(path.join(envCfg.distDir, envCfg.type, subdir)));
    });


    gulp.task('copyHtml', function () {
        return gulp.src([envCfg.type+"/**/*.html"],{ base: './' })
            .pipe(md5res.replace())
            .pipe(gulp.dest("./dist"));
    });


    gulp.task("html", ["copyHtml"], function () {
        var srcDir = path.normalize(envCfg.distTempDir + "/" + envCfg.type + "/views/");
        return gulp.src([path.join(srcDir + "**/*")])
            .pipe(md5res.replace())
            .pipe(gulp.dest(path.join(envCfg.distDir, envCfg.type, "views")));
    });

    require("./develop.js")(envCfg);
    require("./merge.js")(envCfg);
};








