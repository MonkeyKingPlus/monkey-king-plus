var location = process.env.NODE_ENV || 'development';
var confPath = __dirname + "/../../config/" + location;

module.exports = require(confPath);
