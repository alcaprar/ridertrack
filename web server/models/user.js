var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = Schema({
    name: {type: String, required: true, minlength: 1},
    surname: {type: String, required: true, minlength: 1},
    role: {type: String, required: true, enum:['participant', 'organizer']},
    created_at: {type: Date},
    updated_at: {type: Date}
});

// on every save, add the date
userSchema.pre('save', function(next) {
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

// attach passport plugin to handle registration and login
userSchema.plugin(passportLocalMongoose, {
    usernameField: 'email'
});

userSchema.statics.create = function (userJson, callback) {
    var user = new User(userJson);
    User.register(user, userJson.password, callback);
};

var User = mongoose.model('User', userSchema);

module.exports = User;