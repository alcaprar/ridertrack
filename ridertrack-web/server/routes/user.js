var express = require('express');
var router = express.Router();
var config = require('../config');
var async = require('async');

var User = require('../models/user');
var Event = require('../models/event');
var Enrollment = require('../models/enrollment');

var authMiddleware = require('../middlewares/auth');

/**
 * It returns the list of all the users.
 * It accepts query params for filtering the users: email, name, surname.
 */
router.get('/', function (req, res) {
    var conditions = {};

    // check for query parameters
    // if they are present, add them to the conditions
    if(req.query.email){
        conditions.email = req.query.email
    }
    if(req.query.name){
        conditions.name = req.query.name
    }
    if(req.query.surname){
        conditions.surname = req.query.surname
    }

    User.find(conditions, function (err, user) {
        if(err){
            res.status(400).send({
                errors: err
            })
        }else{
            res.status(200).send({
                users: user
            })
        }
    })
});

/**
 * It return the details of the requested userId.
 */
router.get('/:userId', function (req, res) {
    User.findByUserId(req.params.userId, function (err, user) {
        if(err){
            res.status(400).send({
                errors: err
            })
        }else{
            res.status(200).send({
                user: user
            })
        }
    })
});

/**
 * It returns the events enrolled by the user.
 */
router.get('/:userId/enrolledEvents', authMiddleware.hasValidToken, function (req, res){
    var options = {};
    let enrolledEventsIdList= [];

    var page = parseInt(req.query.page) || 1;
    var itemsPerPage = parseInt(req.query.itemsPerPage) || 10;
    options.skip = (parseInt(page) -1) * parseInt(itemsPerPage);
    options.limit = itemsPerPage;


    options.sort = {
        'startingDate': 'asc'
    };

    // using async lib to find the total number and find the events in parallel
    var countEnrollments = function (callback) {
        Enrollment.find({userId: req.params.userId}, function (err, enrollments) {
            if(err){
                callback(err)
            }else{
                callback(null, enrollments.length)
            }
        })
    };

    var findEnrollments = function (callback) {
        Enrollment.find({userId: req.params.userId}, null, options, function (err, enrollment){
            if (err) {
                console.log('GET /users/:userId/enrolledEvents', err);
                res.status(400).send({
                    errors: [{message: 'Error in finding an enrollment in getting enrolled events'}]

                })
            }else{
                for(let key in enrollment){
                    enrolledEventsIdList.push(enrollment[key].eventId);
                }
                Event.findEventsFromList(enrolledEventsIdList, function(err, events){
                    if(err){
                        callback(err)
                    }else{
                        callback(null, events);
                    }
                })
            }
        })
    };

    async.parallel([countEnrollments, findEnrollments], function (err, results) {
        if(err) {
            res.status(400).send({
                errors: err
            })
        } else {
            res.status(200).send({
                events: results[1],
                page: page,
                itemsPerPage: itemsPerPage,
                totalPages: Math.ceil(results[0]/itemsPerPage)
            })
        }
    });
});

/**
 * It returns the events organized by the user.
 *
 */
router.get('/:userId/organizedEvents', authMiddleware.hasValidToken, function(req,res){
    var options = {};

    var page = parseInt(req.query.page) || 1;
    var itemsPerPage = parseInt(req.query.itemsPerPage) || 10;
    options.skip = (parseInt(page) -1) * parseInt(itemsPerPage);
    options.limit = itemsPerPage;

    options.sort = {
        'startingDate': 'asc'
    };

    // using async lib to find the total number and find the events in parallel
    var countEvents = function (callback) {
        Event.find({organizerId: req.params.userId}, function (err, events) {
            if(err){
                callback(err)
            }else{
                callback(null, events.length)
            }
        })
    };

    var findEvents = function (callback) {
        Event.find({organizerId: req.params.userId}, null, options, function(err, events){
            if (err) {
                callback(err)
            }else{
                callback(null, events)
            }
        });
    };

    async.parallel([countEvents, findEvents], function (err, results) {
        if(err) {
            res.status(400).send({
                errors: err
            })
        } else {
            res.status(200).send({
                events: results[1],
                page: page,
                itemsPerPage: itemsPerPage,
                totalPages: Math.ceil(results[0]/itemsPerPage)
            })
        }
    });


});

/**
 * It creates the user passed in the body.
 * It returns the detail of the user just created.
 */
router.post('/', function (req, res) {
    User.create(req.body, function (err, user) {
        if(err){
            res.status(400).send({
                errors: err
            })
        }else{
            res.status(200).send({
                message: 'User successfully created',
                user: user
            })
        }
    });
});

/**
 * It updates the fields passed in the body of the given userId
 */
router.put('/:userId',authMiddleware.hasValidToken, function (req, res) {
    User.update(req.params.userId, req.body, function (err, user) {
        if(err){
            res.status(400).send({
                errors: err
            })
        }else{
            res.status(200).send({
                message: 'User successfully updated',
                user: user
            })
        }
    })
});

/**
 * It deletes the given user by Id
 * Can be called only by the given user.
 * This will delete permanently everything related to it.
 */
router.delete('/:userId', authMiddleware.hasValidToken, function (req, res) {
    // search for events created by that user
    Event.find({organizerId: req.params.userId}, function (err, events) {
        if (err) {
            return res.status(400).send({
                errors: [err]
            })
        }else{
            // if the user has not organized yet, he/she can be deleted
            if(events.length === 0){
                User.delete(req.params.userId, function (err, user) {
                    if(err){
                        res.status(400).send({
                            errors: [err]
                        })
                    }else{
                        res.status(200).send({
                            message: 'User successfully deleted'
                        })
                    }
                })
            }else{
                return res.status(400).send([{
                    message: 'You cannot delete your account because you have created events.'
                }])
            }
        }
    });
});

module.exports = router;
