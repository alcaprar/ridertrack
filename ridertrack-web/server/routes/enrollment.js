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
 * It creates the enrollment passed in the body after checking the user is logged in.
 * It returns the detail of the enrollment just created.
 */
router.post('/', authMiddleware.hasValidToken, function(req, res){
    Event.findOne({_id: req.body.eventId}, function(err, event){
        if(err){
            res.status(400).send({
                errors: err
            })
        }else {
            var currentDate = new Date();
            var closingDate = new Date();
            var closingDateParsed = event.enrollmentClosingAt.split("/");

            closingDate.setDate(closingDateParsed[0]);
            closingDate.setMonth(closingDateParsed[1] - 1);
            closingDate.setYear(closingDateParsed[2]);

            Enrollment.find({userId: req.body.eventId}, function (err, enrollments) {
                if (err) {
                    callback(err)
                } else {
                    if (currentDate < closingDate && enrollments.length < event.maxParticipants) {
                        Enrollment.create(req.userId, req.body, function (err, enrollment) {
                            if (err) {
                                res.status(400).send({
                                    errors: err
                                })
                            } else {
                                res.status(200).send({
                                    message: 'User enrolled successfully!',
                                    enrollment: enrollment
                                })
                            }
                        })
                    } else {
                        res.status(401).send({
                            errors: "Enrollment is not possible for this event"
                        })
                    }
                }
            })
        }
    })
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
router.put('/:enrollmentId', authMiddleware.hasValidToken, function (req, res) {
    Enrollment.findOne({_id: req.params.enrollmentId}, function(err, enrollment) {
        if (err) {
            res.status(400).send({
                errors: err
            })
        }
        else if (enrollment.userId !== req.userId) {
            res.status(401).send({
                errors: "You are not allowed to update this enrollment"
            })
        }
        else {
            Enrollment.update(req.params.enrollmentId, req.body, function (err, enrollment) {
                if (err) {
                    res.status(400).send({
                        errors: err
                    })
                } else {
                    res.status(200).send({
                        message: 'Enrollment successfully updated',
                        enrollment: enrollment
                    })
                }
            })
        }
    })
});


/**
 * It deletes the given enrollment by eventId and userId
 * Can be called only by the given user if he/she is enrollment on the event.
 * This will delete permanently everything related to it.
 */
router.delete('/:eventId/:userId', authMiddleware.hasValidToken, function (req, res) {
    if(req.params.userId === req.userId) {
        Enrollment.delete(req.params.eventId, req.params.userId, function (err, deleted_enrollment) {
            if (err) {
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
    }
});

module.exports = router;
