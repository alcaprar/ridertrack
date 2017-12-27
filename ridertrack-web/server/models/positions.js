var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ObjectId = mongoose.Schema.Types.ObjectId;

const fieldsNotChangeable = ['_id', 'userId','eventId','trackingSources','timeStamp' ,'__v', 'created_at', 'updated_at'];

var Route = require('./route');

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
    trackingSource: {
        type: String,
        required: false
    },
    lastPosition: {
        type:{
            lat: {type: Number},
            lng: {type: Number},
            timestamp: {type: Date}
        }
    },
    secondLastPosition: {
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
    Checkpoint: {
        type: Number
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
 * It adds a new position of the user.
 * It calculates the distance to the end.
 * @param userId
 * @param eventId
 * @param positionJson
 * @param callback
 */
positionSchema.statics.add = function (userId, eventId, positionJson, callback) {
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
            console.log('[PositionModel][update][calculateClosestCheckpoint] error while getting the route', err);
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
                userPositions.distanceToTheEnd = distance;

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

positionSchema.statics.getSecondLastPositionOfUser = function (userId, eventId, callback) {
    this.findOne({eventId: eventId, userId: userId}, function (err, userPositions) {
        if(err){
            console.log('[PositionsModel][getSecondLastPositionOfUserInEvent] error:', err);
            return callback({message: err.message})
        }

        if(!userPositions){
            return callback(null, null)
        }else{
            return callback(null, userPositions.secondLastPosition)
        }
    })
};


positionSchema.statics.getLastPositionOfAllParticipants = function (eventId, callback) {
    this.find({eventId: eventId}, {positions: 0})
        .populate('userId')
        .exec(function (err, usersPositions) {
            if(err){
                console.log('[PositionsModel][getLastPositionOfAllParticipantsInEvent] error:', err);
                return callback({message: err.message})
            }

            return callback(null, usersPositions)
        })
};

positionSchema.statics.delete = function (userId, eventId, callback) {
    this.findOneAndRemove({eventId: eventId, userId: userId}, function(err, usersPositions){
        if(err) {
            return callback({message: err.message})
        }else{
            return callback(null)
        }
    })
};

positionSchema.statics.create = function(userId, eventId, positionJson, callback){
    var location = new Location(locationJson);
    location.userId = userId;
    location.eventId = eventId;

    location.save(function(err, location){
        if(err) {
            console.log("Error Here!");
            return callback(err)
        } else {
            console.log("All good with adding location!");
			console.log(location);
            return callback(null, location)
        }
    })
};


positionSchema.statics.update = function (userId, eventId, locationJson, callback) {
    this.findOne({eventId: eventId, userId: userId}, function (err, location) {
        if (err) {
            return callback(err)
        } else {
            for (let key in locationJson) {
                if(fieldsNotChangeable.indexOf(key) === -1){
                    location[key].push(locationJson[key])
                }
            }
            location.save(function (err) {
                if (err) {
                    return callback(err)
                } else {
                    return callback(null, location)
                }
            })
        }
    })
};

var Positions = mongoose.model('Positions', positionSchema);

module.exports = Positions;
