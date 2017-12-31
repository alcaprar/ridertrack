var Event = require('../models/event');
var Enrollment = require('../models/enrollment');

var spotGen3Consumer = require('./spotgen');

var consumers = {
    "spot-gen-3": spotGen3Consumer,
    restartAll: function () {
        // get all the events that are ongoing
        Event.find({status: 'ongoing'}, function (err, events) {
            if(err){
                console.log('[ConsumersManager] error while getting events', err);
                return;
            }

            // for each event find the enrollments that has a device, and start the corresponding consumer
            for(let i = 0; i < events.length; i++){
                var eventId = events[i]._id;

                Enrollment.find({eventId: eventId, device: { $exists: true}}, function (err, enrollments) {
                    if(err){
                        console.log('[ConsumersManager] error while getting the enrollments', err);
                        return;
                    }

                    // for each enrollment start the corresponding consumer
                    for(let j = 0; j < enrollments.length; j++){
                        var enrollment = enrollments[i];

                        switch (enrollment.device.deviceType){
                            case 'spot-gen-3':
                                // start the consumer of the spot
                                spotGen3Consumer.start(enrollment);
                                break;
                            default:
                                console.log('[ConsumersManager] device type is not supported.', enrollment)
                        }
                    }
                })
            }
        })
    }
};

module.exports = consumers;
