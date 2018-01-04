var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ObjectId = mongoose.Schema.Types.ObjectId;

var Positions = require('./positions');

const fieldsNotChangeable = ['_id', 'userId','eventId','trackingSources','timeStamp' ,'__v', 'created_at', 'updated_at'];

var rankingSchema = Schema({
    eventId : {
        type: String,
        required: true
    },
    ranking: {
        type: [{
            type: ObjectId,
            ref: 'User'
        }],
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

// index of the collection. just one ranking per event
rankingSchema.index({eventId: 1}, {name: "ranking_eventId_idx", unique: true});

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

/**
 * It creates the ranking instance.
 * @param eventId
 * @param callback
 */
 
rankingSchema.statics.get = function(eventId,callback){
	this.findOne({eventId:eventId})
		.populate('ranking')
		.exec((err,userRanking) => {
			if (err){
				callback(err)
			}
			else{
				callback(null,userRanking)
			}
		});
};
rankingSchema.statics.create = function(eventId, callback) {
    var ranking = new Ranking({eventId: eventId});

    ranking.save(function (err, ranking) {
        if (err) {
            console.log("Error Here!");
            return callback(err)
        } else {
            return callback(null, ranking)
        }
    })
};

/**
 * It updates the ranking using the distance to the end of each participant.
 * @param eventId
 * @param callback
 */
rankingSchema.statics.update = function (eventId, callback) {
    // get positions ordered by distance to the lenght
    Positions.find({eventId: eventId}, {userId: 1}, {sort: {distanceToTheEnd: 'asc'}}, function (err, usersPositions) {
        if(err){
            console.log('[RankingModel][update] error while finding positions: ', err);
            return callback(err)
        }else{
            // update the ranking with the new order
            Ranking.findOne({eventId: eventId}, function (err, ranking) {
                if(err){
                    console.log('[RankingModel][update] error while finding ranking: ', err);
                    return callback(err)
                }else{
                    console.log('[RankingModel][update] found', ranking, usersPositions);
                    var tempRanking = [];
                    for(let i =0; i < usersPositions.length; i++){
                        tempRanking.push(usersPositions[i].userId)
                    }
                    ranking.ranking = tempRanking;
                    ranking.save(function (err) {
                        if(err){
                            console.log('[RankingModel][update] error while saving ranking: ', err);
                            return callback(err)
                        }else{
                            return callback(null)
                        }
                    })
                }
            })
        }
    });
};

var Ranking = mongoose.model('Ranking', rankingSchema);

module.exports = Ranking;
