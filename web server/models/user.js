var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

// list of fields that should not be passed to the frontend
const privateFields = ['__v', 'salt', 'hash', 'created_at', 'updated_at'];

// list of fields that an user can not change
const fieldsNotChangeable = ['_id', '__v', 'salt', 'hash', 'email', 'role', 'created_at', 'updated_at'];

var userSchema = Schema({
    email: {
        type: String,
        required: true,
        minlength: 1
    },
    salt: {
        type: String,
        required: false
    },
    hash: {
        type: String,
        required: false // to solve facebook login
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
        enum:['participant', 'organizer']
    },
    facebookProfile: {
        type: {
            id: String,
            token: String
        },
        select: false // it exclude by default this field in queries
    },
    googleProfile:{
        data:{
            id:String,
            token:String
        },
        select:false
    },

    created_at: {type: Date, select: false},
    updated_at: {type: Date, select: false}
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

userSchema.methods.verifyPassword = function (password, callback) {
    var user = this;
    bcrypt.compare(password, user.hash, function (err, res) {
        if(err){
            return callback(err)
        }

        return callback(null, res)
    })
};

/**
 * It executes facebook passport callback function
 * @param accessToken
 * @param refreshToken
 * @param profile
 * @param cb
 */
userSchema.statics.setFbUser = function (accessToken,refreshToken,profile,cb){
    var user = new User();
    var email = profile.emails[0].name;

    return User.findByEmail(email,function(err,user){
        if (user){
            cb (err,user);
        }
        else{
            user.name = profile.first_name;
            user.surname = profile.last_name;
            user.email = profile.email;
            user.type.facebookProvider = {
                id:profile.id,
                token:accessToken
            };
            console.log(user);
            cb (err,user);
        }
        });

};

userSchema.statics.setGoogleUser = function (accessToken,refreshToken,profile,cb){
    var user = new User();
    var email = profile.emails[0].value;

    return User.findByEmail(email,function(err,userData){
        if (userData){
            return cb(null,userData);
        }
        else{
            user.name = profile.name.givenName;
            user.surname = profile.name.familyName;
            user.email = email;
            user.googleProfile.data = {
                id:profile.id,
                token:accessToken
            }
            return cb (null,user);
        }
    })

};

/**
 * It search for an user given the email.
 * @param email
 * @param callback
 */
userSchema.statics.findByEmail = function (email, callback) {
    User.findOne({email: email}, function (err, user) {
        if(err){
            return callback(err)
        }else{
            return callback(null, user)
        }
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
        // TODO add some data for social registration
        user.save(function (err) {
            if(err){
                return callback(err)
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
                    return callback(err)
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