var express = require('express');
var router = express.Router();
var routerV2 = express.Router();

var util = require('util');

var Q = require('q');
var _ = require("underscore");

var libs = require("../../libs");
var helper = libs.common.helper;
var accountBL = libs.business.account;
var authorizationBL = libs.business.authorization;
var requireAuth = libs.middleware.auth_service();

module.exports = function (app) {
    app.use('/v1/account', router);
    app.use('/v2/account', router,routerV2);
};

/*V1版本,获取账户信息,可通过v1/account/id 或者 v2/account/id 来访问*/
router.get("/:id", requireAuth, function (req, res, next) {
    return Q().then(function () {
        return accountBL.test(req.params.id);
    }).then(function (data) {
        res.send(helper.buildSuccessResult(data));
    }).catch(function (err) {
        next(err);
    })
});

/*V2版本新增接口,获取账户所有信息,可通过v2/account/full/id 来访问。v1/account/full/id 将导致404*/
routerV2.get("/full/:id",requireAuth, function (req, res, next) {
    return Q().then(function () {
        return accountBL.test(req.params.id);
    }).then(function (data) {
        res.send(helper.buildSuccessResult(data));
    }).catch(function (err) {
        next(err);
    })
});

router.post("/", function (req, res, next) {
    return Q().then(function () {
        if (req.query.rollback) {
            return accountBL.insertTestWillRollback(req.body.name);
        } else {
            return accountBL.insertTest(req.body.name);
        }
    }).then(function () {
        res.send(helper.buildSuccessResult());
    }).catch(function (err) {
        next(err);
    })
});