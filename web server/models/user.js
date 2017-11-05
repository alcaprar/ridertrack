var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var passportLocalMongoose = require('passport-local-mongoose');

// list of fields that should not be passed to the frontend
const privateFields = ['__v', 'salt', 'hash', 'created_at', 'updated_at'];

// list of fields that an user can not change
const fieldsNotChangeable = ['_id', '__v', 'salt', 'hash', 'email', 'role', 'created_at', 'updated_at'];

var userSchema = Schema({
    name: {
        type: String, 
        required: true, 
        minlength: 1
    },
    surname: {
        type: String, 
        required: true, 
        minlength: 1
    },
    role: {
        type: String, 
        required: true, 
        enum:['participant', 'organizer']
    },
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

/**
 * It clears the user instance removing some private fields.
 * Useful to not send to the frontend some fields like hash, salt ecc..
 * @param callback
 */
userSchema.methods.removePrivateFields = function (callback) {
    let user = this;
    for(let i in privateFields){
        delete user[privateFields[i]];
    }
    if(typeof callback !== 'undefined'){
        callback();
    }
};

/**
 * It creates the user using the register function offered by passport.
 * It then calls a callback passing either an error list or the created user.
 * @param userJson
 * @param callback
 */
userSchema.statics.create = function (userJson, callback) {
    var user = new User(userJson);
    User.register(user, userJson.password, function (err, user) {
        if(err){
            return callback(err)
        }else{
            user.removePrivateFields();
            return callback(null, user)
        }
    });
};

/**
 * It updates the user.
 * It first sanitize the input, removing the fields that can not changed.
 * @param userId
 * @param userJson
 * @param callback
 */
userSchema.statics.update = function (userId, userJson, callback) {    
    // return and block the update if a not changeable field is passed
    for(let key in userJson){
        if(fieldsNotChangeable.indexOf(key) > -1){
            return callback('You can not modify ' + key)
        }
    }
    
    // find the right user and modify it
    this.findOne({_id: userId}, function (err, user) {
        if(err){
            return callback(err)
        }else{
            // override the previous value
            for(let key in userJson){
                user[key] = userJson[key]
            }
            
            user.save(function (err) {
                if(err){
                    return callback(err)
                }else{
                    return callback(null, user)
                }
            })
        }
    })
};

var User = mongoose.model('User', userSchema);

module.exports = User;