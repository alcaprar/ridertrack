var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ObjectId = mongoose.Schema.Types.ObjectId;

var Route = require('./route');
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

rankingSchema.methods.add = function(eventId , userId, callback){
    var ranking = this;
    Route.findByEventId(eventId, function(err, route){
        if (err){
            console.log("Error Reranking: Finding Route");
            return callback(err)
        }else{
            var position = {};

            // Gets last position of participant
            var coordinates = route.coordinates;

            Positions.getLastPositionOfUser(userId, eventId, function (err, lastPos) {
                if (err) {
                    console.log("Error Re-ranking: Getting last position")
                }else{
                    position = lastPos;
                }
            });

            /* Uses pythagoras to calculate distance
             * Did not use let - in method of iterating because order is not guaranteed
             * disFromRoute is the each distance to each point on the route
             */
            var disFromRoute = [];
            for (var i = 0; i < coordinates.length; i++) {
                var x_dif = abs(coordinates[i].lat - position.lat);
                var y_dif = abs(coordinates[i].lng - position.lng);
                var distance = Math.sqrt(x_dif * x_dif + y_dif * y_dif);
                disFromRoute.push(distance)
            }

            // Out of all checkpoints, finds the closest one
            var shortestDistance = Math.min.apply(Math, disFromRoute);
            // this is the checkpoint the participant is either nearing or leaving
            var checkpointNumber = disFromRoute.indexOf(shortestDistance);

            // TODO: Update checkpoint of the user
            // TODO : Use Second Last Position to determine nearing or leaving.

            /* CheckpointDict is a dictionary with the checkpoint as the key i.e '1' and a list of shortestDictance tuples
             * Information should be added to this dictionary values as a const tuple like this [4.7 ,'Mariano']
             */
            var checkpointDict = ranking.ranking[0];

            // Checking if key-value pair exists update the tuple, else creates it and add.
            if (checkpointDict.hasOwnProperty(checkpointNumber)) {

                //for(var it in checkpointDict[checkpointNumber]) {
                    //if (it[1] === userId ){
                        //checkpointDict[checkpointNumber].push([shortestDistance, userId])

                    //}
                //}

                checkpointDict[checkpointNumber].forEach(function (rank, i) {
                    if (rank[1] === userId){
                        checkpointDict[checkpointNumber][i][0] = shortestDistance
                    }
                });

            }
            else {
                checkpointDict[checkpointNumber] = [];
                checkpointDict[checkpointNumber].push([shortestDistance, userId])
            }
        }

        // save the ranking
        ranking.save(function (err) {
            if (err) {
                return callback(err)
            } else {
                return callback(null, ranking)
            }
        });
    })
};


//  Method to return sorted array. Accesses the first index of each iteration, i.e 4.6 in [4.6 , 'Bob The Runner']
rankingSchema.methods.sort = function(list){
    var len = list.length;

    for (var i = len-1; i>=0; i--){
        for(var j = 1; j<=i; j++){
            if(list[j-1][0]>list[j][0]){
                var temp = list[j-1][0];
                list[j-1][0] = list[j][0];
                list[j][0] = temp;
            }
        }
    }
    return list;

};


rankingSchema.methods.rerank = function(eventId , userId, callback){

    var ranking = this;
    var max_ranked = 10 ; // number of participants in the ranking

    // reordering the list of ranked participants, only top 10 displayed
    var checkpointDict = ranking.ranking[0];

    /* Block of code to sort each group of runners (a group is between each checkpoint),
     * then pick the 10 closests to the last checkpoint, which are the first ones.
     */

    var rankingList = [];
    for (var i = 0; i < coordinates.length; i++) {
        if (checkpointDict.hasOwnProperty(i + 1)) {
            continue;
        } else {
            for (var group = i; rankingList.length <= max_ranked;  group--) {

                var currentCheckpointGroup = checkpointDict[group];
                var len = currentCheckpointGroup.length;

                // Sorts the dict values (lists) in ascending order.
                for (var it = len - 1; it >= 0; it--) {
                    for (var j = 1; j <= i; j++) {
                        if (currentCheckpointGroup[j - 1][0] > currentCheckpointGroup[j][0]) {
                            var temp = currentCheckpointGroup[j - 1][0];
                            currentCheckpointGroup[j - 1][0] = currentCheckpointGroup[j][0];
                            currentCheckpointGroup[j][0] = temp;
                        }
                    }
                }
                it = 0;
                while (rankingList.length < len && rankingList < max_ranked) {
                    rankingList.push(currentCheckpointGroup[it]);
                    it++;
                }
            }
            // changing the value (call by address is not available in js)
            ranking.ranking[1] = rankingList;
            // save the ranking
            ranking.save(function (err) {
                if (err) {
                    return callback(err)
                } else {
                    return callback(null, ranking)
                }
            });
        }
    }
};

var Ranking = mongoose.model('Ranking', rankingSchema);
module.exports = Ranking;
