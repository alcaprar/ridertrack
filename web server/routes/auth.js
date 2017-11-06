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

router.get('/register/facebook', function (req, res) {

});

router.get('/register/facebook/callback', function (req, res) {

});

module.exports = router;