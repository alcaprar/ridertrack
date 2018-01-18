var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// mongoose.set('debug',true);

var routeSchema = Schema({
    eventId:{
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['polylines', 'waypoints'],
        default: 'polylines'
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
    Route.findOne({eventId: eventId},function(err, route){
        if (err){
            console.log('[RouteModel][findByEventId] error: ', err);
            return callback({
                message: "Error occurred during searching database."
            });
        }else{
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
routeSchema.statics.update = function (eventId, routeType, newCoordinates, callback) {
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
        route.type = routeType;
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

/**
 * It calculates the distance to the end from the given checkpoint.
 * @param eventId
 * @param checkpointIndex
 */
routeSchema.methods.calculateDistanceToTheEnd = function (checkpointIndex, callback) {
    var route = this;
    var distance = 0;

    // iterate until the length-1 coordinate
    for(let i = checkpointIndex; i < route.coordinates.length -1; i++){
        /*var x_dif = Math.abs(route.coordinates[checkpointIndex].lat - route.coordinates[checkpointIndex + 1].lat);
        var y_dif = Math.abs(route.coordinates[checkpointIndex].lng - route.coordinates[checkpointIndex + 1].lng);
        var diff = Math.sqrt(x_dif * x_dif + y_dif * y_dif);*/

        var lat1 = route.coordinates[checkpointIndex].lat;
        var lat2 =  route.coordinates[checkpointIndex + 1].lat;
        var lng1 = route.coordinates[checkpointIndex].lng;
        var lng2 = route.coordinates[checkpointIndex + 1].lng;
        distance += distanceInKmBetweenEarthCoordinates(lat1, lng1, lat2, lng2)
    }

    if(typeof callback !== 'undefined'){
        callback(distance)
    }else{
        return callback
    }
};

function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
}

function distanceInKmBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
    var earthRadiusKm = 6371;

    var dLat = degreesToRadians(lat2-lat1);
    var dLon = degreesToRadians(lon2-lon1);

    lat1 = degreesToRadians(lat1);
    lat2 = degreesToRadians(lat2);

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return earthRadiusKm * c;
}


var Route = mongoose.model('Route', routeSchema);

module.exports = Route;

