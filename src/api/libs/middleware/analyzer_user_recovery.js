var authorizeBL = require("../business/authorization");

module.exports = function(){
    return function(req, res, next){
        var authToken = req.headers["x-mkp-authentication"];

        if(authToken){
            var userInfo = authorizeBL.parseUserInfoAuthToken(authToken);
            req.user = userInfo;
        }
        else{
            req.user = null;
        }

        next();
    };
};
