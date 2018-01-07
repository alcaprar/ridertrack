var express = require('express');
var router = express.Router();
var config = require('../config');
var async = require('async');
var fs = require('fs');

var User = require('../models/user');
var Event = require('../models/event');
var Enrollment = require('../models/enrollment');
var Route = require ('../models/route');
var Positions = require('../models/positions');
var Ranking = require('../models/ranking');

var authMiddleware = require('../middlewares/auth');

var multipart = require('connect-multiparty')({
    uploadDir: config.uploadImageFolder,
    maxFilesSize: 1024 * 3000 // 1 MB
});

var allowedImgExtension = ['image/png', 'image/jpg', 'image/jpeg'];

/*
* For all endpoints authMiddleware checks if user has administrator role
*/

/**
 * It returns the list of all the users.
 * It accepts query params for filtering the users: email, name, surname.
 */
router.get('/users', authMiddleware.hasValidToken, authMiddleware.hasAdministratorRole, function (req, res) {
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
router.get('/users/:userId', authMiddleware.hasValidToken, authMiddleware.hasAdministratorRole, function (req, res) {
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
router.get('/users/:userId/enrolledEvents', authMiddleware.hasValidToken, authMiddleware.hasAdministratorRole, function (req, res){
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
router.get('/users/:userId/organizedEvents', authMiddleware.hasValidToken, authMiddleware.hasAdministratorRole, function(req,res){
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
router.post('/users', authMiddleware.hasValidToken, authMiddleware.hasAdministratorRole, function (req, res) {
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
router.put('/users/:userId', authMiddleware.hasValidToken, authMiddleware.hasAdministratorRole, multipart, function (req, res) {
    var userBody = req.body;

    // check image
    if (req.files.logo) {
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
    //other solution to remove it from userBody
    //else{
    //	delete userBody.logo
    //}
    User.update(req.params.userId, userBody, function (err, user) {
        if (err) {
            res.status(400).send({
                errors: err
            })
        } else {
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
router.delete('/users/:userId', authMiddleware.hasValidToken, authMiddleware.hasAdministratorRole, function (req, res) {
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

/**
 * It returns the list of all the events.
 * It accepts query params for filtering the events: name, type, country, city.
 * Inspired here: https://specs.openstack.org/openstack/api-wg/guidelines/pagination_filter_sort.html
 */
router.get('/events', authMiddleware.hasValidToken, authMiddleware.hasAdministratorRole, function(req, res) {
    var conditions = {};
    var options = {};

    // pagination always on!!
    var page = parseInt(req.query.page) || 1;
    var itemsPerPage = parseInt(req.query.itemsPerPage) || 10;
    options.skip = (parseInt(page) -1) * parseInt(itemsPerPage);
    options.limit = itemsPerPage;


    // check sorting
    if(req.query.sort){
        var sort = {};
        // keys are divided by comma
        let keys = req.query.sort.split(',');
        for(let i = 0; i < keys.length; i++){
            // check if it is also specify the way
            // default is ascending
            let key = keys[i].split(':');

            // sorting possible only on date, length
            if(['startingDate', 'length'].indexOf(key[0]) > -1){
                sort[key[0]] = (typeof key[1] !== 'undefined' && ['asc', 'desc'].indexOf(key[1]) > -1) ? key[1] : 'asc';
            }
        }
        options.sort = sort
    }

    // check for query parameters
    // if they are present, add them to the conditions
    if(req.query.type){
        conditions.type = req.query.type
    }
    if(req.query.city){
        conditions.city = req.query.city;
    }
    if(req.query.keyword){
        if(typeof req.query.keyword === 'string'){
            let keywords = req.query.keyword;

            conditions['$or'] = [
                {name: { "$regex": keywords, "$options": "i" }},
                {description: { "$regex": keywords, "$options": "i" }}
            ];
        }
    }
    // check status param
    if(req.query.status && ['planned', 'ongoing', 'passed'].indexOf(req.query.status) > -1){
        // if condition is set and it's a valid value, use it
        conditions.status = req.query.status;
    }else{
        // if condition is not set or not valid, returns only ongoing and future events
        conditions.status = { $in: ['planned', 'ongoing']}
    }
    if(req.query.lengthgte){
        conditions.length = {};
        conditions.length['$gte'] = req.query.lengthgte;
    }
    if(req.query.lengthlte){
        if(!conditions.length){
            conditions.length = {};
        }
        conditions.length['$lte'] = req.query.lengthlte;
    }

    // using async lib to find the total number and find the events in parallel
    var countEvents = function (callback) {
        Event.find({}, function (err, events) {
            if(err){
                callback(err)
            }else{
                callback(null, events.length)
            }
        })
    };

    var findEvents = function (callback) {
        Event.find(conditions, null, options, function(err, events){
            if(err){
                callback(err)
            }else{
                callback(null, events)
            }
        })
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
    })
});
/**
 * It returns the list of distinct cities of all the events.
 */
router.get('/events/allCities', authMiddleware.hasValidToken, authMiddleware.hasAdministratorRole, function (req, res) {
    Event.distinct("city", function (err, cities) {
        if(err) {
            res.status(400).send({
                errors: err
            })
        } else {
            res.status(200).send({
                cities: cities
            })
        }
    })
});

/**
 * It return the list of participants of the requested event.
 */
router.get('/events/:eventId/participantsList', authMiddleware.hasValidToken, authMiddleware.hasAdministratorRole, function (req, res) {
    var eventId = req.params.eventId;
    Enrollment.findByEventId(eventId, function (err, participants) {
        if(err) {
            res.status(400).send({
                errors: [err]
            })
        } else {
            res.status(200).send({
                participants: participants
            })
        }
    })
});

router.get('/events/:eventId/logo', authMiddleware.hasValidToken, authMiddleware.hasAdministratorRole, function (req, res) {
    var eventId = req.params.eventId;
    Event.findByEventId(eventId, function (err, event) {
        if(err){
            res.status(400).send({
                errors: err
            })
        }else{
            // TODO change the header according to the mime type
            if(event.logo){
                res.header('Content-type', event.logo.contentType);
                res.end(event.logo.data, 'binary');
            }else{
                // send the default logo
                res.status(200).send('logo')
            }
        }
    })
});
/**
 * It returns the detail of the given eventId
 */
router.get('/events/:eventId', authMiddleware.hasValidToken, authMiddleware.hasAdministratorRole, function (req, res) {
    Event.findByEventId(req.params.eventId, function (err, event) {
        if (err) {
            res.status(400).send({
                errors: err
            })
        } else {
            res.status(200).send({
                event: event
            })
        }
    })
});

/**
 * It returns the detail of the organizer of the event.
 */
router.get('/events/:eventId/organizer', authMiddleware.hasValidToken, authMiddleware.hasAdministratorRole, function (req, res) {
    Event.findByEventId(req.params.eventId, function (err, event) {
        if(!err && event) {
            return User.findById(event.organizerId, function (err, user) {
                if(err){
                    return res.status(400).send({
                        errors: err
                    })
                }else{
                    return res.status(200).send({
                        organizer: user
                    })
                }
            });
        }else{
            return res.status(400).send({
                errors: err || ['Event does not exist.']
            });
        }
    })
});

/**
 * It creates the event passed in the body after checking the user is logged in.
 * It returns the detail of the event just created.
 * Multipart middleware allows the upload of files.
 */
router.post('/events', authMiddleware.hasValidToken, authMiddleware.hasAdministratorRole, multipart, function (req, res) {
    console.log('[POST /events]');

    var event = req.body;

    // check image
    var tempPath = req.files.logo.path;
    var logoMimeType = req.files.logo.type;

    // TODO check allowed extension

    if(allowedImgExtension.indexOf(logoMimeType) === -1){
        console.log('[POST /events] logo extension not allowed: ', logoMimeType);
        return res.status(400).send({
            errors: [{message: 'Image extension not supported.'}]
        })
    }

    event.logo = {
        data: fs.readFileSync(tempPath),
        contentType: req.files.logo.type
    };

    Event.create(req.userId, event, function (err, event) {
        if (err) {
            console.log('[POST/events][error]', err);
            res.status(400).send({
                errors: [err]
            })
        }else{
            res.status(200).send({
                event: event
            })
        }

        // TODO delete the temp file in any case
    })
});
/**
 * It updates the fields passed in the body of the given eventId
 */
router.put('/events/:eventId', authMiddleware.hasValidToken, authMiddleware.hasAdministratorRole, multipart, function (req, res) {
    Event.update(req.params.eventId, req.body, function (err, event) {
        if (err) {
            return res.status(400).send({
                errors: err
            })
        } else {
            if(req.files.logo){
                console.log('[PUT /event] updating logo...');

                // check image
                var tempPath = req.files.logo.path;
                var logoMimeType = req.files.logo.type;

                if(allowedImgExtension.indexOf(logoMimeType) === -1){
                    console.log('[PUT /events] logo extension not allowed: ', logoMimeType);
                    return res.status(400).send({
                        errors: [{message: 'Image extension not supported.'}]
                    })
                }

                event.logo = {
                    data: fs.readFileSync(tempPath),
                    contentType: logoMimeType
                };


                return event.save(function (err) {
                    console.log('[PUT /events] Logo updated.');
                    if(err){
                        return res.status(400).send({
                            errors: err
                        })
                    }else{
                        return res.status(200).send({
                            event: event
                        })
                    }
                });
            }else{
                return res.status(200).send({
                    event: event
                })
            }
        }
    })
});
/**
 * It returns a list with the most recent positions of all the users in the event.
 */
router.get('/events/:eventId/participants/positions', authMiddleware.hasValidToken, authMiddleware.hasAdministratorRole, function (req, res, next) {
    var eventId = req.params.eventId;
    Event.findByEventId(eventId, function (err, event) {
        if(err){
            return res.status(400).send({
                errors: [err]
            })
        }else{
            if(!event || event.status !== 'ongoing'){
                return res.status(400).send({
                    errors: [{message: 'The event does not exist or has not started yet.'}]
                })
            }else{
                Positions.getLastPositionOfAllParticipants(eventId, function (err, usersPositions) {
                    if(err){
                        return res.status(400).send({
                            errors: [err]
                        })
                    }else{
                        return res.status(200).send({
                            positions: usersPositions
                        });
                    }
                })
            }
        }
    });
});

/**
 * gets the location of the last location of an user.
 * Coordinates are an object {[lat,lng]}
 */
router.get('/events/:eventId/:userId/location', authMiddleware.hasValidToken, authMiddleware.hasAdministratorRole, function (req, res) {

    Positions.findOne({userId: req.params.userId, eventId: req.params.eventId}, function (err, location) {
        if (err) {
            res.status(400).send({
                errors: [err]
            })
        }else{
            res.status(200).send({
                location: location
            })
        }
    })
});


/**
 * This method gets the latest ranking of the event
 */
router.get('/events/:eventId/ranking', authMiddleware.hasValidToken, authMiddleware.hasAdministratorRole, function (req, res) {
    var eventId = req.params.eventId;
    Ranking.findOne({eventId: eventId}, function (err, ranking) {
        if (err) {
            res.status(400).send({
                errors: [err]
            })
        }else {
            res.status(200).send({
                ranking: ranking
            })
        }
    });
});
/**
 * It deletes the event with the id given in the URI
 */
router.delete('/events/:eventId', authMiddleware.hasValidToken, authMiddleware.hasAdministratorRole, function(req,res){
    Event.delete(req.params.eventId, function (err){
        if (err) {
            res.status(400).send({
                errors: err
            })
        } else {
            res.status(200).send({
                message: "The event has been successfully deleted."
            })
        }
    })
});

/**
 * It returns the route of the requested event.
 */
router.get('/events/:eventId/route', authMiddleware.hasValidToken, authMiddleware.hasAdministratorRole, function(req, res){
    var eventId = req.params.eventId;
    Route.findByEventId(eventId, function(err, route){
        if (err){
            return res.status(400).send({
                errors: [err.message]
            });
        }
        else{
            return res.status(200).send({
                coordinates: (route) ? route.coordinates : []
            });
        }
    })
});

/**
 * It creates the route for the given event.
 * It before checks if the user is logged in and if he/she is the owner of the event.
 */
router.post('/events/:eventId/route', authMiddleware.hasValidToken, authMiddleware.hasAdministratorRole, function(req, res){
    console.log('[POST /events]', req.params.eventId, req.body);
    var userId = req.userId;
    var eventId = req.params.eventId;
    var coordinates = req.body.coordinates;

    Route.create(eventId, coordinates, function(err, routeCoordinates){
        if(err){
            return res.status(400).send({
                errors: [err]
            });
        }else{
            return res.status(200).send({
                message: 'Route successfully created',
                coordinates: routeCoordinates
            });
        }
    });
});

/**
 * It updates the route for the given event.
 */
router.put('/events/:eventId/route', authMiddleware.hasValidToken, authMiddleware.hasAdministratorRole, function(req,res){
    var coordinates = req.body;
    var eventId = req.event._id;

    Route.update(eventId, coordinates, function(err, updatedCoordinates){
        if (err){
            return res.status(400).send({
                errors: [err]
            });
        }
        else{
            return res.status(200).send({
                message: 'Route updated successfully.'
            });
        }
    });
});

/**
 * It deletes the route for the given event.
 * It checks if the user is the administrator.
 */
router.delete('/events/:eventId/route', authMiddleware.hasValidToken, authMiddleware.hasAdministratorRole, function(req,res){
    var eventId = req.params.eventId;
    var userId = req.userId;

    Route.delete(eventId, function(err, deletedCoordinates){
        if (err){
            return res.status(400).send({
                errors: [err]
            });
        }
        else{
            return res.status(200).send({
                message: "Route was successfully deleted."
            });
        }
    })
});

/**
 * It starts the tracking of an event.
 * It uses the method on the event model.
 * It uses the authMiddlewares in order to check if the user is logged and if he/she is the organizer.
 */
router.post('/events/:eventId/tracking/start', authMiddleware.hasValidToken, authMiddleware.hasAdministratorRole, function (req, res) {
    req.event.startTracking(function (err) {
        if(err){
            return res.status(400).send({
                errors: [err]
            });
        }else{
            return res.status(200).send({
                message: 'Tracking started successfully.'
            });
        }
    })
});

/**
 * It stops the tracking of an event.
 * It uses the method on the event model.
 * It uses the authMiddlewares in order to check if the user is logged and if he/she is the organizer.
 */
router.post('/events/:eventId/tracking/stop', authMiddleware.hasValidToken, authMiddleware.hasAdministratorRole, function (req, res) {
    req.event.stopTracking(function (err) {
        if(err){
            return res.status(400).send({
                errors: [err]
            });
        }else{
            return res.status(200).send({
                message: 'Tracking stopped successfully.'
            });
        }
    })
});

/**
 * It returns the list of all the enrollments.
 * It accepts query params for filtering the enrollments: eventId, userId
 */
router.get('/enrollments', authMiddleware.hasValidToken, authMiddleware.hasAdministratorRole, function (req, res) {
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
router.post('/enrollments', authMiddleware.hasValidToken, authMiddleware.hasAdministratorRole, function(req, res){
    Event.findOne({_id: req.body.eventId}, function(err, event){
        if(err){
            res.status(400).send({
                errors: err
            })
        }else {
            if(!event){
                return res.status(400).send({
                    errors: [{message: 'Event does not exist.'}]
                })
            }else{

                if(!event.enrollmentOpeningDate || !event.enrollmentClosingDate){
                    return res.status(400).send({
                        errors: [{message: 'The enrolling time is not defined yet.'}]
                    })
                }

                var currentDate = new Date();
                // if(currentDate >= new Date(event.enrollmentOpeningDate) && currentDate <= new Date(event.enrollmentClosingDate)){
                Enrollment.find({eventId: req.body.eventId}, function (err, enrollments) {
                    if (err) {
                        callback(err)
                    } else {
                        if (enrollments.length < event.maxParticipants) {
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
                            return res.status(400).send({
                                errors: "The event has reached the maximum of participants."
                            })
                        }
                    }
                })
            }
        }
    })
});

/**
 * It return the enrollments of the requested eventId
 */
router.get('/enrollments/:eventId', authMiddleware.hasValidToken, authMiddleware.hasAdministratorRole, function (req, res) {
    Enrollment.findByEventId(req.params.eventId, function (err, enrollment) {
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
router.put('/enrollments/:enrollmentId', authMiddleware.hasValidToken, authMiddleware.hasAdministratorRole, function (req, res) {
    Enrollment.findOne({_id: req.params.enrollmentId}, function(err, enrollment) {
        if (err) {
            res.status(400).send({
                errors: err
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
 * Can be called only by admin
 * This will delete permanently everything related to it.
 */
router.delete('/enrollments/:eventId/:userId', authMiddleware.hasValidToken, authMiddleware.hasAdministratorRole, function (req, res) {
    Enrollment.delete(req.params.eventId, req.params.userId, function (err, deleted_enrollment) {
        if (err) {
            return res.status(400).send({
                errors: err
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
