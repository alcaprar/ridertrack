var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const fieldsNotChangeable = ['_id', 'userId','eventId','trackingSources','timeStamp' ,'__v', 'created_at', 'updated_at'];

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
        required: false
    },
    trackingSources: {
        type: String,
        required: false
    },
    // TODO change type of coordinates to what we get from mobile
    coordinates: {
        type:[String],
        required: false,
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
    })
};

/* TODO change type of coordinates to what we get from mobile
*/

locationSchema.statics.update = function (userId, eventId, locationJson, callback) {
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


var Location = mongoose.model('Location', locationSchema);
module.exports = Location;
