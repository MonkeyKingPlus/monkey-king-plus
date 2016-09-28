var config = require("../common/config");

module.exports = function () {
    return function (req, res, next) {
        var clientId = req.headers['x-deviceid'] || req.cookies[config.cookieKeys.deviceId.name];
        if (clientId) {
            if(req.cookies[config.cookieKeys.deviceId.name] != clientId){
                res.cookie(config.cookieKeys.deviceId.name, clientId, config.cookieKeys.deviceId.options);
            }
            req.deviceId = clientId;
        } else {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }

            var genId = s4() + s4() + s4() + s4() + s4() + s4();
            //one year
            res.cookie(config.cookieKeys.deviceId.name, genId, config.cookieKeys.deviceId.options);
            req.deviceId = genId;
        }

        next();
    }

};