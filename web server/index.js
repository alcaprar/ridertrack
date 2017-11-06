var express = require('express'),
    bodyParser = require('body-parser'), //to retrieve post parameters
    favicon = require('serve-favicon'),
    User = require('./models/user');

var app = express();

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

// add the passport-jwt strategy for authentication
var passport = require('passport');

var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.passport.jwt.jwtSecret;
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    User.findOne({id: jwt_payload.sub}, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    });
}));

// Include the controllers folder, where there are all the routes handler
app.use(require('./routes'));

// Starting node server
server.listen(config.port, function () {
    console.log('Server listening on port: ' + config.port);
});

// exporting the server only for testing purposes
module.exports = server;