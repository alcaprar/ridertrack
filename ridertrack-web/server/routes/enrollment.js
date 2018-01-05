var express = require('express');
var router = express.Router();

var Enrollment = require('../models/enrollment');
var Event = require('../models/event');
var User = require('../models/user');
var utils = require('../utils');

var authMiddleware = require('../middlewares/auth');


/**
 * It creates the enrollment passed in the body after checking the user is logged in.
 * It returns the detail of the enrollment just created.
 */
router.post('/', authMiddleware.hasValidToken, function(req, res){
    Event.findOne({_id: req.body.eventId}, function(err, event){
        if(err){
            res.status(400).send({
                errors: [err]
            })
        }else {
            if(!event){
                return res.status(400).send({
                    errors: [{message: 'Event does not exist.'}]
                })
            }else{

                if(!event.enrollmentOpeningAt || !event.enrollmentClosingAt){
                    return res.status(400).send({
                        errors: [{message: 'The enrolling time is not defined yet.'}]
                    })
                }

                if(event.status === 'planned'){
                    var currentDate = new Date();
                    if(currentDate >= new Date(event.enrollmentOpeningAt) && currentDate <= new Date(event.enrollmentClosingAt)){
                        Enrollment.find({eventId: req.body.eventId}, function (err, enrollments) {
                            if (err) {
                                res.status(400).send({
                                    errors: [err]
                                })
                            } else {
                                if(enrollments.length < event.maxParticipants) {
                                    Enrollment.create(req.userId, req.body, function (err, enrollment) {
                                        if (err) {
                                            res.status(400).send({
                                                errors: [err]
                                            })
                                        } else {
                                            var message = 'Enrollment for  ' + event.name + ' CONFIRMED! \n Event info: \n' + event;

                                            User.findByUserId(req.userId, function (err, user) {
                                                if(err){
                                                    res.status(400).send({
                                                        errors: err
                                                    })
                                                }else{
                                                    utils.email.send(
                                                        {name: 'Enrollment confirmation', email: user.email},
                                                        '[EC] enrollment of ' + user.name +' '+ user.surname,
                                                        message,
                                                        function (err) {
                                                            if(err){
                                                                console.log('Error while sending email from contact form.', err);
                                                                return res.status(400).send({
                                                                    message: 'Email not sent.'
                                                                })
                                                            }else {
                                                                return res.status(200).send({
                                                                    message: 'Email successfully sent.',
                                                                    enrollment: enrollment
                                                                })
                                                            }
                                                        }
                                                    )
                                                }
                                            })
                                        }
                                    })
                                } else {
                                    return res.status(400).send({
                                        errors: [{message: "The event has reached the maximum of participants."}]
                                    })
                                }
                            }
                        })
                    }else{
                        return res.status(400).send({
                            errors: [{message: "The enrollment is not opened."}]
                        })
                    }
                }else{
                    return res.status(400).send({
                        errors: [{message: "The event is ongoing or already passed."}]
                    })
                }
            }
        }
    })
});

/**
 * It return the enrollments of the requested eventId
 */
router.get('/:eventId', function (req, res) {
    Enrollment.findByEventId(req.params.eventId, function (err, enrollment) {
        if(err){
            res.status(400).send({
                errors: [err]
            })
        }else{
            res.status(200).send({
                enrollment: enrollment
            })
        }
    })
});

/**
 * It return the enrollment of the requested eventId and userId.
 */
router.get('/:eventId/:userId', authMiddleware.hasValidToken, authMiddleware.isEnrolled, function (req, res) {
    var eventId = req.params.eventId;
    var userId = req.userId;

    Enrollment.findOne({eventId: eventId, userId: userId}, function (err, enrollment) {
        if(err){
            res.status(400).send({
                errors: [err]
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
router.put('/:eventId/:userId', authMiddleware.hasValidToken, authMiddleware.isEnrolled, function (req, res) {
    var userId = req.userId;
    var eventId = req.params.eventId;

    Enrollment.update(userId, eventId, req.body, function (err, enrollment) {
        if (err) {
            res.status(400).send({
                errors: err
            })
        } else {
            res.status(200).send({
                enrollment: enrollment
            })
        }
    })
});


/**
 * It deletes the given enrollment by eventId and userId
 * Can be called only by the given user if he/she is enrollment on the event.
 * This will delete permanently everything related to it.
 */
router.delete('/:eventId/:userId', authMiddleware.hasValidToken, authMiddleware.isEnrolled, function (req, res) {
    var userId = req.userId;
    var eventId = req.params.eventId;

    Enrollment.delete(eventId, userId, function (err, deleted_enrollment) {
        if (err) {
            return res.status(400).send({
                errors: [err]
            })
        }else {
            return res.status(200).send({
                enrollment: deleted_enrollment,
                message: 'Enrollment successfully deleted'
            })
        }
    })
});

module.exports = router;
