var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var config = require('../config');

var User = require('../models/user');

/**
 * It creates the user passed in the body and return a JWT token in order to
 * immediately login the user.
 */
router.post('/register', function (req, res) {
    User.create(req.body, function (err, user) {
        // if the error throws any error, send them
        if(err){
            return res.status(400).send({
                errors: err
            })
        }else{
            // if no errors are thrown the user has been created.
            // create a token and send back the response with the user detail
            var token = jwt.sign(user, config.passport.jwt.jwtSecret, {
                expiresIn: 172800 // 20 years in seconds
            });

            return res.status(200).send({
                user: user,
                jwtToken: token
            })
        }
    });
});

router.get('/register/facebook', function (req, res) {

});

router.get('/register/facebook/callback', function (req, res) {

});

/**
 * It checkes the given email and password in the db.
 * If matches it creates a jwt and return it.
 */
router.post('/login', function (req, res) {
    if(typeof req.body.email !== 'undefined' && typeof req.body.password !== 'undefined'){
        // if the email and passowrd are passed in the request, find the
        // user with that email
        User.findOne({email: req.body.email}, function (err, user) {
            if(err){
                // if the db throws any error send them
                return res.status(400).send({
                    errors: err
                })
            }else{
                if(!user){
                    // if the user is not found send an error
                    return res.status(400).send({
                        errors: ['Invalid credentials.']
                    })
                }else{
                    // if the user is found, check if password matches
                    user.authenticate(req.body.password, function (err, isMatch) {
                        if(isMatch && !err){
                            // if it matches and there are no error, create
                            // thw jwt token and send it
                            var token = jwt.sign(user, config.passport.jwt.jwtSecret, {
                                expiresIn: 172800 // 2 days in seconds
                            });
                            return res.send({
                                user: user,
                                jwtToken: token
                            })
                        }else{
                            // if there is no match or an error occured send
                            // an error
                            res.status(400).send({
                                errors: ['Authentication failed.']
                            })
                        }
                    })
                }
            }
        })
    }else{
        // if email and/or password are not passed, send an error
        return res.status(400).send({
            errors: ['Email and/or password not definied.']
        })
    }

});

module.exports = router;