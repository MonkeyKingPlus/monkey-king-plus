var util = require("util");

var helper = require('../common/helper');

module.exports = function (logger) {
    return function (err, req, res, next) {
        try {
            if(helper.isStaticResUrl(req.url)){
                return next();
            }

            var errorContextMsg = "";
            for (var p in err) {
                errorContextMsg += p + ":" + err[p] + "; ";
            }

            var log = {
                url: req.url,
                method: req.method,
                body: req.body,
                headers: req.headers,
                error: err.stack,
                errorContext: errorContextMsg
            };
            if (err.status !== 400 && err.status !== 404) {
                if(err.name !== 'BusinessError') {
                    if(global.ENV_DEVELOPMENT){
                        logger.error(log.error);
                    }else{
                        logger.error(JSON.stringify(log));
                    }
                }

                res.status(err.status || 500);

                var reqAccept = req.headers.accept;
                var contentType = req.headers["content-type"];

                var isJSON =  (reqAccept && reqAccept.indexOf('application/json') >= 0)
                    || (contentType && contentType.indexOf('application/json') >= 0)
                    || (contentType && contentType.indexOf('application/x-www-form-urlencoded') >= 0)

                if (isJSON) {
                    if (err.name === 'BusinessError') {
                        res.json({Code: 1, Data: null, Message: err.message});
                    } else {
                        var errMsg = global.ENV_PRODUCTION ? "系统出错啦":  err.message;
                        res.json({Code: 2, Data: null, Message: errMsg});
                    }
                } else {
                    res.redirect("/500");
                }
            } else {
                res.redirect("/404");
            }
        } catch (err) {
           logger.error(err);
        }
        next();
    }
};
