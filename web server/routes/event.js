var express = require('express');
var router = express.Router();

var Event = require('../models/event');


// returns the list of all events //
router.get('/', function(req, res) {
    Event.find({},function(err, event){
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


// It return the details of the requested eventId. //
router.get('/:eventId', function (req, res) {
    Event.findById(req.params.eventId, function (err, event) {
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
// It return the details of the requested event. //
router.get('/event/:name', function (req, res) {
    Event.findByName(req.params.name, function (err, event) {
        if (err) {
            res.status(400).send({
                errors: err
            })
        } else {

            res.status(200).send({
                events:event
            })
        }
    })
});


/* It creates the event passed in the body.
 * It returns the detail of the event just created.
 */
router.post('/', function (req, res) {
    Event.create(req.body, function (err, event) {
        if (err) {
            res.status(400).send({
                errors: err
            })
        }else{
            res.status(200).send({
                message: 'Event successfully created',
                event: event
            })
        }
    })
});


/**
 * It updates the fields passed in the body of the given eventId
 */
router.put('/:eventId', function (req, res) {
    Event.update(req.params.eventId, req.body, function (err, num_updated) {
        if(err){
            res.status(400).send({
                errors: err
            })
        }else{
            res.status(200).send({
                message: 'Event successfully updated',
                event_num_updated: num_updated
            })
        }
    })
});

//deletes an event by given ID in URI

router.delete('/:eventId', function(req,res){
    Event.delete(req.params.eventId, function(err,event) {
        if(err){
            res.status(400).send({
                errors: err
            })
        }else{
            res.status(200).send({
                message: 'Event successfully deleted',
                event: event
            })
        }
    })
});

module.exports = router;