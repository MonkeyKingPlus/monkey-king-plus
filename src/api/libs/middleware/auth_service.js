var helper = require('../common/helper');

module.exports = function(){
    return function(req, res, next){
        if(!req.user){
            res.send(helper.buildErrorResult(401, null, "请注册或登陆后再尝试"));
        }
        else{
            next();
        }
    };
};
