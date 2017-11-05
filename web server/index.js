var express = require('express'),
    bodyParser = require('body-parser'), //to retrieve post parameters
    favicon = require('serve-favicon');

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

// Include the controllers folder, where there are all the routes handler
app.use(require('./routes'));

// Starting node server
server.listen(config.port, function () {
    console.log('Server listening on port: ' + config.port);
});

// exporting the server only for testing purposes
module.exports = server;