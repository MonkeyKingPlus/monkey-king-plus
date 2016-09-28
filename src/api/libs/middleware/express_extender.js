var helper = require("../common/helper");
var config = require("../common/config");

module.exports = function(){
    return function(req, res, next){
        res.issueMkpCookie = function(cookieConfig, cookieValue){
            res.cookie(cookieConfig.name, cookieValue, cookieConfig.options);
        };

        res.clearMkpCookie = function(cookieConfig){
            res.clearCookie(cookieConfig.name, cookieConfig.options);
        };

        req.queryValue = function(key) {
            for (var k in this.query) {
                if (k.toLowerCase() === key.toLowerCase()) {
                    return this.query[k];
                }
            }
        };

        req.queryIntValue = function(key) {
            return parseInt(req.queryValue(key));
        };

        req.queryBoolValue = function(key) {
            return helper.parseBool(req.queryValue(key));
        };

        req.paramsValue = function(key) {
            for (var k in this.params) {
                if (k.toLowerCase() === key.toLowerCase()) {
                    return this.params[k];
                }
            }
        };

        req.paramsIntValue = function(key) {
            return parseInt(req.paramsValue(key));
        };

        req.paramsBoolValue = function(key) {
            return helper.parseBool(req.paramsValue(key));
        };

        return next();
    };
};
