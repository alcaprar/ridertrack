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

// require admin endpoint
router.use('/api/admin', require('./admin'));

router.use('/api/utils', require('./utils'));

router.get('/health-check', function (req, res) {
  res.send('Server up.')
});

// it sends the angular app
router.get('*', function (req, res) {
    var indexPath = path.resolve(config.buildFolder + '/index.html');
    var fs = require('fs');
    if (!fs.existsSync(indexPath)) {
        return res.status(200).send('index.html missing. Build not done.')
    }else{
        return res.sendFile(indexPath);
    }
});

module.exports = router;
