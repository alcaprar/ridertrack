var express = require('express'),
    bodyParser = require('body-parser'), //to retrieve post parameters
    favicon = require('serve-favicon'),
    User = require('./models/user'),
    Event = require('./models/event'),
    cors = require('cors');

var app = express();

app.use(cors());

// Creating http server and socket.io server
var server = require('http').Server(app);

// config file
var config = require('./config');

//mongodb connection
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(config.mongodb.uri, {useMongoClient: true}, function (err) {
    if (err){
        console.log('[MDB] Error while connecting to mongodb.', err)
    }else{
        console.log('[MDB] Successfully connected to MongoDB')
    }
});

// Public folders
app.use(express.static(__dirname + '/public'));

// configuring favicon
// TODO to remove the comment once we have an icon
// app.use(favicon(__dirname + '/public/img/favicon.ico'));

//Middleware that puts request bodies into req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// add the passport authentication strategies
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
passport.use('local', new LocalStrategy({usernameField: 'email', session: false}, function (email, password, callback) {
    // find the user
    User.findByEmail(email, function (err, user) {
        if(err){
            return callback(err)
        }

        // user not fund
        if(!user){
            return callback(null, false, 'User not found.')
        }
        // he/she trying to access using email/pass but the user is
        // associated to facebook profile
        if(user.hash === '' || typeof user.hash === 'undefined'){
            return callback(null, false, 'Trying to access a user associated' +
            ' with' +
            ' social account.')
        }

        // check the password
        return user.verifyPassword(password, function (err, res) {
            if(err){
                return callback(err)
            }

            if(res === false){
                return callback(null, false, 'Incorrect password.')
            }else{
                return callback(null, user)
            }
        })
    })
}));

// initialize facebook token strategy
// initialize google token strategy
var initFacebookTokenStrategy = require('./passport/facebookTokenStrategy');
var initGoogleTokenStrategy = require('./passport/googleTokenStrategy');
initGoogleTokenStrategy(passport);
initFacebookTokenStrategy(passport);

passport.initialize();

// Include the controllers folder, where there are all the routes handler
app.use(require('./routes'));

// Starting node server
server.listen(config.port, function () {
    console.log('Server listening on port: ' + config.port);
});

// exporting the server only for testing purposes
module.exports = server;