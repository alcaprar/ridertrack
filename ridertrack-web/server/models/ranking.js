var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const fieldsNotChangeable = ['_id', 'userId','eventId','trackingSources','timeStamp' ,'__v', 'created_at', 'updated_at'];

var rankingSchema = Schema({
    eventId : {
        type: String,
        required: true
    },
    ranking: {
        type:[],
        required: false
    },
    timeStamp : {
        type: Date,
        required: false
    },
    trackingSources: {
        type: String,
        required: false
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

// on every save, add the date
rankingSchema.pre('save', function(next) {
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

rankingSchema.statics.create = function(eventId , callback){
    var ranking = new Ranking({eventId : eventId, ranking: []});
    ranking.eventId = eventId;

    ranking.save(function(err, ranking){
        if(err) {
            console.log("Error Here!");
            return callback(err)
        } else {
            console.log("All good with adding ranking!");
            return callback(null, ranking)
        }
    })
};


rankingSchema.statics.update = function (userId, eventId, locationJson, callback) {
    this.findOne({eventId: eventId, userId: userId}, function (err, ranking) {
        if (err) {
            return callback(err)
        } else{

            var rank = 0 ;
            // ranking logic or function here

            // update here..
            ranking.ranking[userId] = rank;

            rankng.save(function (err) {
                if (err) {
                    return callback(err)
                } else {
                    return callback(null, ranking)
                }
            })
        }
    })
};


var Ranking = mongoose.model('Ranking', rankingSchema);
module.exports = Ranking;
