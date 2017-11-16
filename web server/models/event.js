var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = Schema({
    name: {
        type: String,
        required: [true, 'Name of the event is required.'],
        minlength: 1,
        unique: true
    },
    //Changed this to string because organizerID returns numbers and alphas
    organizerId: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: [true, 'Type of the event is required.']
    },
    description: {
        type: String,
        required: [true, 'A short description of the event is required.']
    },
    country: {
        type: String,
        required: [true, 'Country is required.']
    },
    city: {
        type: String,
        required: true
    },
    startingTime: {
        type: Date,
        required: true
    },
    maxDuration: {
        type: Number,
        required: true
    },
    enrollmentOpeningAt: {
        type: Date,
        required: true,
        validate: [
            function (value) {
                return this.enrollmentClosingAt > value
            }
        ]
    },
    enrollmentClosingAt: {
        type: Date,
        required: true,
        validate: [
            function (value) {
                return this.enrollmentOpeningAt < value
            }
        ]
    },
    participantsList: {
        type: [Number],
        required: true,
        default: []
    },
    logo: {
        type: String,
        required: false
    },
    routes: {
        type: [String], //TODO to change with coordinates
        required: true,
        default: []
    },
    created_at: {
        type: Date,
        select: false
    },
    updated_at: {
        type: Date,
        select: false
    }
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
    this.findOne({name: name}, function (err, event) {
        if(err){
            return callback(err)
        }else{
            return callback(null, event)
        }
    })
};
/* It finds an event by name passed
 * Then, calls callback with either an error or the found event
 */
eventSchema.statics.findByEventId = function (eventId, callback ){
    this.findOne({_id: eventId}, function (err, event) {
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
 //TODO removePrivateFields
eventSchema.statics.create = function (eventJson, callback) {
    var event = new Event(eventJson);

    event.save(function (err, event) {
        if (err) {
            return callback(err)
        } else {
            //event.removePrivateFields();
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

//deletes an event

eventSchema.statics.delete = function (eventId, callback){
    /* find logged user and compare with organizerId
    * if they match then the event can be deleted
    */
    this.findOne({_id: eventId}, function (err, event){
        if(err) {
            return callback(err)
        }else{
            event.remove({_id: eventId}, function(err, event){
                if(err){
                    callback(err)
                }
                else{
                    return callback(null, event)
                }
            })
        }
    })
};

var Event = mongoose.model('Event', eventSchema);
module.exports = Event;