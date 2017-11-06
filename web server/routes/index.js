var express = require('express');
var router = express.Router();

//require auth endpoint
router.use('/api/auth', require('./auth'));

// require user endpoint
router.use('/api/users', require('./user'));

// require event endpoint
router.use('/api/events', require('./event'));

// it sends the angular app
router.get('*', function (req, res) {
    res.send('Page')
});

module.exports = router;