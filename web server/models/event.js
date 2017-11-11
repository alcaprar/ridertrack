var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var eventSchema = Schema({
    name: {
        type: String,
        required: true,
        minlength: 1
    },
    type_of_event: {
        type: String,
        required: true,
        minlength: 1,
        enum:['running', 'cycling', 'other']
    },
    date: {
        type: Date,
        required: true,
        minlength: 1
    },
    description: {
        type: String,
        required: true,
    },
    created_at: {
        type: Date,
        select: false
    },
    updated_at: {
        type: Date,
        select: false}
});

// on every save, add the date
eventSchema.pre('save', function(next) {
    // get the current date
    var currentDate = new Date();
    // change the updated_at field to current date
    this.updated_at = currentDate;
    // if created_at doesn't exist, add to that field
    if (!this.created_at) {
        this.created_at = currentDate;
    }
    next();
});



/* It finds an event by name passed
 * Then, calls callback with either an error or the found event
 */
eventSchema.statics.findByName = function (name, callback ){
    this.find({name: name}, function (err, event) {
        if(err){
            return callback(err)
        }else{
            return callback(null, event)
        }
    })
};




 /* It creates an event.
  * It then calls a callback passing either an error list or the created event.
 */

eventSchema.statics.create = function (eventJson, callback) {
    var event = new Event(eventJson);

    event.save(function (err, event) {
        if (err) {
            return callback(err)
        } else {
            event.removePrivateFields();
            return callback(null, event)
        }
    })
};

// Updates an event. Note: there might be an easier way of doign this looking at docs.
eventSchema.statics.update = function (eventId, eventJson, callback) {
// find the right event and modify it
    this.findOne({_id: eventId}, function (err, event) {
        if (err) {
            return callback(err)
        } else {
            // override the previous value
            for (let key in eventJson) {
                event[key] = eventJson[key]
            }

            event.save(function (err) {
                if (err) {
                    return callback(err)
                } else {
                    return callback(null, event)
                }
            })
        }
    })


};
var Event = mongoose.model('Event', eventSchema);
module.exports = Event;