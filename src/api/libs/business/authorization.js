var util = require('util');
var os = require("os");

var Q = require("q");
var dateformat = require("dateformat");
var md5 = require("crypto-md5");

var settings = require("../common/config");
var helper = require('../common/helper');
var logger = require('../common/logger')("authorize");
var blockloginTimes = 10; //10次失败lock
var loginTimesExpire = 300; //5分钟
var MESSAGE_TEMP_LOCK_ACCOUNT = "为了您的账户安全，您的账户已被临时锁定，请在5分钟后再尝试";
var accountBL = require('./account.js');

function getSessionUserData(user) {
    return {
        userId: user.UserID,
        authToken: issueUserAuthToken(user)
    };
}

function issueUserAuthToken(user) {
    if (!user) {
        return null;
    }

    var data = {
        ID: user.ID
    };

    var token = util.format("%s-%s", JSON.stringify(data), new Date().valueOf());

    return helper.encrypt(token);
}

function parseUserInfoAuthToken(token) {
    var result = null;

    try {
        var decryptToken = helper.decrypt(token);

        if (decryptToken.indexOf("-") !== -1) {
            result = JSON.parse(decryptToken.split("-")[0]);
        }
    } catch (err) {
    }

    return result;
}

function login(req, username, password) {
    //var ip = helper.getClientIp(req);

    return accountBL.login(username, password).fail(function (err) {
        throw err;
    });
}

exports.authenticate = function () {
    return function (req, username, password, done) {
        return login(req, username, password)
            .then(function (user) {
                done(null, user);
            })
            .fail(function (err) {
                done(err, null, {message: err.message});
            });
    };
};

exports.serializeUser = function () {
    return function (user, done) {
        //put to session
        done(null, user);
    }
};

exports.deserializeUser = function () {
    return function (user, done) {
        //read from sesson
        done(null, user);
    }
};

exports.verifyAuthToken = function () {
    return function (token, done) {
        var userInfo = parseUserInfoAuthToken(token);
        if (!userInfo) {
            return done(null, false);
        }

        return accountBL.getUserInfo(userInfo.ID)
            .then(function (user) {
                if (!user) {
                    return done(null, false);
                }

                return done(null, getSessionUserData(user));
            })
            .fail(function (err) {
                return done(err);
            });
    };
};

exports.updateAuthToken = function () {
    console.log("updateAuthToken")
    return function (user, done) {
        var authToken = issueUserAuthToken(user);

        return done(null, authToken);
    };
};

exports.logout = function (req, res, disableAutoRedirect) {
    var cookieKeys = settings.cookieKeys;

    res.clearMkpCookie(cookieKeys.authToken);

    req.logout();
    req.session.destroy();
};

exports.login = login;

exports.issueUserAuthToken = issueUserAuthToken;
exports.parseUserInfoAuthToken = parseUserInfoAuthToken;
exports.blockloginTimes = blockloginTimes;
exports.blockloginMessage = MESSAGE_TEMP_LOCK_ACCOUNT;
exports.getSessionUserData = getSessionUserData;
