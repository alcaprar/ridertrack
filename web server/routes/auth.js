var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var config = require('../config');
var passport = require('passport');

var User = require('../models/user');

/**
 * It creates the user passed in the body and return a JWT token in order to
 * immediately login the user.
 */
router.post('/register', function (req, res) {
    if(typeof req.body.email === 'undefined' || typeof req.body.password === 'undefined'){
        return res.status(400).send({
            errors: ['Email and/or password missing.']
        })
    }else{
        User.create(req.body, function (err, user) {
            // if the error throws any error, send them
            if(err){
                return res.status(400).send({
                    errors: err
                })
            }else{

                var userToken = {
                    id: user._id
                };
                // if no errors are thrown the user has been created.
                // create a token and send back the response with the user detail
                var token = jwt.sign(userToken, config.passport.jwt.jwtSecret, {
                    expiresIn: 172800 // 2 days in seconds
                });

                return res.status(200).send({
                    user: user,
                    jwtToken: token,
                    expiresIn: 172800
                })
            }
        });   
    }    
});

/**
 * It calls the facebook auth endpoint
 */
router.get('/register/facebook', passport.authenticate('facebook', {scope: 'email'}));

/**
 * It is called by the facebook auth service as callback.
 * It receives the response of the facebook login.
 */
router.get('/register/facebook/callback', function(req, res, next){
    passport.authenticate('facebook', function (err, user, info) {
        if(err || !user){
            return res.status(400).send({
                errors: [err]
            })
        }

        // create jwt token
        var userToken = {
            id: user._id
        };

        var token = jwt.sign(userToken, config.passport.jwt.jwtSecret, {
            expiresIn: 172800 // 2 days in seconds
        });
        return res.send({
            user: user,
            jwtToken: token,
            expiresIn: 172800
        })
    })(req, res, next)
});

/**
 * It calls the google oauth2 endpoint.
 */
router.get('/register/google', passport.authenticate('google', {scope:['openid','email','profile']}));

/**
 * It is called by the google auth service as callback.
 * It receives the response of the google login.
 */
router.get('/register/google/callback', function (req, res, next) {
    passport.authenticate('google', function (err, user, info) {
        if(err || !user){
            return res.status(400).send({
                errors: [err]
            })
        }
        
        // create jwt token
        var userToken = {
            id: user._id
        };
        
        var token = jwt.sign(userToken, config.passport.jwt.jwtSecret, {
            expiresIn: 172800 // 2 days in seconds
        });
        return res.send({
            user: user,
            jwtToken: token,
            expiresIn: 172800
        })
        
    })(req, res, next)
});

/**
 * It checks the given email and password in the db.
 * If matches it creates a jwt and return it.
 */
router.post('/login', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if(err){
            // it should generate a 500 error
            return next(err);
        }

        if(!user){
            // user is not found or password incorrect
            return res.status(400).send({
                errors: ['Invalid credentials.']
            })
        }

        // the user passed valid credentials
        // create jwt token
        var userToken = {
            id: user._id
        };
        // if it matches and there are no error, create
        // thw jwt token and send it
        var token = jwt.sign(userToken, config.passport.jwt.jwtSecret, {
            expiresIn: 172800 // 2 days in seconds
        });
        return res.send({
            user: user,
            jwtToken: token,
            expiresIn: 172800
        })
    })(req, res, next)
});

module.exports = router;