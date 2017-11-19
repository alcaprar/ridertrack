var express = require('express');
var router = express.Router();

var Event = require('../models/event');

var authMiddleware = require('../middlewares/auth');

/**
 * It returns the list of all the events.
 * It accepts query params for filtering the events: name, type, country, city.
 * Inspired here https://specs.openstack.org/openstack/api-wg/guidelines/pagination_filter_sort.html
 */
router.get('/', function(req, res) {
    var conditions = {};

    var pagination = {
        page: (req.query.page) ? req.query.page : 1,
        itemsPerPage: (req.query.page) ? req.query.itemsPerPage : 10
    };


    // check sorting
    var sort = {};
    if(req.query.sort){
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
    }
    
    // check for query parameters
    // if they are present, add them to the conditions
    if(req.query.name){
        conditions.name = req.query.name
    }
    if(req.query.type){
        conditions.type = req.query.type
    }
    if(req.query.country){
        conditions.country = req.query.country
    }
    if(req.query.city){
        conditions.city = req.query.city;
    }
    
    Event.find(conditions, null, {sort: sort}, function(err, events){
        if (err) {
            res.status(400).send({
                errors: err
            })
        } else {
            res.status(200).send({
                events: events
            })
        }
    })
});

/**
 * It returns the list of distinct cities of all the events.
 */
router.get('/allCities', function (req, res, next) {

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