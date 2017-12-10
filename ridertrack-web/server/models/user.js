var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var validator = require('validator');

// list of fields that should not be passed to the frontend
const privateFields = ['__v', 'salt', 'hash', 'created_at', 'updated_at', 'googleProfile', 'facebookProfile'];

// list of fields that an user can not change
const fieldsNotChangeable = ['_id', '__v', 'salt', 'hash', 'email', 'role', 'created_at', 'updated_at', 'googleProfile', 'facebookProfile'];

var userSchema = Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        validate: [validator.isEmail, 'Email is not correct.']
    },
    salt: {
        type: String,
        required: false
    },
    hash: {
        type: String,
        required: false
    },
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
        default: 'user',
        enum: ['user', 'administrator']
    },
    facebookProfile: {
        type: {
            id: String,
            token: String
        },
        select: false // it exclude by default this field in queries
    },
    googleProfile:{
        type: {
            id: String,
            token: String
        },
        select:false
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

userSchema.index({email: 1}, {name: 'email_idx', unique: true});

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
 * It generates the hash of the password.
 * It stores both the hash and the salt in the user instance.
 * @param password
 * @param callback
 */
userSchema.methods.generateHash = function (password, callback) {
    var user = this;
    return bcrypt.genSalt(10, function (err, salt) {
        if(err){
            return callback(err)
        }
        bcrypt.hash(password, salt, function (err, hash) {
            if(err){
                return callback(err)
            }

            user.salt = salt;
            user.hash = hash;

            return callback(null)
        })
    });
};

/**
 * It checks if the given password is valid.
 * It creates the hash of the given password and it compares it with the
 * stored hash.
 * @param password
 * @param callback
 */
userSchema.methods.verifyPassword = function (password, callback) {
    var user = this;
    bcrypt.compare(password, user.hash, function (err, res) {
        if(err){
            return callback({
                message:"Password doesn't match with user's password"
            });
        }
        return callback(null, res)
    })
};

/**
 * It search for an user given the id.
 * @param userId
 * @param callback
 */
userSchema.statics.findByUserId = function (userId, callback) {
    User.findById(userId, function (err, user) {
        if(err){
            return callback({
                message: "User doesn't exist"
            });
        }else{
            //return list of events
            return callback(null, user)
        }
    })
};

/**
 * It search for an user given the mail
 * @param email
 * @param callback
 */
userSchema.statics.findByEmail = function (email, callback) {
    User.findOne({email: email}, function (err, user) {
        if(err){
            return callback({
                message:"User's email doesn't exist in database"
            })
        }else{
            return callback(null, user)
        }
    })
};

/**
 * It search for user with the given googleId.
 * @param googleId
 * @param callback
 */
userSchema.statics.findByGoogleId = function (googleId, callback) {
    User.findOne({'googleProfile.id': googleId}, function (err, user) {
        if (err) {
            return callback({
                message:"User with specified googleId can't be found"
            })
        }

        return callback(null, user)
    })
};

/**
 * It search for user with the given facebookId.
 * @param facebookId
 * @param callback
 */
userSchema.statics.findByFacebookId = function (facebookId, callback) {
    User.findOne({'facebookProfile.id': facebookId}, function (err, user) {
        if (err) {
            return callback({
                message:"User with specified facebookId can't be found"
            })
        }

        return callback(null, user)
    })
};

/**
 * It creates the user using the register function offered by passport.
 * It then calls a callback passing either an error list or the created user.
 * @param userJson
 * @param callback
 */
userSchema.statics.create = function (userJson, callback) {
    var user = new User(userJson);

    if(typeof userJson.password === 'undefined'){
        // social registration
        user.save(function (err) {
            if(err){
                return callback({
                    message:"Error occurred during saving user from social service site." +
                    "Maybe user has already registred in database "
                })
            }
            user.removePrivateFields();
            return callback(null, user);
        })
    }else{
        user.generateHash(userJson.password, function (err) {
            if(err){
                return callback(err)
            }
            user.save(function (err) {
                if(err){
                    return callback({
                        message:"Error occurred during saving user account." +
                        " Maybe user already exists as social service user"
                    });
                }

                return user.removePrivateFields(function () {
                    callback(null, user)
                });
            })
        });
    }
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
            return callback({
                message:"Error occurred during finding an user.Maybe user doesn't exist"
                });
        }else{
            // override the previous value
            for(let key in userJson){
                user[key] = userJson[key]
            }

            user.save(function (err) {
                if(err){
                    return callback({
                        message:"Error occurred during updating user account."
                    })
                }else{
                    return callback(null, user)
                }
            })
        }
    })
};

/**
 * It delete the user given an id.
 * @param userId
 * @param callback
 */
userSchema.statics.delete = function (userId, callback) {
    User.findOneAndRemove({_id: userId}, function (err, user){
        if(err) {
            return callback({
                message:"Error occurred during delete of an user.Maybe user doesn't exist"})
        }else{
            return callback(null,user)
        }
    })
};

var User = mongoose.model('User', userSchema);

module.exports = User;
