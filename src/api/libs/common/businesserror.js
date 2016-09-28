var util = require('util');

function BusinessError(message, extra) {
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message;
    this.extra = extra;
};

util.inherits(module.exports, Error);

module.exports = BusinessError;