var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//mongoose.set('debug',true);

var routeSchema = Schema({
    eventId : {
        type : String,
        required:true
    },

    coordinates :[{
        lat:Number,
        lon:Number
    }]
});

/**
 * It finds route by specified eventId
 * @param eventId
 * @param callback
 */
routeSchema.statics.findByEventId = function (eventId,callback){
    Route.findOne({'eventId':eventId},function(err,route){
        if (err){
            return callback({
                message : "Error occurred during searching database"
            });
        }
        else{
            callback(null,route);
        }
    })
};
/**
 * It creates route for specified eventId
 * @param eventId
 * @param routes
 * @param callback
 */
routeSchema.statics.create = function (eventId,coordinates,callback){
    var route = new Route ({
        eventId:eventId,
        coordinates:coordinates
    });

    route.save(function(err,createdRoute){
        if (err){
            return callback({
                message:"Error occurred during saving route"
            });
        }
        else {
            callback (null,createdRoute.coordinates);
        }
    });
};
/**
 * It updates route for specifeid eventId
 * @param eventId
 * @param routes
 * @param callback
 */

Array.prototype.clear = function(callback){
    while(this.length > 0){
        this.pop();
    }
    callback();
};

routeSchema.statics.update = function (eventId,newCoordinates,callback) {
    this.findByEventId(eventId, function (err, route) {
        if (err) {
            return callback({
                message: err.message
            });
        }
        else {
            route.coordinates.clear(function(){
				route.save(route._id,function(){
               Route.findOneAndUpdate({_id:route._id},{"$push":{coordinates:{"$each":newCoordinates}}}
                                        ,{new:true},function(err,savedRoute){
                   if (err){
                       return callback({
                           message:err.message
                       });
                   }
                   else{
                       callback(null,savedRoute.coordinates);
                   }
					});
				});
            });
        }
    });
};

/**
 * It deletes route for specifeid eventId
 * @param eventId
 * @param callback
 */
routeSchema.statics.delete = function (eventId,callback){
    this.findByEventId(eventId,function(err,route){
        if (err){
            return callback({
                message:err.message
            });
        }
        else{
            route.remove({eventId:eventId},function(err,deletedRoute){
               if (err){
                   return callback({
                       message : "Error occured during deleting route"
                   });
               }
               else{
                   callback(null,deletedRoute.coordinates);
               }
            });
        }
    })
}


var Route = mongoose.model('Route',routeSchema);
module.exports = Route;

