var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../../models/user');

var configAuth = require('index');

var passport = function(passport) {
    passport.use(new FacebookStrategy({
        clientID: configAuth.passport.facebookAuth.clientID,
        clientSecret: configAuth.passport.facebookAuth.clientSecret,
        callbackURL: configAuth.passport.facebookAuth.callbackURL,
        profileFields: configAuth.passport.facebookAuth.profileFields
    },
        function (token,refreshToken,profile,done) {
            var user = new User();

            user.setFacebookData(profile,token);
            done(null,user);

            }))
        };
module.exports=passport;

