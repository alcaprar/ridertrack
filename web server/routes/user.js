var express = require('express');
var router = express.Router();

var User = require('../models/user');

// it returns the list of users
router.get('/users', function (req, res) {
    
});

// it returns the user requested
router.get('/users/:userId', function (req, res) {
    
});

// it creates the user passed in the request
router.post('/users', function (req, res) {

});


// it updates the fields passed in the request
router.put('/users/:userId', function (req, res) {
    
});

// it deletes the requested user
router.delete('/users/:userId', function (req, res) {
    
});

module.exports = router;