var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    concat = require('gulp-concat'),
    wrap = require('gulp-wrap'),
    declare = require('gulp-declare'),
    path = require("path"),
    fs = require("fs"),
    argv = require('yargs').argv,
    zip = require('gulp-zip'),
    gulpSequence = require('gulp-sequence'),
    exit = require('gulp-exit'),
    util = require("util"),
    mkpSSH = require('./gulpfile/mkp-ssh');

var deployConfig = {
    test: {
        servers: [{
            sshConfig: {
                host: 'ec2-54-249-7-123.ap-northeast-1.compute.amazonaws.com',
                port: 22,
                username: 'ec2-user',
                privateKey: fs.readFileSync('./monkeyplus.pem'),
                readyTimeout: 200000
            }
        }],
        deployPath: "/home/ec2-user/mkp",
        deploySrc: [],
        deployServers: []
    },
    production: {
        servers: [{
            sshConfig: {
                host: '10.252.133.223',
                port: 22,
                username: 'sotaoadmin',
                password: 'Sotao@2015',
                readyTimeout: 200000
            }
        }, {
            sshConfig: {
                host: '10.168.45.93',
                port: 22,
                username: 'sotaoadmin',
                password: 'Sotao@2015',
                readyTimeout: 200000
            }
        }],
        deployPath: "/home/sotaoadmin/sotao-website",
        deploySrc: [],
        deployServers: []
    }
};

var cfg;

function getEnvConf(type) {
    var conf = {};
    conf.env = argv.env || "test";
    conf.type = type;
    conf.rootDir = path.normalize(path.join(__dirname, type));
    conf.distDir = path.normalize(path.join(__dirname, "/dist"));
    conf.distTempDir = path.normalize(__dirname + "/dist/temp");
    console.log("env: %s", conf.env);
    console.log("root dir : %s", conf.rootDir);
    console.log("dist dir : %s", conf.distDir);
    return conf;
}

//develop service
gulp.task('s', function () {
    nodemon({
        script: 'service/app.js',
        ext: 'js',
        ignore: ['dist/**', 'node_modules/**', 'website/controllers/**/*.js', 'mobilesite/controllers/**/*.js']
    });
});

gulp.task('deploy-service', function () {
    var env = argv.env || "test";
    cfg = deployConfig[env];
    cfg.isDevelopment = false;
    cfg.deploySrc = ["*js", "*json", "config/**", "libs/**", "service/**"];
    cfg.deployPath = cfg.deployPath + "/srv";
    cfg.deployServers = cfg.servers;

    var envCfg = getEnvConf("service")
    var logName = "deploy-" + envCfg.type;

    return gulp.src(cfg.deploySrc, {base: './'})
        .pipe(zip('publish.zip'))
        .pipe(mkpSSH({
            servers: cfg.deployServers,
            dest: cfg.deployPath + '/publish.zip',
            shell: ['cd ' + cfg.deployPath,
                'shopt -s extglob',
                'rm -rf !(logs|node_modules|publish.zip)',
                'unzip -o publish.zip -d dist',
                'cp -rf dist/** .',
                'rm -rf dist',
                "rm publish.zip",
                "mv  service/public/faq.html service/public/faq_1.html",
                'sleep 15',
                'npm install --production',
                'pm2 startOrRestart pm2-service-' + env + '.json',
                "mv service/public/faq_1.html service/public/faq.html",
                'sleep 15'],
            logPath: logName
        })).pipe(exit());
});

