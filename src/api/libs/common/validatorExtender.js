var helper = require("./helper");

module.exports = function(){
    expressValidatorExtender = {};

    expressValidatorExtender.extend = function(validator){
        validator.extend("isCellPhoneValid", function(cellPhone){
            return helper.isCellPhoneValid(cellPhone);
        });

        validator.extend("isPasswordValid", function(password){
            return true;
            /*
            password = (password || "").trim();
            
            return password.length >= 6 && password.length <= 16;
            */
        });

        validator.extend("isNumber", function(number){
            return !isNaN(number);
        });
    };

    return expressValidatorExtender;
};
