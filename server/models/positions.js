var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ObjectId = mongoose.Schema.Types.ObjectId;

const fieldsNotChangeable = ['_id', 'userId','eventId','trackingSources','timeStamp' ,'__v', 'created_at', 'updated_at'];

var Route = require('./route');
var Enrollment = require('./enrollment');

var positionSchema = Schema({
    userId: {
        type: ObjectId,
        required: true,
        ref: 'User'
    },
    eventId : {
        type: String,
        required: true
    },
    lastPosition: {
        type:{
            lat: {type: Number},
            lng: {type: Number},
            timestamp: {type: Date}
        }
    },
    closestCheckpoint: {
        type: {
            lat: {type: Number},
            lng: {type: Number}
        }
    },
    // unit: km
    distanceToTheEnd: {
        type: Number,
        default: 1000000
    },
    positions: {
        type:[{
            lat:{type: Number},
            lng:{type: Number},
            timestamp: {type: Date}
        }],
        required: false,
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

// index of the collection
positionSchema.index({userId:1, eventId: 1}, {name: "position_idx", unique: true});

// on every save, add the date
positionSchema.pre('save', function(next) {
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
 * Create an empty positions object for the given user and event.
 * @param userId
 * @param eventId
 * @param callback
 */
positionSchema.statics.create = function (userId, eventId, callback) {
    var position = new Positions({
        userId: userId,
        eventId: eventId
    });

    position.save(function (err) {
        callback(err)
    })
};

/**
 * Delete the position object for the given user and event.
 * @param userId
 * @param eventId
 * @param callback
 */
positionSchema.statics.delete = function (userId, eventId, callback) {
    this.findOneAndRemove({eventId: eventId, userId: userId}, function(err, usersPositions){
        if(err) {
            return callback({message: err.message})
        }else{
            return callback(null)
        }
    })
};

/**
 * It initialize all the positions of users enrolled in an event in the starting point of the route.
 * @param eventId
 * @param callback
 */
positionSchema.statics.initializeAll = function (eventId, callback) {
    if(typeof callback === 'undefined'){
        callback = function () { }
    }
    // get the starting point of the route
    Route.findByEventId(eventId, function (err, route) {
        if(err){
            console.log('[PositionsModel][initializeAll] error while getting the route', err);
        }else{
            if(route.coordinates.length > 0){
                var startingPoint = route.coordinates[0];

                // get all the enrolled users
                Enrollment.findByEventId(eventId, function (err, enrollments) {
                    if(err){
                        console.log('[PositionsModel][initializeAll] error while getting the enrollments', err);
                    }else{
                        // for each enrollment add the starting position
                        for(let i = 0; i < enrollments.length ; i++){
                            let userId = enrollments[i].userId._id;
                            (function (userId, eventId) {
                                var positionToAdd = {
                                    lat: startingPoint.lat,
                                    lng: startingPoint.lng,
                                    timestamp: Date.now()
                                };

                                Positions.add(userId, eventId, positionToAdd)
                            })(userId, eventId)
                        }
                    }
                })
            }
        }
    })
};

/**
 * It adds a new position of the user.
 * It calculates the distance to the end.
 * @param userId
 * @param eventId
 * @param positionJson
 * @param callback
 */
positionSchema.statics.add = function (userId, eventId, positionJson, callback) {
    if(typeof callback === 'undefined'){
        callback = function () { }
    }
    this.findOne({eventId: eventId, userId: userId}, function (err, positions) {
        if(err){
            console.log('[PositionsModel][add] error:', err);
            return callback({message: err.message})
        }

        if(!positions){
            // create one
            positions = new Positions({
                userId: userId,
                eventId: eventId,
                positions: []
            })
        }

        // append the current position and updates the redundancies of the 2 last positions
        var positionToAdd = {
            lat: positionJson.lat,
            lng: positionJson.lng,
            timestamp: positionJson.timestamp
        };
        positions.secondLastPosition = positions.lastPosition;
        positions.lastPosition = positionToAdd;
        positions.positions.push(positionToAdd);

        // calculate the closest checkpoint and the distance to the end
        positions.calculateClosestCheckpoint(function () {
            // save the position received
            positions.save(function (err) {
                if(err){
                    console.log('[PositionModel][add] error', err);
                    callback({message: err.message})
                }

                callback(null, positions)
            });
        });

    })
};

/**
 * It finds the closest point of the route from the last position.
 */
positionSchema.methods.calculateClosestCheckpoint = function (callback) {
    var userPositions = this;

    // get the route
    Route.findByEventId(userPositions.eventId, function (err, route) {
        if(err || !route){
            console.log('[PositionModel][update][calculateClosestCheckpoint] error while getting the route', err, route);
            callback({message: "Error while retrieving the route."})
        }else{
            var lastPosition = userPositions.lastPosition;
            var routeCoordinates = route.coordinates;

            // find the distance from all the checkpoints
            var distanceFromCheckpoints = [];
            for(let i = 0; i < routeCoordinates.length; i++){
                var x_dif = Math.abs(routeCoordinates[i].lat - lastPosition.lat);
                var y_dif = Math.abs(routeCoordinates[i].lng - lastPosition.lng);
                var distance = Math.sqrt(x_dif * x_dif + y_dif * y_dif);
                distanceFromCheckpoints.push(distance)
            }

            // Out of all checkpoints, finds the closest one
            var closestCheckpointIndex = distanceFromCheckpoints.indexOf(Math.min.apply(Math, distanceFromCheckpoints));
            userPositions.closestCheckpoint = routeCoordinates[closestCheckpointIndex];

            // calculate the distance to the end
            route.calculateDistanceToTheEnd(closestCheckpointIndex, function (distance) {
                userPositions.distanceToTheEnd = distance + Math.min.apply(Math,distanceFromCheckpoints);

                return callback(null)
            });
        }
    })
};

/**
 * It returns the positions of the user for the given event.
 * @param userId
 * @param eventId
 * @param callback
 */
positionSchema.statics.getPositionsOfUser = function (userId, eventId, callback) {
    this.findOne({eventId: eventId, userId: userId}, function (err, userPositions) {
        if(err){
            console.log('[PositionsModel][getPositionsOfUser] error:', err);
            return callback({message: err.message})
        }

        if(!userPositions){
            return callback(null, null)
        }else{
            return callback(null, userPositions)
        }
    })
};

/**
 * It returns the last position of the requested user.
 * @param userId
 * @param eventId
 * @param callback
 */
positionSchema.statics.getLastPositionOfUser = function (userId, eventId, callback) {
    this.findOne({eventId: eventId, userId: userId}, function (err, userPositions) {
        if(err){
            console.log('[PositionsModel][getLastPositionOfUser] error:', err);
            return callback({message: err.message})
        }

        if(!userPositions){
            return callback(null, null)
        }else{
            return callback(null, userPositions.lastPosition)
        }
    })
};

/**
 * It returns the last positions of all the users enrolled in the given event.
 * The userId field of the position model is populated with the user info.
 * @param eventId
 * @param callback
 */
positionSchema.statics.getLastPositionOfAllParticipants = function (eventId, callback) {
    this.find({eventId: eventId})//,{positions: 0})
        .populate('userId')
        .exec(function (err, usersPositions) {
            if(err){
                console.log('[PositionsModel][getLastPositionOfAllParticipantsInEvent] error:', err);
                return callback({message: err.message})
            }
            return callback(null, usersPositions)
        })
};

var Positions = mongoose.model('Positions', positionSchema);

module.exports = Positions;
