var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('../models/user');
var authConfig = require('./index');

module.exports = function(passport){
    passport.use ('google',new GoogleStrategy({
            clientID:authConfig.passport.googleAuth.client_id,
            clientSecret:authConfig.passport.googleAuth.client_secret,
            callbackURL:authConfig.passport.googleAuth.redirect_uri,
            scope:['openid','email','profile']
        },
        function(accessToken,refreshToken,profile,done) {
            User.setGoogleUser(accessToken, refreshToken, profile, function (err, user) {
                    if (err) {
                        done(err);
                    }
                    else {
                        done(null, user);
                    }
                }
            );
        }));


    passport.serializeUser(function(user, done) {
        // done(null, user.id);
        console.log(user);
        done(null, user.id);
    });

    passport.deserializeUser(function(obj, done) {
        // Users.findById(obj, done);
        done(null, obj);
    });

};