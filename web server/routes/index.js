var express = require('express');
var router = express.Router();
var config = require('../config');
var path = require('path');

//require auth endpoint
router.use('/api/auth', require('./auth'));

// require user endpoint
router.use('/api/users', require('./user'));

// require event endpoint
router.use('/api/events', require('./event'));

// require enrollment endpoint
router.use('/api/enrollments', require('./enrollment'));

// it sends the angular app
router.get('*', function (req, res) {
    return res.status(404).send('Endpoint not found.');
});

module.exports = router;