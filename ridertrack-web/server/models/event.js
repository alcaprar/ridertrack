var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Route = require('./route');
var Ranking = require('./ranking');

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
    status: {
        type: String,
        enum: ['planned', 'ongoing', 'passed'],
        default: 'planned'
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
    actualStartingTime: {
        type: Date
    },
    maxDuration: {
        type: Number
    },
    length: {
        type: Number
    },
    maxParticipants: {
        type: Number,
        default: 100
    },
    enrollmentOpeningAt: {
        type: Date
    },
    enrollmentClosingAt: {
        type: Date
    },
    logo: {
        data: Buffer,
        contentType: String
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

/**
 * Error handler. It is executed on every save if errors occur.
 * Inspired here. http://thecodebarbarian.com/mongoose-error-handling
 */
eventSchema.post('save', function (err, doc, next) {
    console.log('[EventModel][error]', err);
    if(err.name === 'MongoError' && err.code === 11000){
        next({message: 'En event with this name already exists.'})
    }else{
        next({message: err.msg})
    }
});

/** It finds an event by name passed
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

/** It finds an event by id passed
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

/**
 * It finds events by passed list of eventsId
 */
eventSchema.statics.findEventsFromList = function (eventsIdList, callback ){
    this.find(
            {_id: {$in: eventsIdList}}, function (err, event) {
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
    event.status = 'planned';

    event.save(function (err, event) {
        if (err) {
            return callback(err)
        } else {
            // create an empty route
            Route.create(event._id, [], function (err) {
                if(err){
                    console.log('[EventModel][create] error while creating an empty route.')
                }
            });
            Ranking.create(event._id, function (err) {
                if(err){
                    console.log('[EventModel][create] error while creating an ranking route.')
                }
            });
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
    this.findOne({_id: eventId}, function (err, event) {
        if (err) {
            return callback(err)
        } else {
            // override the previous value
            console.log('Event ', eventJson);
            for (let key in eventJson) {
                if(fieldsNotChangeable.indexOf(key) === -1){
                    // if a key in the json passed is null, remove the previous value
                    if([null, 'null'].indexOf(eventJson[key]) > -1 ){
                        if(typeof event[key] !== 'undefined'){
                            event[key] = undefined;
                        }
                    }else{
                        event[key] = eventJson[key]
                    }
                }
            }

            event.save(function (err,updatedEvent) {
                if (err) {
                    return callback(err)
                } else {
                    return callback(null, updatedEvent)
                }
            })
        }
    })
};

/**
 * It deletes an event.
 * @param eventId
 * @param callback
 */
eventSchema.statics.delete = function (eventId, callback){
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

/**
 * It starts the tracking of the event changing the status of it.
 * It returns an error if the status is different than planned.
 * @param callback
 * @returns {*}
 */
eventSchema.methods.startTracking = function (callback) {
    if(this.status === 'planned'){
        // if the status is planned is possible to start the tracking
        // change the status and save
        this.status = 'ongoing';
        this.actualStartingTime = new Date;
        this.save(function (err) {
            if(err){
                console.log('[EventModel][startTracking] error while saving', err);
                return callback({message: 'Error while updating the status of the event.'});
            }else{
                return callback(null)
            }
        })
    }else{
        // if the status is different than planned is not possible to start the tracking
        return callback({message:  'The event is already ongoing or passed.'})
    }
};

/**
 * It stops the tracking of the event changing the status of it.
 * It returns an error if the status is different than ongoing.
 * @param callback
 * @returns {*}
 */
eventSchema.methods.stopTracking = function (callback) {
    if(this.status === 'ongoing'){
        // if the status is planned is possible to start the tracking
        // change the status and save
        this.status = 'passed';
        this.save(function (err) {
            if(err){
                console.log('[EventModel][stopTracking] error while saving', err);
                return callback({message: 'Error while updating the status of the event.'});
            }else{
                return callback(null)
            }
        })
    }else{
        // if the status is different than planned is not possible to start the tracking
        return callback({message:  'The event is already passed or still only planned.'})
    }
};

var Event = mongoose.model('Event', eventSchema);
module.exports = Event;
