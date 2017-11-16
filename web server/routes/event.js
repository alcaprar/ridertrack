var express = require('express');
var router = express.Router();

var Event = require('../models/event');

var authMiddleware = require('../middlewares/auth');

/**
 * It returns the list of all the events.
 * It accepts query params for filtering the events: name, type....
 */
router.get('/', function(req, res) {
    var conditions = {};
    
    // check for query parameters
    // if they are present, add them to the conditions
    if(req.query.name){
        conditions.name = req.query.name
    }
    if(req.query.type){
        conditions.type = req.query.type
    }
    
    Event.find(conditions, function(err, event){
        if (err) {
            res.status(400).send({
                errors: err
            })
        } else {
            res.status(200).send({
                events: event
            })
        }
    })
});

/**
 * It returns the detail of the given eventId
 */
router.get('/:eventId', function (req, res) {
    Event.findById(req.params.eventId, function (err, event) {
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
 * It creates the event passed in the body.
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
    var userId = req.userId;
    var eventId = req.params.eventId;

    Event.findByEventId(eventId, function (err, event) {
        if (err) {
            res.status(400).send({
                errors: err
            })
        }
        //Only organizer can change event
        else if (event.organizerId !== userId) {
            res.status(401).send({
                errors: ["You are not allowed to change event"]
            })
        }
        //you have been logged in as organizer
        else {
            Event.update(req.params.eventId, req.body, function (err, num_updated) {
                if (err) {
                    res.status(400).send({
                        errors: err
                    })
                } else {
                    res.status(200).send({
                        event_num_updated: num_updated
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
    var userId = req.userId;
    
    // TODO authorization
    
    Event.delete(req.params.eventId, function(err, event) {
        if(err){
            res.status(400).send({
                errors: err
            })
        }else{
            res.status(200).send({
                message: 'Event successfully deleted'
            })
        }
    })
});

module.exports = router;