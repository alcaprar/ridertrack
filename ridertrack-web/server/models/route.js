var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// mongoose.set('debug',true);

var routeSchema = Schema({
    eventId:{
        type: String,
        required: true
    },
    coordinates :[{
        lat: Number,
        lng: Number
    }]
});

// index of the collection. just one route per event
routeSchema.index({eventId: 1}, {name: "route_eventId_idx", unique: true});

/**
 * It finds route by specified eventId
 * @param eventId
 * @param callback
 */
routeSchema.statics.findByEventId = function (eventId, callback){
    Route.findOne({'eventId':eventId},function(err,route){
        if (err){
            console.log('[RouteModel][findByEventId] error: ', err);
            return callback({
                message: "Error occurred during searching database."
            });
        }
        else{
            callback(null, route);
        }
    })
};

/**
 * It creates route for specified eventId
 * @param eventId
 * @param coordinates
 * @param callback
 */
routeSchema.statics.create = function (eventId, coordinates, callback){
    var route = new Route ({
        eventId: eventId,
        coordinates: coordinates
    });

    route.save(function(err, createdRoute){
        if (err){
            console.log('[RouteModel][create] error: ', err);
            return callback({
                message: "Error occurred during saving route."
            });
        }
        else {
            callback(null, createdRoute.coordinates);
        }
    });
};

/**
 * It updates route for specified eventId.
 * Now it just totally overrides the coordinates array.
 * @param eventId
 * @param newCoordinates
 * @param callback
 */
routeSchema.statics.update = function (eventId, newCoordinates, callback) {
    this.findByEventId(eventId, function (err, route) {
        if(err){
            return callback({
                message: err.message
            });
        }

        if(!route){
            route = new Route({
                eventId: eventId
            })
        }

        // route has been found. updating the coordinates
        route.coordinates = newCoordinates;
        route.save(function (err) {
            if(err){
                console.log('[RouteModel][update] error:', err);
                return callback({
                    message: "Error while updating the route."
                })
            }else{
                return callback(null, route);
            }
        });
    });
};

/**
 * It deletes route for specified eventId
 * @param eventId
 * @param callback
 */
routeSchema.statics.delete = function (eventId,callback){
    this.findByEventId(eventId,function(err,route){
        if (err){
            console.log('[RouteModel][delete] error: ', err);
            return callback({
                message: err.message
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
};

var Route = mongoose.model('Route', routeSchema);

module.exports = Route;

