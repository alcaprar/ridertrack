var express = require('express'),
    bodyParser = require('body-parser'), //to retrieve post parameters
    favicon = require('serve-favicon'),
    cors = require('cors');

var app = express();

app.use(cors());

// Creating http server
var server = require('http').Server(app);

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    //intercepts OPTIONS method
    if ('OPTIONS' === req.method) {
        //respond with 200
        res.send(200);
    }
    else {
        //move on
        next();
    }
});

// config file
var config = require('./server/config');

//mongodb connection
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(config.mongodb.uri, {
    keepAlive: 1,
    connectTimeoutMS: 300000,
    socketTimeoutMS: 300000,
    useMongoClient: true,
    promiseLibrary: global.Promise
}, function (err) {
    if (err){
        console.log('[MDB] Error while connecting to mongodb.', err);
        // TODO try to reconnect
    }else{
        console.log('[MDB] Successfully connected to MongoDB')
    }
});

// create public folder if does not exist
var fs = require('fs');
if (!fs.existsSync(config.publicFolder)){
    fs.mkdirSync(config.publicFolder);
}
if (!fs.existsSync(config.uploadImageFolder)){
    fs.mkdirSync(config.uploadImageFolder);
}

// Angular build folder
app.use(express.static(__dirname + '/dist'));

// public folder for images
app.use(express.static(__dirname + '/public'));

// public folder for swagger
app.use(express.static(__dirname + '/swagger'));

// configuring favicon
// TODO to remove the comment once we have an icon
// app.use(favicon(__dirname + '/public/img/favicon.ico'));

//Middleware that puts request bodies into req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// add the passport authentication strategies
var passport = require('passport');

// initialize local strategy
var initLocalStrategy = require('./server/passport/localStrategy');
initLocalStrategy(passport);

// initialize facebook token strategy
var initFacebookTokenStrategy = require('./server/passport/facebookTokenStrategy');
initFacebookTokenStrategy(passport);

// initialize google token strategy
var initGoogleTokenStrategy = require('./server/passport/googleTokenStrategy');
initGoogleTokenStrategy(passport);


passport.initialize();

// Include the controllers folder, where there are all the routes handler
app.use(require('./server/routes'));

// Starting node server
server.listen(config.port, function () {
    console.log('Server listening on port: ' + config.port);
});

// exporting the server only for testing purposes
module.exports = server;

// pinging timeout to keep alive the heroku apps
var http = require("http");
setInterval(function() {
    http.get({host: "rider-track-dev.herokuapp.com"}, function (res) {
        console.log('Ping rider-track-dev.herokuapp.com')
    });
    http.get({host: "rider-track.herokuapp.com"}, function (res) {
        console.log('Ping rider-track.herokuapp.com')
    });
}, 5 * 60 * 1000); // every 5 minutes (300000)
