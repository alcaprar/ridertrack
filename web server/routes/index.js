var express = require('express');
var router = express.Router();

// require user endpoint
router.use(require('./user'));

// require event endpoint
router.use(require('./event'));

// it sends the angular app
router.get('*', function (req, res) {
    res.send('Page')
});

module.exports = router;