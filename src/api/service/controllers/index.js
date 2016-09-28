var express = require('express');
var router  = express.Router();

var util = require('util');
var urlUtil = require('url')

var Q = require('q');
var _ = require("underscore");

var libs = require("../../libs");

module.exports = function (app) {
    app.use('/v1', router);
};

router.get("/", function(req, res, next) {
    res.send("Hello MKP!");
});