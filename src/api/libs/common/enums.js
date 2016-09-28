var config = require("./config");

var enums = {
    gender: {
        female: 1,
        male: 0,
        unknown: 2
    },
    passwordStrength: {
        weak: 0,
        normal: 1,
        strong: 2
    },
    securityLevel: {
        weak: 0,
        normal: 1,
        strong: 2
    }
};

enums.thirdPartyType = {};
enums.weixinType = {};

module.exports = enums;
