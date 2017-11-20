var FacebookStrategy = require('passport-facebook-token');

var User = require('../models/user');
var config = require('../config');

module.exports = function(passport) {
    passport.use('facebook-token', new FacebookStrategy({
            clientID: config.passport.facebookAuth.clientID,
            clientSecret: config.passport.facebookAuth.clientSecret,
            profileFields: ['id', 'displayName', 'name', 'email']
        },
        function (accessToken, refreshToken, profile, done) {
            // check if the user has already registered with this social
            User.findByFacebookId(profile.id, function (err, user) {
                if(err){
                    console.log('FacebookStrategy', 'findByFacebook err', err);
                    return done(err)
                }

                // user not found with this social, try to register it
                if(!user){
                    console.log('[FacebookStrategy]', '[user not found]', 'creating it...', profile);
                    // instanciate a new User
                    user = new User({
                        name: profile.name.givenName,
                        surname: profile.name.familyName,
                        email: profile.emails[0].value,
                        facebookProfile: {
                            id: profile.id,
                            token: accessToken
                        }
                    });

                    // save the new user
                    return user.save(function (err) {
                        if(err){
                            console.log('[FacebookStrategy]', '[user not' +
                                ' found]', 'Error while creating it', err);
                            // can't register the user
                            // the email might be already registered
                            // TODO check the error and send a nice message
                            return done(err);
                        }

                        console.log('[FacebookStrategy]', '[user not found]', 'user successfully created');

                        // user has been correctly save
                        return done(null, user)
                    })
                }else {
                    console.log('[FacebookStrategy]', '[user found]', user);

                    // user with this facebook id has been found
                    return done(null, user)
                }
            });
        }
    ));
};