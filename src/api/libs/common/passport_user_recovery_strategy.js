/**
 * Module dependencies.
 */
var util = require("util");

var passport = require("passport");
var _ = require("underscore");
var Q = require("q");


function StrategyConfigItem(key, verify, issue){
    this.key = key;
    this.verify = verify;
    this.issue = issue;
}

StrategyConfigItem.prototype.authenticate = function(req){
    return Q()
        .then(function(){
            return null;
        });
};

function StrategyCookieConfigItem(key, cookieOptions, verify, issue){
    StrategyConfigItem.call(this, key, verify, issue);

    this.cookieOptions = cookieOptions;
}

util.inherits(StrategyCookieConfigItem, StrategyConfigItem);

StrategyCookieConfigItem.prototype.authenticate = function(req){
    var self = this;

    return Q()
        .then(function(){
            var deferred = Q.defer();

            var token = req.cookies[self.key];

            if(token){
                self.verify(token, function(err, user, info){
                    if (err) { deferred.reject(err); }

                    var res = req.res;
                    function issued(err, val) {
                        if (err) { deferred.reject(err); }
                        res.cookie(self.key, val, self.cookieOptions);

                        deferred.resolve({
                            user : user,
                            info : info
                        });
                    }

                    if (!user) {
                        res.clearCookie(self.key);
                        
                        deferred.resolve(null);
                    }
                    else{
                        self.issue(user, issued);
                    }

                }, req);
            }
            else{
                deferred.resolve(null);
            }

            return deferred.promise;
        });
};

function StrategyHeaderConfigItem(key, verify, issue){
    StrategyConfigItem.call(this, key, verify, issue);
}

util.inherits(StrategyHeaderConfigItem, StrategyConfigItem);

StrategyHeaderConfigItem.prototype.authenticate = function(req){
    var self = this;

    return Q()
        .then(function(){
            var deferred = Q.defer();

            var token = req.headers[self.key];

            if(token){
                self.verify(token, function(err, user, info){
                    if (err) { deferred.reject(err); }

                    var res = req.res;

                    if (!user) {
                        res.clearCookie(self.key);
                        
                        deferred.resolve(null);
                    }
                    else{
                        deferred.resolve({
                            user : user,
                            info : info
                        });
                    }
                }, req);
            }
            else{
                deferred.resolve(null);
            }

            return deferred.promise;
        });
};

/**
 * `Strategy` constructor.
 *
 * @param {Object} options
 * @api public
 */
function Strategy(configItems) {
    this.configItems = configItems;

    passport.Strategy.call(this);
    this.name = 'recovery-me';
}

/**
 * Inherit from `passport.Strategy`.
 */
util.inherits(Strategy, passport.Strategy);

/**
 * Authenticate request based on remember me cookie.
 *
 * @param {Object} req
 * @api protected
 */
Strategy.prototype.authenticate = function(req, options) {
    // The rememeber me cookie is only consumed if the request is not
    // authenticated.  This is in preference to the session, which is typically
    // established at the same time the remember me cookie is issued.
    if (req.isAuthenticated() || !this.configItems || !this.configItems.length) { return this.pass(); }

    var authenticateSuccess = false;
    var authenticateErrorOccur = false;

    var self = this;

    function authenticateSeries(index){
        if(index < self.configItems.length){
            var configItem = self.configItems[index];

            configItem.authenticate(req)
                .then(function(data){
                    if(!data){
                        authenticateSeries(index + 1);
                    }
                    else{
                        return self.success(data.user, data.info);
                    }

                })
                .fail(function(err){
                    return self.error(err);
                });
        }
        else{
            return self.pass();
        }
    }

    authenticateSeries(0);

    /*
    var token = req.cookies[this._key];

    // Since the remember me cookie is primarily a convenience, the lack of one is
    // not a failure.  In this case, a response should be rendered indicating a
    // logged out state, rather than denying the request.
    if (!token) { return this.pass(); }

    var self = this;

    function verified(err, user, info) {
        if (err) { return self.error(err); }

        // Express exposes the response to the request.  We need the response to set
        // a cookie, so we'll grab it this way.  This breaks the encapsulation of
        // Passport's Strategy API, but is acceptable for this strategy.
        var res = req.res;

        if (!user) {
            // The remember me cookie was not valid.  However, because this
            // authentication method is primarily a convenience, we don't want to
            // deny the request.  Instead we'll clear the invalid cookie and proceed
            // to respond in a manner which indicates a logged out state.
            //
            // Note that a failure at this point may indicate a possible theft of the
            // cookie.  If handling this situation is a requirement, it is up to the
            // application to encode the value in such a way that this can be detected.
            // For a discussion on such matters, refer to:
            //   http://fishbowl.pastiche.org/2004/01/19/persistent_login_cookie_best_practice/
            //   http://jaspan.com/improved_persistent_login_cookie_best_practice
            //   http://web.archive.org/web/20130214051957/http://jaspan.com/improved_persistent_login_cookie_best_practice
            //   http://stackoverflow.com/questions/549/the-definitive-guide-to-forms-based-website-authentication

            res.clearCookie(self._key);
            return self.pass();
        }

        // The remember me cookie was valid and consumed.  For security reasons,
        // the just-used token should have been invalidated by the application.
        // A new token will be issued and set as the value of the remember me
        // cookie.
        function issued(err, val) {
            if (err) { return self.error(err); }
            res.cookie(self._key, val, self._opts);
            return self.success(user, info);
        }

        self._issue(user, issued);
    }

    self._verify(token, verified);
    */
};

Strategy.generateCookieConfigItem = function(key, cookieOptions, verify, issue){
    return new StrategyCookieConfigItem(key, cookieOptions, verify, issue);
};

Strategy.generateHeaderConfigItem = function(key, verify, issue){
    return new StrategyHeaderConfigItem(key, verify, issue);
};

/**
 * Expose `Strategy`.
 */ 
module.exports = Strategy;
