var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ObjectId = mongoose.Schema.Types.ObjectId;

var Positions = require('./positions');

var enrollmentSchema = Schema({
    eventId: {
        type: String,
        required: true
    },
    userId: {
        type: ObjectId,
        required: true,
        ref: 'User'
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

// on every save, add the date
enrollmentSchema.pre('save', function(next) {
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
 * Static method to create an enrollment.
 */
enrollmentSchema.statics.create = function(userId, enrollmentJson, callback){
    var enrollment = new Enrollment(enrollmentJson);
    enrollment.userId = userId;

    enrollment.save(function(err, enrollment){
        if(err) {
            console.log('[EnrollmentModel][create] error', err);
            return callback(err)
        } else {

            // create an empty positions object for this enrollment
            var userPositions = new Positions({
                userId: userId,
                eventId: enrollment.eventId
            });

            userPositions.save(function (err) {
                if(err){
                    console.log('[EnrollmentModel][create] error while creating default positions.', err)
                }
            });

            return callback(null, enrollment);


        }
    });
};

/**
 * Static method to find all enrollments by id .
 */
enrollmentSchema.statics.findByEventId = function (eventId, callback ){
    this.find({eventId: eventId})
        .populate('userId')
        .exec(function (err, enrollment) {
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
    this.findOneAndRemove({eventId: eventId, userId: userId}, function(err, enrollment){
        if(err) {
            return callback(err)
        }else{
            // remove the position object
            Positions.delete(userId, eventId, function (err) {
                // do something??
            });
            return callback(null, enrollment)
        }
    })
};

var Enrollment = mongoose.model('Enrollment', enrollmentSchema);
module.exports = Enrollment;
