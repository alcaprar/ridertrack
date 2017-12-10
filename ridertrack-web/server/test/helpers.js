var UsersData = require('./mockdata/users.json');
var EventsData = require('./mockdata/events.json');

var UserModel = require('../models/user');

var helpers = {
    cleanDatabase: function () {

    },
    createUser : function () {
        var randomId = Math.floor((Math.random() * 99) + 1);
        return Users[randomId];
    },
    createEvent : function () {
        var randomId = Math.floor((Math.random() * 99) + 1);
        return Events[randomId]
    }
};

module.exports = helpers;
