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
        type: Date,
        required: [true, 'A date is required.']
    },
    startingDateString: { // redundancy for mobile app
        type: String
    },
    startingTimeString: { // redundancy for mobile app
        type: String
    },
    closingDate: {
        type: Date
    },
    closingDateString: {
        type: String
    },
    closingTimeString: {
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
    enrollmentOpeningDate: {
        type: Date
    },
    enrollmentClosingDate: {
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

/**
 * It adds timing info about creation and modification of event documents.
 */
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
 * It checks the enrollment timing.
 * The opening and closing cannot be after the startingDate.
 * The opening cannot be after the closing.
 */
eventSchema.pre('save',function(next){
	var event = this;
    var err = new Error();

    // cast startingDate to Date object
    var startingDate = event.startingDate;
    if(event.startingDate){
        // if enrollmentOpeningDate is set, check that is not after the startingDate
        if(event.enrollmentOpeningDate){
            if(event.enrollmentOpeningDate > startingDate){
                // the enrollmentOpening is after the startingDate
                err.message = 'The enrollment opening time cannot be after the starting date.';
                return next(err)
            }
        }
    }else{
        err.message = 'Starting date is not set.';
        return next(err)
    }

    if(event.closingDate){
        // if closingDate is set, it can not be before startingDate
        if(event.closingDate < startingDate){
            // the closingDate is after the startingDate
            err.message = 'The closing time cannot be before the starting date.';
            return next(err)
        }
    }


    // if enrollmentClosingDate is set, check that is not after the startingDate
    if(event.enrollmentClosingDate){
        if(event.enrollmentClosingDate > startingDate){
            // the enrollmentCLosing is after the startingDate
            err.message = 'The enrollment closing time cannot be after the starting date.';
            return next(err)
        }
    }

    // if both time are set, check that the opening is not after the closing
    if(event.enrollmentOpeningDate && event.enrollmentClosingDate){
        if(event.enrollmentOpeningDate > event.enrollmentClosingDate){
            err.message = 'The enrollment opening time cannot be after the enrollment closing time.';
            console.log('[EventModel][pre.save] enrollmentClosingDate is before enrollmentOpeningDate', err);
            return next(err)
        }
    }

    // if all the checks pass without throwing errors the timing are okay
    next()
});

/**
 * It updates the redundancy for starting and closing date and time in string format.
 * Used by mobile app.
 */
eventSchema.pre('save', function (next) {
    var event = this;

    let day = event.startingDate.getUTCDate();
    let month = event.startingDate.getUTCMonth() + 1;
    let year = event.startingDate.getUTCFullYear();
    let hour = event.startingDate.getUTCHours();
    let minute = event.startingDate.getUTCMinutes();

    console.log('[EventModel][updateStartingDateString]', event.startingDate.toString(), hour);
    this.startingDateString = day + '/' + month + '/' + year;
    this.startingTimeString = hour + ':' + ( (minute < 10) ? '0' : '') + minute;

    if(event.closingDate){
        let day = event.closingDate.getUTCDate();
        let month = event.closingDate.getUTCMonth() + 1;
        let year = event.closingDate.getUTCFullYear();
        let hour = event.closingDate.getUTCHours();
        let minute = event.closingDate.getUTCMinutes();

        console.log('[EventModel][updateClosingDateString]', event.closingDate.toString(), hour);
        this.closingDateString = day + '/' + month + '/' + year;
        this.closingTimeString = hour + ':' + ( (minute < 10) ? '0' : '') + minute;
    }

    next()
});

/**
 * Error handler. It is executed on every save if errors occur.
 * Inspired here. http://thecodebarbarian.com/mongoose-error-handling
 */
eventSchema.post('save', function (err, doc, next) {
    console.log('[EventModel][error]', err.message);
    if(err.name === 'MongoError' && err.code === 11000){
        next({message: 'En event with this name already exists.'})
    }else{
        next({message: err.msg})
    }
});

/**
 * It finds an event by name passed
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

/**
 * It finds an event by id passed
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


/**
 * It creates an event.
 * It then calls a callback passing either an error list or the created event.
 */
eventSchema.statics.create = function (organizerId, eventJson, callback) {
    if(eventJson.startingDateString && eventJson.startingTimeString){
        // create date object for startingDate
        try{
            var strDate = eventJson.startingDateString.split('/'); // DD/MM/YYYY
            var strTime = eventJson.startingTimeString.split(':'); // HH:MM
            eventJson.startingDate = new Date(parseInt(strDate[2]),parseInt(strDate[1]) - 1, parseInt(strDate[0]),parseInt(strTime[0]),parseInt(strTime[1]),0, 0);
        }catch (e){
            console.log('[EventModel][create] error while parsing startingDate and time', e);
            return callback({message: 'Starting date or time is not valid.'})
        }
        let now = new Date();
        console.log(eventJson.startingDate, now,  eventJson.startingDate < now);
        /*
        TODO removed the check for creating past events
        if(eventJson.startingDate < now){
            return callback({message: 'Starting date and time should not be in the past.'})
        }
        */
    }else{
        return callback({message: 'Starting date and time is required.'})
    }
    // add organizer id and default event status
    eventJson.organizerId = organizerId;
    eventJson.status = 'planned';

    // create mongoose object
    var event = new Event(eventJson);

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
            // create an empty ranking
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
    // create date object for startingDate
    if(eventJson.startingDateString && eventJson.startingTimeString){
        try{
            let strDate = eventJson.startingDateString.split('/'); // DD/MM/YYYY
            let strTime = eventJson.startingTimeString.split(':'); // HH:MM
            eventJson.startingDate = new Date(Date.UTC(parseInt(strDate[2]),parseInt(strDate[1]) - 1, parseInt(strDate[0]),parseInt(strTime[0]),parseInt(strTime[1]),0, 0));
        }catch (e){
            console.log('[EventModel][update] error while parsing startingDate and time', e);
            return callback({message: 'Starting date or time is not valid.'})
        }

        let now = new Date();
        console.log(eventJson.startingDate, now,  eventJson.startingDate < now);
        if(eventJson.startingDate < now){
            return callback({message: 'Starting date and time should not be in the past.'})
        }
    }

    // if closing date is passed, cast it to date
    if(eventJson.closingDateString){
        try{
            // create date object for closingDate
            let closingDate = eventJson.closingDateString.split('/'); // DD/MM/YYYY
            let closingTime;
            if(eventJson.closingTimeString){
                // if closing time is set, parse it
                closingTime = eventJson.closingTimeString.split(':'); // HH:MM
            }else{
                // if closing time is not set, use a default time
                closingTime = ['12', '00']
            }
            eventJson.closingDate = new Date(Date.UTC(parseInt(closingDate[2]),parseInt(closingDate[1]) - 1, parseInt(closingDate[0]),parseInt(closingTime[0]),parseInt(closingTime[1]),0, 0));
        }catch (e){
            console.log('[EventModel][update] error while parsing closingDate and time', e);
            return callback({message: 'Closing date or time is not valid.'})
        }
    }

    // if enrollment opening date is passed, cast it to date
    if(eventJson.enrollmentOpeningDateString){
        try{
            // create date object for enrollment opening
            let enrollmentOpeningDate = eventJson.enrollmentOpeningDateString.split('/'); // DD/MM/YYYY
            let enrollmentOpeningTime;
            if(eventJson.enrollmentOpeningTimeString){
                // if enrollment opening time is set, parse it
                enrollmentOpeningTime = eventJson.enrollmentOpeningTimeString.split(':'); // HH:MM
            }else{
                // if closing time is not set, use a default time
                enrollmentOpeningTime = ['12', '00']
            }
            eventJson.enrollmentOpeningDate = new Date(Date.UTC(parseInt(enrollmentOpeningDate[2]),parseInt(enrollmentOpeningDate[1]) - 1, parseInt(enrollmentOpeningDate[0]),parseInt(enrollmentOpeningTime[0]),parseInt(enrollmentOpeningTime[1]),0, 0));
        }catch (e){
            console.log('[EventModel][update] error while parsing enrollmentOpeningDate and time', e);
            return callback({message: 'Enrollment opening date or time is not valid.'})
        }
    }

    // if enrollment closing date is passed, cast it to date
    if(eventJson.enrollmentClosingDateString){
        try{
            // create date object for enrollment closing
            let enrollmentClosingDate = eventJson.enrollmentClosingDateString.split('/'); // DD/MM/YYYY
            let enrollmentClosingTime;
            if(eventJson.enrollmentClosingTimeString){
                // if enrollment closing time is set, parse it
                enrollmentClosingTime = eventJson.enrollmentClosingTimeString.split(':'); // HH:MM
            }else{
                // if closing time is not set, use a default time
                enrollmentClosingTime = ['12', '00']
            }
            eventJson.enrollmentClosingDate = new Date(Date.UTC(parseInt(enrollmentClosingDate[2]),parseInt(enrollmentClosingDate[1]) - 1, parseInt(enrollmentClosingDate[0]),parseInt(enrollmentClosingTime[0]),parseInt(enrollmentClosingTime[1]),0, 0));
        }catch (e){
            console.log('[EventModel][update] error while parsing enrollmentClosingDate and time', e);
            return callback({message: 'Enrollment closing date or time is not valid.'})
        }
    }

    this.findOne({_id: eventId}, function (err, event) {
        if (err) {
            return callback(err)
        } else {
            if(event.status !== 'planned'){
                return callback({message: 'You cannot edit an event that is ongoing or already passed.'});
            }

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
    var event = this;
    if(event.status === 'planned'){
        // if the status is planned is possible to start the tracking

        // check if the route is set
        // events with no route can not be started
        Route.findByEventId(event._id, function (err, route) {
            if(err){
                console.log('[EventModel][startTracking][findroute]', err);
                return callback(err)
            }else{
                if(route.coordinates.length === 0){
                    return callback({message: 'The event does not have a route. The tracking cannot be started.'})
                }else{
                    // change the status and save
                    event.status = 'ongoing';
                    event.actualStartingTime = new Date;
                    event.save(function (err) {
                        if(err){
                            console.log('[EventModel][startTracking] error while saving', err);
                            return callback({message: 'Error while updating the status of the event.'});
                        }else{
                            return callback(null)
                        }
                    })
                }
            }
        });
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

/**
 * It checks if the event is ongoing.
 * @param eventId
 * @param callback
 */
eventSchema.statics.isOnGoing = function (eventId, callback) {
    // retrieve the event
    this.findOne({_id: eventId}, function (err, event) {
        if(err){
            return callback({message: "Error while checking event status."})
        }

        // check the status
        if(event && event.status === 'ongoing'){
            return callback(null, true)
        }else{
            return callback(null, false)
        }
    })
};

/**
 * It returns the status of the event.
 * @param eventId
 * @param callback
 */
eventSchema.statics.getStatus = function (eventId, callback) {
    // retrieve the event
    this.findOne({_id: eventId}, function (err, event) {
        if(err){
            return callback({message: "Error while retrieving event status."})
        }

        // check the status
        if(event){
            return callback(null, event.status)
        }else{
            return callback({message: "The event does not exist."})
        }
    })
};

var Event = mongoose.model('Event', eventSchema);

module.exports = Event;
