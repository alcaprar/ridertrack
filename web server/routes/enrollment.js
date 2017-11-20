var express = require('express');
var router = express.Router();

var Enrollment = require('../models/enrollment');
var Event = require('../models/event');
var User = require('../models/user');


/**
 * TODO verify that userID and eventID exist in the database
 */

router.post('/', function(req, res){



});

module.exports = router;