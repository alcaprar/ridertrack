var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var enrollmentSchema = Schema({
    eventId: {
        type: String,
        required: true
    },
    userId : {
        type: String,
        required: true
    },
    additionalInfo : {
        type: Object,
        required: false
    },
    trackingSources: {
        type: [Object],
        required: false
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

enrollmentSchema.index({eventId: 1, userId: 1}, {name: 'one_enrollment_per_event_idx', unique: true});

/**
 * Static method to create an enrollment.
 */
enrollmentSchema.statics.create = function(userId, enrollmentJson, callback){
    var enrollment = new Enrollment(enrollmentJson);
    enrollment.userId = userId;

    enrollment.save(function(err, enrollment){
        if(err) {
            console.log("Error Here!");
            return callback(err)
        } else {
            console.log("All good!");
            return callback(null, enrollment)
        }
    });
};

/**
 * Static method to find all enrollments by id .
 */
enrollmentSchema.statics.findAllByEventId = function (eventId, callback ){
    this.find({eventId: eventId}, function (err, enrollment) {
        if(err){
            return callback(err)
        }else{
            return callback(null, enrollment)
        }
    })
};

/**
 * Static method to delete an enrollment.
 */
enrollmentSchema.statics.delete = function (eventId, userId, callback){
    this.findOneAndRemove({eventId: eventId,userId: userId}, function(err, enrollment){
        if(err) {
            return callback(err)
        }else{
            return callback(null, enrollment)
        }
    })
};

var Enrollment = mongoose.model('Enrollment', enrollmentSchema);
module.exports = Enrollment;