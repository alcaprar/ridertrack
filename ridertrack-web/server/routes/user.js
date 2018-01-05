var express = require('express');
var router = express.Router();
var config = require('../config');
var async = require('async');
var fs = require('fs');

var User = require('../models/user');
var Event = require('../models/event');
var Enrollment = require('../models/enrollment');

var authMiddleware = require('../middlewares/auth');

var multipart = require('connect-multiparty')({
    uploadDir: config.uploadImageFolder,
    maxFilesSize: 1024 * 3000 // 1 MB
});

var allowedImgExtension = ['image/png', 'image/jpg', 'image/jpeg'];
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
 * It returns the picture of the requested user.
 * It changes the content type of the response to the mimetype of the image stored.
 */
router.get('/:userId/logo', function (req, res) {
    var userId = req.params.userId;

    User.findByUserId(userId, function (err, user) {
        if(err){
            res.status(400).send({
                errors: err
            })
        }else{
            if(user.logo){
                // change the header according to the mime type
                res.header('Content-type', user.logo.contentType);
                res.end(user.logo.data, 'binary');
            }else{
                // send the default logo
                res.status(200).send('logo')
            }
        }
    })
});

/**
 * It returns the events enrolled by the user.
 */
router.get('/:userId/enrolledEvents', authMiddleware.hasValidToken, function (req, res){
    var options = {};
    var conditions = {
        userId: req.params.userId
    };
    let enrolledEventsIdList= [];

    // if there is at least one of those params, they are requesting the paginated version
    if(req.query.page || req.query.itemsPerPage){
        var page = parseInt(req.query.page) || 1;
        var itemsPerPage = parseInt(req.query.itemsPerPage) || 10;
        options.skip = (parseInt(page) -1) * parseInt(itemsPerPage);
        options.limit = itemsPerPage;
    }

    // always sort by startingDate asc
    options.sort = {
        'startingDate': 'asc'
    };

    // using async lib to find the total number and find the events in parallel
    var countEnrollments = function (callback) {
        Enrollment.find(conditions, function (err, enrollments) {
            if(err){
                callback(err)
            }else{
                callback(null, enrollments.length)
            }
        })
    };

    var findEnrollments = function (callback) {
        Enrollment.find(conditions, null, options, function (err, enrollment){
            if (err) {
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
            var response;
            if(req.query.page || req.query.itemsPerPage){
                // if they requested a paginated result, add also info about pages
                response = {
                    events: results[1],
                    page: page,
                    itemsPerPage: itemsPerPage,
                    totalPages: Math.ceil(results[0]/itemsPerPage)
                }
            }else{
                // if they requested a not paginated result, add only events list
                response = {
                    events: results[1]
                }
            }
            res.status(200).send(response)
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
router.put('/:userId', authMiddleware.hasValidToken, multipart, function (req, res) {
    var userBody = req.body;

    // check image
    if(req.files.logo) {
        tempPath = req.files.logo.path;
        logoMimeType = req.files.logo.type;

        if (allowedImgExtension.indexOf(logoMimeType) === -1) {
            console.log('[POST /users] logo extension not allowed: ', logoMimeType);
            return res.status(400).send({
                errors: [{message: 'Image extension not supported.'}]
            })
        }
        userBody.logo = {
            data: fs.readFileSync(tempPath),
            contentType: logoMimeType
        };
    }
    User.update(req.params.userId, userBody, function (err, user) {
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
            if(events.length === 0){
                // if the user has not organized yet, he/she can be deleted
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
                // otherwise return an error
                return res.status(400).send([{
                    message: 'You cannot delete your account because you have created events.'
                }])
            }
        }
    });
});

module.exports = router;
