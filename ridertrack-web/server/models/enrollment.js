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
    device: {
        type: {
            deviceType: String,
            deviceId: String
        }
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
 * Function called on every save.
 * It adds timing info about creation and update.
 */
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
 * Error handler. It is executed on every save if errors occur.
 * Inspired here. http://thecodebarbarian.com/mongoose-error-handling
 */
enrollmentSchema.post('save', function (err, doc, next) {
    console.log('[EnrollmentModel][error]', err);
    if(err.name === 'MongoError' && err.code === 11000){
        next({message: 'An enrollment for this event and user already exists.'})
    }else{
        next({message: err.msg})
    }
});

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
 * Static method to create an enrollment.
 */
enrollmentSchema.statics.create = function(userId, enrollmentJson, callback){
    var enrollment = new Enrollment({
        userId: userId,
        eventId: enrollmentJson.eventId
    });
    if(enrollmentJson.device){
        enrollment.device = enrollmentJson.device
    }

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
 * It updates the enrollment for the given user and event.
 * @param userId
 * @param eventId
 * @param enrollmentJson
 * @param callback
 */
enrollmentSchema.statics.update = function (userId, eventId, enrollmentJson, callback) {
    this.findOne({userId: userId, eventId: eventId}, function (err, enrollment) {
        if (err) {
            return callback(err)
        } else {
            // override the previous value
            console.log('Enrollment to update', enrollmentJson);
            for (let key in enrollmentJson) {
                // if a key in the json passed is null, remove the previous value
                if([null, 'null', undefined, 'undefined'].indexOf(enrollmentJson[key]) > -1 ){
                    if(typeof enrollment[key] !== 'undefined'){
                        enrollment[key] = undefined;
                    }
                }else{
                    enrollment[key] = enrollmentJson[key]
                }
            }

            enrollment.save(function (err, updatedEnrollment) {
                if (err) {
                    return callback(err)
                } else {
                    return callback(null, updatedEnrollment)
                }
            })
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
