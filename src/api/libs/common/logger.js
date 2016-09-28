var fs = require('fs');
var log4js = require('log4js');
var settings = require("./config.js");

var logPath = "./logs";
if (!fs.existsSync(logPath)) {
	fs.mkdirSync(logPath);
};

log4js.configure(settings.log);

module.exports = function(category) {
	var logger = log4js.getLogger(category || "www");
	logger.setLevel(settings.log.level);
	return logger;
};
