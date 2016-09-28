/**
 * Created by flyerabc on 16/6/15.
 */
var  path = require('path')
    ,fs = require("fs")
    ,gutil = require('gulp-util')
    ,through = require('through2')
    ,rename = require("gulp-rename")
    ,md5 = require("crypto-md5")

const PLUGIN_NAME = 'sotao-md5-res';

var res = {};

function md5Res(file, config) {
    var cdnUrl = config.cdnUrl;
    var resDir =config.resDir;

    var filePath = file.path.replace(/\\/g, "/"); // c:/abc/img/123.jpg
    var fileName = path.basename(filePath); //123.jpg
    var ext =  path.extname(filePath); //.jpg

    var version = md5(file.contents, "hex"); //528ed6a4a7344f9f30b17093972cf63f
    var md5edFileName = fileName.replace(ext, "") + '.' + version + ext; //123.528ed6a4a7344f9f30b17093972cf63f.jpg

    var relativeFilePath  = filePath.substring(filePath.indexOf(resDir)+ resDir.length, filePath.length); // /img/123.jpg

    var key = relativeFilePath;
    var value = cdnUrl + relativeFilePath.replace(fileName, "") + md5edFileName;

    res[key] = value;

    return md5edFileName;
}

var plugin = function(options){
    return through.obj(function (file, enc, callback) {
        if (file.isNull()) {
            callback(null, file);
            return;
        }
        if (file.isStream()) {
            return callback(new gutil.PluginError(PLUGIN_NAME, 'No stream support'));
        }
        var md5FileName =  md5Res(file, options);
        file.path = path.join(file.path.replace(path.basename(file.path), "") +  md5FileName);

        callback(null, file);

    }, function (cb){
        var resPath = path.join(options.distDir, "res.json");

        if(fs.existsSync(resPath)){
            var data = JSON.parse(fs.readFileSync(resPath));
            for(var p in data){
                res[p] = data[p];
            }
        }

        fs.writeFileSync(resPath, JSON.stringify(res, null, "\t"));

        cb();
    });
};

plugin.replace = function(){
    return through.obj(function (file, enc, callback) {
        if (file.isNull()) {
            callback(null, file);
            return;
        }
        if (file.isStream()) {
            return callback(new gutil.PluginError(PLUGIN_NAME, 'No stream support'));
        }

        var filePath = file.path;
        var text =  file.contents.toString('utf8');
        var reg;
        if (/main.*.js/ig.test(filePath)) {
            for (var p in res) {
                reg = new RegExp(p.replace(".js", ""), "ig");
                text = text.replace(reg, res[p].replace(".js", ""));
            }
        } else {
            for (var p in res) {
                reg = new RegExp(p, "ig");
                text = text.replace(reg, res[p]);
            }
        }

        file.contents = new Buffer(text,"utf-8");
        callback(null, file);
    });
};


module.exports = plugin;




