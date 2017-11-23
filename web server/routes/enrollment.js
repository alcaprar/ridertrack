var express = require('express');
var router = express.Router();

var Enrollment = require('../models/enrollment');
var Event = require('../models/event');
var User = require('../models/user');

var authMiddleware = require('../middlewares/auth');

/**
 * It returns the list of all the enrollments.
 * It accepts query params for filtering the enrollments: eventId, userId
 */
router.get('/', function (req, res) {
    var conditions = {};

    // check for query parameters
    // if they are present, add them to the conditions
    if(req.query.eventId){
        conditions.eventId = req.query.eventId
    }
    if(req.query.userId){
        conditions.userId = req.query.userId
    }

    Enrollment.find(conditions, function (err, enrollment) {
        if(err){
            res.status(400).send({
                errors: err
            })
        }else{
            res.status(200).send({
                enrollments: enrollment
            })
        }
    })
});




/**
 * TODO verify that userID and eventID exist in the database
 */

router.post('/', authMiddleware.hasValidToken, function(req, res){
    Enrollment.create(req.userId, req.body, function (err, enrollment) {
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

/**
 * It return the enrollments of the requested eventId
 */
router.get('/:eventId', function (req, res) {
    Enrollment.findAllByEventId(req.params.eventId, function (err, enrollment) {
        if(err){
            res.status(400).send({
                errors: err
            })
        }else{
            res.status(200).send({
                enrollment: enrollment
            })
        }
    })
});

/**
 * It updates the fields passed in the body of the given enrollmentId
 */
router.put('/:enrollmentId', function (req, res) {
    Enrollment.update(req.params.enrollmentId, req.body, function (err, enrollment) {
        if(err){
            res.status(400).send({
                errors: err
            })
        }else{
            res.status(200).send({
                message: 'Enrollment successfully updated',
                enrollment: enrollment
            })
        }
    })
});


/**
 * It deletes the given enrollment by eventId and userId
 * Can be called only by the given user if he/she is enrollment on the envent.
 * This will delete permanently everything related to it.
 */
router.delete('/:eventId/:userId', function (req, res) {
    Enrollment.delete(req.params.eventId, req.params.userId, function (err, deleted_enrollment) {
        if(err){
            res.status(400).send({
                errors: err
            })
        }else {
            res.status(200).send({
                enrollment: deleted_enrollment,
                message: 'Enrollment successfully deleted'
            })
        }
    })
});

module.exports = router;