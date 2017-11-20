var express = require('express');
var router = express.Router();

var Enrollment = require('../models/enrollment');
var Event = require('../models/event');
var User = require('../models/user');


/**
 * TODO verify that userID and eventID exist in the database
 */

router.post('/', function(req, res){
    Enrollment.create(req.body, function (err, user) {
        if(err){
            res.status(400).send({
                errors: err
            })
        }else{
            res.status(200).send({
                message: 'User enrolled successfully!',
                enrollment: enrollment
            })
        }
    });
});

module.exports = router;