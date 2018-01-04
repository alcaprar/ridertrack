var Event = require('../models/event');
var Enrollment = require('../models/enrollment');

var spotGen3Consumer = require('./spotgen');

var consumers = {
    "spot-gen-3": spotGen3Consumer,
    /**
     * It starts all the consumers for the given event.
     * It fetches all the enrollments and for each starts the right consumer.
     * @param eventId
     */
    startEvent: function (eventId) {
        // fetch all the enrollments with a device for the given event
        Enrollment.find({eventId: eventId, device: { $exists: true}}, function (err, enrollments) {
            if(err){
                console.log('[ConsumersManager][startEvent] error while getting the enrollments', err);
                return;
            }

            // for each enrollment start the corresponding consumer
            for(let j = 0; j < enrollments.length; j++){
                var enrollment = enrollments[j];

                switch (enrollment.device.deviceType){
                    case 'spot-gen-3':
                        // start the consumer of the spot
                        console.log('[ConsumersManager][startEvent] starting spot-gen-3 for', enrollment.userId);
                        spotGen3Consumer.start(enrollment);
                        break;
                    default:
                        console.log('[ConsumersManager][startEvent] device type is not supported.', enrollment)
                }
            }
        })
    },
    /**
     * It restarts all the consumers for all the ongoing events.
     * it fetches all the ongoing events, and for each of them fetches all the enrollment.
     * For each enrollment starts the right consumer.
     * Function called after the booting of the backend.
     */
    restartAll: function () {
        // get all the events that are ongoing
        Event.find({status: 'ongoing'}, function (err, events) {
            if(err){
                console.log('[ConsumersManager][restartAll] error while getting events', err);
                return;
            }

            if(events && events.length > 0){
                // for each event find the enrollments that has a device, and start the corresponding consumer
                for(let i = 0; i < events.length; i++){
                    var eventId = events[i]._id;

                    // start the consumers for the event
                    consumers.startEvent(eventId);
                }
            }else{
                console.log('[ConsumersManager][restartAll] 0 events ongoing. No need to restart consumers.');
            }
        })
    }
};

module.exports = consumers;
