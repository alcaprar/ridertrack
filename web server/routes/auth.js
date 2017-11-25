var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var config = require('../config');
var passport = require('passport');

var User = require('../models/user');

var standardMessage = {message: 'An error occured. Please try again in a while. If the error persists contact an administrator'};
/**
 * It creates the user passed in the body and return a JWT token in order to
 * immediately login the user.
 */
router.post('/register', function (req, res) {
    console.log('[POST /register]');
    if(typeof req.body.email === 'undefined' || typeof req.body.password === 'undefined'){
        return res.status(400).send({
            errors: [{message: "Email and/or password missing."}]
            });
    }else{
        User.create(req.body, function (err, user) {
            // if the error throws any error, send them
            if(err){
                return res.status(400).send({
                    errors: [{message: "Error while creating an user"}]
                });
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
                    userId: user._id,
                    role: user.role,
                    jwtToken: token,
                    expiresIn: 172800
                })
            }
        });   
    }    
});

/**
 * It checks the given email and password in the db.
 * If matches it creates a jwt and return it.
 */
router.post('/login', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if(err){
            // it should generate a 500 error
            return res.status(400).send({
                errors: [standardMessage]
            });
        }

        if(!user){
            // user is not found or password incorrect
            return res.status(400).send({
                errors: [{message:"User is not found or password is incorrect"}]
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
        return res.status(200).send({
            userId: user._id,
            role: user.role,
            jwtToken: token,
            expiresIn: 172800
        })
    })(req, res, next)
});

router.get('/login/facebook', function (req, res, next) {
    passport.authenticate('facebook-token', { scope: ['id', 'displayName', 'name', 'email'] }, function (err, user, info) {
        if(err || !user){
            return res.status(400).send({
                messages:[standardMessage,err.message]
            });
        }

        // create jwt token
        var userToken = {
            id: user._id
        };

        var token = jwt.sign(userToken, config.passport.jwt.jwtSecret, {
            expiresIn: 172800 // 2 days in seconds
        });
        return res.status(200).send({
            userId: user._id,
            role: user.role,
            jwtToken: token,
            expiresIn: 172800
        })
    })(req, res, next)
});


router.get('/login/google', function (req, res, next) {
    passport.authenticate('google-token', function (err, user, info) {
        if(err){
            return res.status(400).send({
                errors: [err]
            });
        }
        
        if(!user){
            return res.status(400).send({
                errors: [standardMessage]
            });
        }

        // create jwt token
        var userToken = {
            id: user._id
        };

        var token = jwt.sign(userToken, config.passport.jwt.jwtSecret, {
            expiresIn: 172800 // 2 days in seconds
        });
        return res.status(200).send({
            userId: user._id,
            role: user.role,
            jwtToken: token,
            expiresIn: 172800
        })
    })(req, res, next)
});

module.exports = router;