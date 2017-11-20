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

var Enrollment = mongoose.model('Enrollment', enrollmentSchema);
module.exports = Enrollment;