var express = require('express');
var router = express.Router();

var async = require('async');

var Event = require('../models/event');
var User = require('../models/user');

var authMiddleware = require('../middlewares/auth');

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

            // sorting possible only on date, price, length
            if(['startingTime', 'price', 'length'].indexOf(key[0]) > -1){
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
            let keywords = req.query.keyword.split(' ');
            conditions.name = {
                $in: keywords
            };
            conditions.description = {
                $in: keywords
            }
        }
    }
    if(req.query.length){
        // it must be a range so the query param must be an object
        if(typeof req.query.length === 'object' && req.query.length.length === 2){
            let lengthConditions = {};

            for(let i = 0; i < req.query.length.length; i++){
                let cond = req.query.length[i].split(':');

                if(cond.length === 2){
                    // only key value are allowed: "gt:10" ...
                    let key = cond[0];
                    let value = cond[1];

                    // check the condition key is allowed
                    if(['gt', 'lt', 'gte', 'lte'].indexOf(key) > -1){
                        if(!isNaN(value)){
                            lengthConditions['$' + key] = Number(value);
                        }
                    }
                }
            }
            conditions.length = lengthConditions;
        }
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
router.get('/allCities', function (req, res, next) {
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
 * It returns the detail of the given eventId
 */
router.get('/:eventId', function (req, res) {
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
 */
router.post('/', authMiddleware.hasValidToken, function (req, res) {
    Event.create(req.body, function (err, event) {
        if (err) {
            res.status(400).send({
                errors: err
            })
        }else{
            res.status(200).send({
                event: event
            })
        }
    })
});


/**
 * It updates the fields passed in the body of the given eventId
 */
router.put('/:eventId',authMiddleware.hasValidToken,function (req, res) {
    Event.findByEventId(req.params.eventId, function (err, event) {
        if (err) {
            res.status(400).send({
                errors: err
            })
        }
        //Only organizer can change event
        else if (event.organizerId !== req.userId) {
            res.status(401).send({
                errors: ["You are not allowed to change event"]
            })
        }
        //you have been logged in as organizer
        else {
            Event.update(req.params.eventId, req.body, function (err, event) {
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
        }
    });
});

/**
 * It deletes the event with the id given in the URI
 */
router.delete('/:eventId', authMiddleware.hasValidToken, function(req,res){
    Event.findByEventId(req.params.eventId, function (err, event) {
        if (err) {
            res.status(400).send({
                errors: err
            })
        }
        else if (event.organizerId !== req.userId) {
            res.status(401).send({
                errors: "You are not allowed to delete this event"
            })
        }
        else {
            Event.delete(req.params.eventId, function (err){
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
        }
    });
});

module.exports = router;