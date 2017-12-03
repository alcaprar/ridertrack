var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var locationSchema = Schema({
    userId: {
        type: String,
        required: true
    },
    eventId : {
        type: String,
        required: true
    },
    timeStamp : {
        type: Date,
        required: true
    },
    trackingSources: {
        type: String,
        required: false
    },
    coordinates: {
        type: String,
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
locationSchema.pre('save', function(next) {
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

locationSchema.statics.create = function(userId, eventId, locationJson, callback){
    var location = new Location(locationJson);
    location.userId = userId;
    location.eventId = eventId;

    location.save(function(err, location){
        if(err) {
            console.log("Error Here!");
            return callback(err)
        } else {
            console.log("All good with adding location!");
            return callback(null, location)
        }
    });
};

locationSchema.statics.update = function (userId, eventId, newLocation, callback) {
    this.findOne({eventId: eventId, userId: userId}, function (err, location) {
        if (err) {
            return callback(err)
        } else {
            location.coordinates.push(newLocation);
            location.save(function (err) {
                if (err) {
                    return callback(err)
                } else {
                    return callback(null, location)
                }
            })
            /*
            Location.update(
                { eventId: eventId, userId: userId },
                { $push: { coordinates: newLocation } },
                done
                );
            */
        }
    })
};


var Location = mongoose.model('Location', locationSchema);
module.exports = Location;
