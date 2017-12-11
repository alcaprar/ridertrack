var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ObjectId = mongoose.Schema.Types.ObjectId;

const fieldsNotChangeable = ['_id', 'userId','eventId','trackingSources','timeStamp' ,'__v', 'created_at', 'updated_at'];

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
        select: true
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

        // append the current position
        var positionToAdd = {
            lat: positionJson.lat,
            lng: positionJson.lng,
            timestamp: positionJson.timestamp
        };

        positions.lastPosition = positionToAdd;
        positions.positions.push(positionToAdd);

        positions.save(function (err) {
            if(err){
                console.log('[PositionModel][add] error', err);
                return callback({message: err.message})
            }

            return callback(null)
        })
    })
};

positionSchema.statics.getLastPositionOfUser = function (userId, eventId, callback) {
    this.findOne({eventId: eventId, userId: userId}, function (err, userPositions) {
        if(err){
            console.log('[PositionsModel][getLastPositionOfUserInEvent] error:', err);
            return callback({message: err.message})
        }

        if(!userPositions){
            return callback(null, null)
        }else{
            return callback(null, userPositions.lastPosition)
        }
    })
};

positionSchema.statics.getLastPositionOfAllParticipants = function (eventId, callback) {
    this.find({eventId: eventId}, {positions: 0})
        .populate('user')
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
