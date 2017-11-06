var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var config = require('../config');

var User = require('../models/user');

/**
 * It returns the list of all the users
 */
router.get('/users', function (req, res) {
    User.find({}, function (err, users) {
        if(err){
            res.send({
                status: 'failed',
                errors: err
            })
        }else{
            res.send({
                status: 'success',
                users: users
            })
        }
    })
});

/**
 * It return the details of the requested userId.
 */
router.get('/users/:userId', function (req, res) {
    
});

/**
 * It creates the user passed in the body.
 * It returns the detail of the user just created.
 */
router.post('/users', function (req, res) {
    User.create(req.body, function (err, user) {
        if(err){
            res.status(400).send({
                errors: err
            })
        }else{
            res.status(200).send({
                user: user
            })
        }
    });
});

/**
 * It creates the user passed in the body and return a JWT token in order to
 * immediately login the user.
 */
router.post('/users/register', function (req, res) {
    User.create(req.body, function (err, user) {
        if(err){
            res.status(400).send({
                errors: err
            })
        }else{
            var token = jwt.sign(user, config.passport.jwt.jwtSecret, {
                expiresIn: 631139040 // 20 years in seconds
            });

            res.status(200).send({
                user: user,
                jwtToken: token
            })
        }
    });
});

/**
 * It updates the fields passed in the body of the given userId
 */
router.put('/users/:userId', function (req, res) {
    User.update(req.params.userId, req.body, function (err, user) {
        if(err){
            res.status(403).send({
                errors: err
            })
        }else{
            res.status(200).send({
                user: user
            })
        }
    })
});

/**
 * It deletes the given user.
 * Can be called only by the given user.
 * This will delete permanently everything related to it.
 */
router.delete('/users/:userId', function (req, res) {
    
});

// it activates the reset password mechanism for the given user
router.post('/users/:userId/reset-password', function (req, res) {
    
});

module.exports = router;