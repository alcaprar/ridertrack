var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var locationSchema = Schema({
    eventId: {
        type: String,
        required: true
    },
    userId : {
        type: String,
        required: true
    },
    timestamp : {
        type: Date,
        required: true
    },
    coordinates : {
        type : Coordinates,
        required : true
    }
});


var Location = mongoose.model('Location', locationSchema);
module.exports = Location;
