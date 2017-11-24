var User = require('../models/user');
var config = require('../config');

var LocalStrategy = require('passport-local').Strategy;

module.exports = function (passport) {
    passport.use('local', new LocalStrategy({usernameField: 'email', session: false}, function (email, password, callback) {
        // find the user
        User.findByEmail(email, function (err, user) {
            if(err){
                return callback({
                    message:err.message
                });
            }

            // user not fund
            if(!user){
                return callback(null, false, {
                    message: 'User not found.'
                })
            }
            // he/she trying to access using email/pass but the user is
            // associated to facebook profile
            if(user.hash === '' || typeof user.hash === 'undefined'){
                return callback(null, false, {
                    message:'Trying to access a user associated' +
                    ' with' +
                    ' social account.'})
            }

            // check the password
            return user.verifyPassword(password, function (err, res) {
                if(err){
                    return callback({message:err.message})
                }

                if(res === false){
                    return callback(null, false, 'Incorrect password.')
                }else{
                    return callback(null, user)
                }
            })
        })
    }));
}