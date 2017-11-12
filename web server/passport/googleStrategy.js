var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('../models/user');
var config = require('../config');

module.exports = function (passport) {
    passport.use('google', new GoogleStrategy({
            clientID: config.passport.googleAuth.client_id,
            clientSecret: config.passport.googleAuth.client_secret,
            callbackURL: config.passport.googleAuth.redirect_uri,
            scope: ['openid','email','profile']
        },
        function(accessToken, refreshToken, profile, done) {
            // check if the user has already registered with this social
            User.findByGoogleId(profile.id, function (err, user) {
                if(err){
                    console.log('GoogleStrategy', 'findByGoogle err', err);
                    return done(err)
                }

                // user not found with this social, try to register it
                if(!user){
                    console.log('[GoogleStrategy]', '[user not found]', 'creating it...');
                    // instanciate a new User
                    user = new User({
                        name: profile.name.givenName,
                        surname: profile.name.familyName,
                        email: profile.emails[0].value,
                        googleProfile: {
                            id: profile.id,
                            token: accessToken
                        }
                    });

                    // save the new user
                    return user.save(function (err) {
                        if(err){
                            console.log('[GoogleStrategy]', '[user not' +
                                ' found]', 'Error while creating it', err);
                            // can't register the user
                            // the email might be already registered
                            // TODO check the error and send a nice message
                            return done(err);
                        }
                        
                        console.log('[GoogleStrategy]', '[user not found]', 'user successfully created');
                        
                        // user has been correctly save
                        return done(null, user)
                    })
                }else {
                    console.log('[GoogleStrategy]', '[user found]', user);

                    // user with this google id has been found
                    return done(null, user)
                }                
            });
        })
    );
};