var express = require('express');
var router = express.Router();
var config = require('../config');
var fs = require('fs');

var async = require('async');

var Event = require('../models/event');
var User = require('../models/user');
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

/**
 * It returns the list of all the events.
 * It accepts query params for filtering the events: name, type, country, city.
 * Inspired here: https://specs.openstack.org/openstack/api-wg/guidelines/pagination_filter_sort.html
 */
router.get('/', function(req, res) {
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
    }else{
        options.sort = {
            'startingDate': 'asc'
        }
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
 * It return the list of participants of the requested event.
 */
router.get('/:eventId/participantsList', function (req, res, next) {
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

/**
 * It returns the logo of the requested event.
 * It changes the content type of the response to the mimetype of the image stored.
 */
router.get('/:eventId/logo', function (req, res, next) {
    var eventId = req.params.eventId;

    Event.findByEventId(eventId, function (err, event) {
        if(err){
            res.status(400).send({
                errors: err
            })
        }else{
            if(event.logo){
                // change the header according to the mime type
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
router.get('/:eventId',  function (req, res) {
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
router.get('/:eventId/organizer', function (req, res) {
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
router.post('/', authMiddleware.hasValidToken, multipart, function (req, res) {
    console.log('[POST /events]');

    var event = req.body;

    // set logo variables to default value
    var tempPath = __dirname + '/../logo.png';
    var logoMimeType = 'image/png';

    // check image
    if(req.files.logo) {
        // if image exists, override default values
        tempPath = req.files.logo.path;
        logoMimeType = req.files.logo.type;
    }

    // check image mimetype
    if(allowedImgExtension.indexOf(logoMimeType) === -1){
        console.log('[POST /events] logo extension not allowed: ', logoMimeType);
        return res.status(400).send({
            errors: [{message: 'Image extension not supported.'}]
        })
    }
    // load the image as binary, in order to store it in mongo
    event.logo = {
        data: fs.readFileSync(tempPath),
        contentType: logoMimeType
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
router.put('/:eventId', authMiddleware.hasValidToken, authMiddleware.isOrganizer, multipart, function (req, res) {
    Event.update(req.params.eventId, req.body, function (err, event) {
        if (err) {
            return res.status(400).send({
                errors: [err]
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
 * Gets the location from a mobile app in form of an object[lat,lon]
 * adds the coordinates(String) of last location to the end of location list.
 * if a location for an user in an event isn't created it creates it
 * if it is created than it updates it with adding the coordinates(String)
 */
router.post('/:eventId/participants/positions', authMiddleware.hasValidToken, authMiddleware.isEnrolled, function (req, res, next) {
    //var userId = req.body.userId;
    var userId = req.userId;
    var eventId = req.params.eventId;

    console.log('[POST /positions]', req.body);

    // check if the event has started
    Event.findByEventId(eventId, function (err, event) {
        if(err){
            return res.status(400).send({
                errors: [err]
            })
        }else if(event.status === 'ongoing'){
            // the event is ongoing and the position can be accepted
            Positions.add(userId, eventId, req.body, function (err, userPositions) {
                if (err) {
                    res.status(400).send({
                        errors: [err]
                    })
                }else{
                    res.status(200).send({
                        message: "Positions updated successfully",
                        location: userPositions,
                        distanceToTheEnd: (userPositions.distanceToTheEnd) ? userPositions.distanceToTheEnd : -1
                    });

                    console.log('Updating ranking')
                    Ranking.update(eventId, function(err){
                        if (err){
                            console.log("Error in updating ranking: ", err);
                        }else{
                            console.log("Ranking updated successfully");
                        }
                    })
                }
            })
        }else if(event.status === 'passed'){
            return res.status(400).send({
                errors: [{message: "The event has finished."}]
            })
        }else if(event.status === 'planned'){
            return res.status(400).send({
                errors: [{message: "The event has not started yet."}]
            })
        }else{
            console.log('[EventRoute][POST positions] unexpected event status', status);
            return res.status(400).send({
                errors: [{message: "Unexpected error while checking the event."}]
            })
        }
    });

});

/**
 * It returns a list with the most recent positions of all the users in the event.
 */
router.get('/:eventId/participants/positions', function (req, res, next) {
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
 * Gets the location of the last location of an user.
 * Coordinates are an object {[lat,lng]}
 */
router.get('/:eventId/:userId/location', function (req, res) {
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
router.get('/:eventId/ranking', function (req, res) {
    var eventId = req.params.eventId;
    Ranking.get(eventId, function (err, ranking) {
        if (err) {
            res.status(400).send({
                errors: [err]
            })
        }else {
            res.status(200).send({
                ranking: ranking.ranking
            })
        }
    });
});

/**
 * It deletes the event with the id given in the URI
 */
router.delete('/:eventId', authMiddleware.hasValidToken, authMiddleware.isOrganizer, function(req,res){
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
router.get('/:eventId/route', function(req, res){
    var eventId = req.params.eventId;
    Route.findByEventId(eventId, function(err, route){
        if (err){
            return res.status(400).send({
                errors: [err.message]
            });
        }
        else{
            return res.status(200).send({
                type: (route) ? route.type : '',
                coordinates: (route) ? route.coordinates : []
            });
        }
    })
});

/**
 * It creates the route for the given event.
 * It before checks if the user is logged in and if he/she is the owner of the event.
 */
router.post('/:eventId/route', authMiddleware.hasValidToken, authMiddleware.isOrganizer, function(req, res){
    console.log('[POST /events/route]', req.params.eventId, req.body);
    var eventId = req.params.eventId;
    var routeType = req.body.type;
    var routeCoordinates = req.body.coordinates;
    var routeLength = req.body.length;

    Route.create(eventId, routeType, routeCoordinates, function(err, routeCoordinates){
        if(err){
            return res.status(400).send({
                errors: [err]
            });
        }else{
            return res.status(200).send({
                coordinates: routeCoordinates
            });
        }
    });
});

/**
 * It updates the route for the given event.
 */
router.put('/:eventId/route', authMiddleware.hasValidToken, authMiddleware.isOrganizer, function(req,res){
    var eventId = req.event._id;
    var routeType = req.body.type;
    var routeCoordinates = req.body.coordinates;
    var routeLength = req.body.length;

    Route.update(eventId, routeType, routeCoordinates, function(err, updatedCoordinates){
        if (err){
            return res.status(400).send({
                errors: [err]
            });
        }else{
            // update the length of the event
            Event.update(eventId, {length: routeLength}, function (err, event) {
                if(err){
                    console.log('[PUT /route] error while updating the length', err)
                }
                return res.status(200).send({
                    message: 'Route updated successfully.'
                });
            });

        }
    });
});

/**
 * It deletes the route for the given event.
 * It checks if the user is the organizer.
 */
router.delete('/:eventId/route', authMiddleware.hasValidToken, authMiddleware.isOrganizer, function(req,res){
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
 * It uses the method on the event model, that checks if it is possible to start the tracking.
 * It uses the authMiddlewares in order to check if the user is logged and if he/she is the organizer.
 * It initialize the positions of all the users in the starting point.
 * It starts all the consumers for active tracking.
 */
router.post('/:eventId/tracking/start', authMiddleware.hasValidToken, authMiddleware.isOrganizer, function (req, res) {
    Event.findByEventId(req.params.eventId, function(err, event){
        if (err) {
            res.status(400).send({
                errors: err
            })
        }
        else {
            var startDate = event.startingDate;
            var today = new Date();
            if(today.getDate() === startDate.getDate()&& today.getMonth() === startDate.getMonth() && today.getFullYear() === startDate.getFullYear()) {
                req.event.startTracking(function (err) {
                    if (err) {
                        return res.status(400).send({
                            errors: [err]
                        });
                    } else {
                        // initialize all the users positions to the starting point of the route. needed for the proper working of ranking
                        Positions.initializeAll(req.event._id, function (err) {
                            if (err) {
                                console.log('[EventRoute][start tracking] error while initializing the positions', err)
                            }
                        });

                        // start the consumers
                        var consumers = require('../consumers');
                        consumers.startEvent(req.event._id);

                        return res.status(200).send({
                            message: 'Tracking started successfully.'
                        });

                    }
                })
            }
            else{
                return res.status(400).send([{
                    message: 'You can start tracking of an event only on date of event.'
                }])
            }
        }
    })
});

/**
 * It stops the tracking of an event.
 * It uses the method on the event model.
 * It uses the authMiddlewares in order to check if the user is logged and if he/she is the organizer.
 */
router.post('/:eventId/tracking/stop', authMiddleware.hasValidToken, authMiddleware.isOrganizer, function (req, res) {
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

module.exports = router;
