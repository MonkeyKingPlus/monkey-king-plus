var gulp = require('gulp')
    , fs = require("fs")
    , path = require("path")
    , clean = require('gulp-clean')
    , rename = require("gulp-rename")
    , through = require('through2')
    , mkdirp = require('mkdirp');

module.exports = function(envCfg) {
    var distTempDir = envCfg.distTempDir;
    var rootDir = path.normalize(envCfg.rootDir + "/../");
    var layoutBaseDir = path.normalize(path.join(envCfg.rootDir, '/views/layouts'));
    var pageBaseDir = path.normalize(path.join(envCfg.rootDir, '/views/pages'));
    var partialBaseDir = path.normalize(path.join(envCfg.rootDir, '/views/partials/'));
    var regPartialPage = new RegExp('{{> (.*\/.*)}}', 'img');
    var mergedJsPath = envCfg.type  + '/public/js';
    var mergedLinkJsPath = '/js';

 //seek all page files in dir (no recurse)
    /*
     * @file
     *   file to merge
     *
     * @pageType
     *   1：View/Page
     *   2: View/Layout
     * */
    function seekPages(file, pageType) {
        if (!file.isNull()) {
            pageType = pageType || 1;
            var pageFileName = path.basename(file.path, '.html');
            var relativePath = path.dirname(
                path.relative(
                    pageType == 1 ? pageBaseDir : layoutBaseDir,
                    file.path)
            );
            //如果页面和baseDir在同级，relative出来的结果是个.  需要处理成''
            //如果是layouts，相对路径还需要加上layouts
            relativePath = relativePath == '.' ? '' : relativePath;
            if (pageType == 2) {
                relativePath = path.join("layouts", relativePath);
            }
            mergedPage(file.path, pageFileName, relativePath);
            var jsPath = path.join(path.join(path.join(distTempDir, mergedJsPath), relativePath), pageFileName + '.js');
            if (fs.existsSync(jsPath)) {
                //relative path in dist
                var distPageFile = path.join(distTempDir, path.relative(rootDir, file.path));
                relativePath = relativePath.replace(/\\/g,'/');
                var jsSrc = '<script type="text/javascript" src="' +
                    mergedLinkJsPath +
                    '/' + (relativePath == '' ? '' : relativePath + '/') +
                    pageFileName + '.js' + '"></script>';
                fs.appendFileSync(distPageFile, jsSrc, {encoding: "utf-8"});
            }
        }
    }

//merge page script and content
    function mergedPage(sourceFile, pageFileName, relativePath) {
        var fileContent = fs.readFileSync(sourceFile, {encoding: "utf-8"});
        var regJs = /<script\b((?!src|sotao-inline).)*>([\s\S]*?)<\/script>/img;
        var jsMatchs = regJs.exec(fileContent);
        if (jsMatchs && jsMatchs.length > 0) {
            if (path.dirname(sourceFile).indexOf('layouts') < 0) {
                var scriptDescription = path.basename(sourceFile);
                mergeScript(pageFileName, jsMatchs[2], relativePath, scriptDescription);
                fileContent = fileContent.replace(jsMatchs[0], '');
            }
        }
        mergeFile(sourceFile, fileContent);

        var partialMatchs = fileContent.match(regPartialPage);
        if (partialMatchs && partialMatchs.length > 0) {
            var rPath = partialBaseDir;
            partialMatchs.forEach(function (match) {
                var partialPageName = match.substring(3, match.length - 2);
                var partialPagePath = path.join(rPath, partialPageName.trim() + '.html');
                mergedPage(partialPagePath, pageFileName, relativePath);
            });
        }
    }

//merge content to page file
    function mergeFile(sourceFile, fileContent) {
        sourceFile = sourceFile.replace(rootDir, '');
        var destFilePath = path.join(distTempDir, sourceFile);
        var tempPath = path.dirname(destFilePath);
        if (!fs.existsSync(tempPath)) {
            mkdirp.sync(tempPath);
        }
        fs.writeFileSync(destFilePath, fileContent, {encoding: "utf-8"});

    }

//merge script to js file
//description: description for content to identity which file the script belongs to
//relativePath: relative path in website pages
    function mergeScript(destJsFileName, mergedContent, relativePath, description) {
        var fileDir = path.join(path.join(distTempDir, mergedJsPath), relativePath);
        if (!fs.existsSync(fileDir)) {
            mkdirp.sync(fileDir);
        }
        var destFilePath = path.join(fileDir, destJsFileName + '.js');
        //if file is not exist,create it.
        if (!fs.existsSync(destFilePath)) {
            fs.writeFileSync(destFilePath, '', {encoding: "utf-8"});
        }
        fs.appendFileSync(destFilePath, '\n//' + description, {encoding: 'utf-8'});
        fs.appendFileSync(destFilePath, mergedContent, {encoding: 'utf-8'});
        fs.appendFileSync(destFilePath, '//end of ' + description, {encoding: 'utf-8'});
    }

    gulp.task('merge_page', function () {
        return gulp.src(pageBaseDir + '/**/*').pipe(through.obj(function (file, enc, cb) {
            seekPages(file, 1);
            cb();
        }));
    });

    gulp.task('merge_layouts', function () {
        return gulp.src(layoutBaseDir + '/**/*').pipe(through.obj(function (file, enc, cb) {
            seekPages(file, 2);
            cb();
        }));
    });

};