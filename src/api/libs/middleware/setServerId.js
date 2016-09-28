var helper = require("../common/helper");

module.exports = function () {
    return function (req, res, next) {
        var host = helper.getServerHostName();
        if (host && host.length > 2) {
            res.setHeader("x-server-id", host.substring(host.length - 2));
        }
        next();
    }
};