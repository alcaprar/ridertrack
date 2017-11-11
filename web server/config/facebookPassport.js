var FacebookStrategy = require('passport-facebook').Strategy;

var User = require('../models/user');
var configAuth = require('./index');

module.exports = function(passport) {
    passport.use('facebook',new FacebookStrategy({
            authorizationURL:"https://facebook.com/v2.11/dialog/oauth",
            clientID: configAuth.passport.facebookAuth.clientID,
            clientSecret: configAuth.passport.facebookAuth.clientSecret,
            callbackURL: configAuth.passport.facebookAuth.callbackURL,
            profileURL:'https://graph.facebook.com/v2.11/me',
            profile_fields:['public_profile','emails'],
            enableProof: true,
            tokenURL:'https://graph.facebook.com/v2.11/oauth/access_token'
        },
        function (accessToken, refreshToken, profile, done) {
            console.log(profile);
            console.log(accessToken);
            return User.setFbUser(accessToken, refreshToken, profile, done);
        }
    ));
}
