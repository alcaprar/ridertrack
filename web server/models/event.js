var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// list of fields that an user can not change
const fieldsNotChangeable = ['_id', 'organizerId', '__v', 'created_at', 'updated_at'];

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
        enum: ['running', 'cycling', 'hiking', 'triathlon', 'other'],
        required: [true, 'Type of the event is required.']
    },
    description: {
        type: String
    },
    country: {
        type: String,
        required: [true, 'Country is required.']
    },
    city: {
        type: String,
        required: [true, 'City is required.']
    },
    startingDate: {
        type: String,
        required: [true, 'A date is required.']
    },
    startingTime: {
        type: String
    },
    maxDuration: {
        type: Number
    },
    length: {
        type: Number
    },
    price: {
        type: Number,
        default: 0
    },
    enrollmentOpeningAt: {
        type: Date
    },
    enrollmentClosingAt: {
        type: Date
    },
    participantsList: {
        type: [Number],
        default: []
    },
    logo: {
        type: String
    },
    routes: {
        type: [String], //TODO to change with coordinates
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

 /** It creates an event.
  *  It then calls a callback passing either an error list or the created event.
 */
eventSchema.statics.create = function (organizerId, eventJson, callback) {
    var event = new Event(eventJson);
    event.organizerId = organizerId;

    event.save(function (err, event) {
        if (err) {
            return callback(err)
        } else {
            return callback(null, event)
        }
    })
};

/**
 * It updates the event.
 * It returns an error if some not changeable fields are requested.
 * @param eventId
 * @param eventJson
 * @param callback
 * @returns {*}
 */
eventSchema.statics.update = function (eventId, eventJson, callback) {
    for(let key in eventJson){
        if(fieldsNotChangeable.indexOf(key) > -1){
            return callback(['You can not modify ' + key])
        }
    }
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
            event.remove({_id: eventId}, function(err){
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