var express = require('express');
var router = express.Router();

var User = require('../models/user');

// it returns the list of users
router.get('/users', function (req, res) {
    User.find({}, function (err, users) {
        if(err){
            res.send(err)
        }else{
            res.send(users)
        }
    })
});

// it returns the user requested
router.get('/users/:userId', function (req, res) {
    
});

// it creates the user passed in the request
router.post('/users', function (req, res) {
    User.create(req.body, function (err, user) {
        if(err){
            res.send({
                status: 'failed',
                errors: err
            })
        }else{
            res.send({
                status: 'success',
                user: user
            })
        }
    });
});

// it updates the fields passed in the request
router.put('/users/:userId', function (req, res) {
    
});

// it deletes the requested user
router.delete('/users/:userId', function (req, res) {
    
});

module.exports = router;