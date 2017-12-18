var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Route = require('./route');
var Positions = require('./positions');

const fieldsNotChangeable = ['_id', 'userId','eventId','trackingSources','timeStamp' ,'__v', 'created_at', 'updated_at'];

var rankingSchema = Schema({
    eventId : {
        type: String,
        required: true
    },
    ranking: {
        type: [{},[]],
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

rankingSchema.statics.create = function(eventId, callback) {
    var ranking = new Ranking({eventId: eventId});

    ranking.save(function (err, ranking) {
        if (err) {
            console.log("Error Here!");
            return callback(err)
        } else {
            console.log("All good with adding ranking!");
            console.log(ranking);
            return callback(null, ranking)
        }
    })
};

rankingSchema.statics.update = function (userId, eventId, locationJson ,callback) {
    this.findOne({eventId: eventId}, function (err, ranking) {
        if (err) {
            console.log("Creating Ranking.... ");
            return callback({message: err.message})
        }

        if (ranking == null) {
            Ranking.create(eventId, function (err, ranking) {
                if (err) {
                    console.log('ERROR: Could Not Create Ranking.', err);
                    res.status(400).send({
                        errors: [err]
                    })
                } else {
                    console.log("Created Ranking...")
                    //res.status(200).send({
                    //ranking: ranking
                    //})
                    console.log("Re-Ranking...")
                }
            });
        }

        ranking.rerank(eventId, userId, function (err, new_ranking) {
            if (err) {
                console.log("Error Reranking")
            } else {
                console.log("Reranked")
                console.log(new_ranking)
            }
        });

    })
};

rankingSchema.methods.rerank = function(eventId , userId, callback){
    var ranking = this;
    Route.findByEventId(eventId, function(err, route){
        if (err){
            console.log("Error Reranking: Finding Route");
            return callback(err)
        }
        else {
            var position = {};

            // Gets last position of participant
            var coordinates = route.coordinates;
            Positions.getLastPositionOfUser(userId, eventId, function (err, lastPos) {
                if (err) {
                    console.log("Error Re-ranking: Getting last position")
                }
                else {
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
                checkpointDict[checkpointNumber].push([shortestDistance, userId])
            }
            else {
                checkpointDict[checkpointNumber] = [];
                checkpointDict[checkpointNumber].push([shortestDistance, userId])
            }


            // reordering the list of ranked participants, only top 10 displayed
            var rankingList = ranking.ranking[1];

            /* Block of code to sort each group of runners (a group is between each checkpoint),
             * then pick the 10 closests to the last checkpoint, which are the first ones.
             */
            var NeedsSorting = true;
            for (var i = 0; i < coordinates.length; i++) {
                if (checkpointDict.hasOwnProperty(i + 1)) {
                    continue;
                } else {
                    for (var group = i ;rankingList.length <= 10, NeedsSorting = true; group--) {
                        while (NeedsSorting === true) {
                            var currentCheckpointGroup = checkpointDict[group];

                            //for (var it = 0; it < currentCheckpointGroup.length; it++) {}


                            var len = currentCheckpointGroup.length;

                            for (var i = len-1; i>=0; i--){
                                for(var j = 1; j<=i; j++){
                                    if(currentCheckpointGroup[j-1][0]>currentCheckpointGroup[j][0]){
                                        var temp = currentCheckpointGroup[j-1][0];
                                        currentCheckpointGroup[j-1][0] = currentCheckpointGroup[j][0];
                                        currentCheckpointGroup[j][0] = temp;
                                    }
                                }
                            }

                            //this.methods.sort(currentCheckpointGroup, function(err, sorted_arr){
                                //if(err){console.log("Ranking Error: Sorting Error ")
                                //}else{rankingList.push(sorted_arr[sorted_arr.length]) }
                            //});

                            if (rankingList.length >= 10 || currentCheckpointGroup.length < 10) {
                                NeedsSorting = false
                            }
                        }
                    }
                }
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


var Ranking = mongoose.model('Ranking', rankingSchema);
module.exports = Ranking;


