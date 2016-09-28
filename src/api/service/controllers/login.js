var express = require('express');
var loginRouter = express.Router();
var passport = require("passport");

var libs = require("../../libs");
var authorizeBL = libs.business.authorization;
var helper = libs.common.helper;
var BusinessError = libs.common.businessError;
var config = libs.common.config;

module.exports = function (app) {
    app.use('/v1/login', loginRouter);
};

loginRouter.post("/", function (req, res, next) {
    req.checkBody("LoginName", "用户名不能为空").notEmpty();
    req.checkBody("Password", "密码不能为空").notEmpty();

    var errors = req.validationErrors();
    if (errors && errors.length) {
        res.send(helper.buildErrorResult(4100, errors, helper.buildValidateErrorMessages(errors)));
    }
    else {
        passport.authenticate('local', {session: false}, function (err, user,info) {
            if (err || !user) {
                var message = "用户名或密码错误";
                if(err instanceof BusinessError){
                    message = err.message;
                }
                res.send(helper.buildErrorResult(4101, null, message));
            }
            else {
                var token = authorizeBL.issueUserAuthToken(user);
                res.header("x-mkp-authentication", token);
                res.issueMkpCookie(config.cookieKeys.authToken, token);
                res.send(helper.buildSuccessResult(user, "登录成功"));
            }
        })(req, res, next);
    }
});