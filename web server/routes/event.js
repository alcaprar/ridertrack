var express = require('express');
var router = express.Router();

var Event = require('../models/event');


// returns the list of all events //
router.get('/', function(req, res) {
    Event.find({},function(err, events){
        if(err){
            res.send({
                status: 'failed',
                errors: err
            })
        }else {
            res.send({
                status: 'success',
                events: events
            })
        }
    })
});


// It return the details of the requested eventId. //
router.get('/:eventId', function (req, res) {
    res.send(req.params)
  //  res.status(200).send({
   //     event: user
   // })

});


/* It creates the event passed in the body.
 * It returns the detail of the event just created.
 */
router.post('/', function (req, res) {
    Event.statics.create(req.body, function (err, event) {
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
router.put('/:eventId', function (req, res) {
    Event.update(req.params.eventId, req.body, function (err, num_updated) {
        if(err){
            res.status(400).send({
                errors: err
            })
        }else{
            res.status(200).send({
                event_num_updated: num_updated
            })
        }
    })
});



module.exports = router;