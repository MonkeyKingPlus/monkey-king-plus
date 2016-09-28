/**
 * Created by flyerabc on 16/6/15.
 */
var path = require('path')
    ,gutil = require('gulp-util')
    ,mime = require("mime")
    ,through2Concurrent = require('through2-concurrent')
    , ALY = require('aliyun-sdk');

const PLUGIN_NAME = 'sotao-oss-up'

module.exports = function (options) {
    options = options || {}
    if(!options.accessKeyId || !options.secretAccessKey || !options.bucket || !options.objectDir) {
        throw new gutil.PluginError(PLUGIN_NAME, 'accessKeyId, secretAccessKey and bucket are all required!')
        return false
    }
    if(typeof options.objectDir === "undefined"){
        options.objectDir = ""
    }
    if(typeof options.objectGen === "string"){
        var _str = options.objectGen
        options.objectGen = function(){
            return _str
        }
    }else if(typeof options.objectGen !== "function"){
        options.objectGen = function(dest, src){
            return [dest, src].join('\/')
        }
    }
    var option = {
        accessKeyId: options.accessKeyId,
        secretAccessKey: options.secretAccessKey,
        endpoint: options.endpoint,
        apiVersion: options.apiVersion,
        httpOptions: {
            timeout: 120 * 1000
        }
    };
    var ossClient = new ALY.OSS(option);
    var isIncrement = options.incrementMode === true;

    return through2Concurrent.obj({maxConcurrency: 5},function (file, enc, callback) {
        if (file.isNull()) {
            callback(null, file);
            return;
        }

        if (file.isStream()) {
            return callback(new gutil.PluginError(PLUGIN_NAME, 'No stream support'));
        }

        var fileKey = options.objectGen(options.objectDir, file.relative).replace(/\\/g, "/");
        var mimetype = mime.lookup(fileKey);
        var uploadParams = {
            Bucket: options.bucket,
            Key: fileKey,
            Body: file.contents,
            ContentType: mimetype,
            CacheControl: options.cacheControl
        };

        if(!isIncrement) { //非增量模式，全部上传
            ossClient.putObject(uploadParams, function(err, data) {
                if(err) {
                    return callback(new gutil.PluginError(PLUGIN_NAME, "AliOss putObject Error: " + err.message))
                }else{
                    gutil.log(gutil.colors.cyan("Uploaded..."), fileKey);
                }

                file._status = data.status;
                callback(null, file);
            });
        }else{
            ossClient.headObject({
                Bucket: options.bucket
                ,Key: fileKey
            }, function(err, header) {
                if (err && err.statusCode !== 404) {
                    return callback(new gutil.PluginError(PLUGIN_NAME, "AliOss headObject Error: " + err.message))
                }
                //增量模式文件不存在才上传
                if(header == null || (err && err.statusCode === 404)){
                    ossClient.putObject(uploadParams, function(err, data) {
                        if(err) {
                            return callback(new gutil.PluginError(PLUGIN_NAME, "AliOss putObject Error: " + err.message))
                        }else{
                            gutil.log(gutil.colors.cyan("Uploaded..."), fileKey);
                        }

                        file._status = data.status;
                        callback(null, file);
                    });
                }else{
                    gutil.log(gutil.colors.gray("No Change..."), fileKey);
                    callback(null, file);
                }
            })
        }
    })
}