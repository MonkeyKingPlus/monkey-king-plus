var express = require('express'),
    router = express.Router();

var libs = require("../../libs");
var helper = libs.common.helper;

module.exports = function (app) {
    app.use('/', router);
};

router.get('/404', function (req, res) {
    res.status(404);
    res.send("404");

});

router.get('/500', function (req, res) {
    res.status(500);
    res.send("500");
});
