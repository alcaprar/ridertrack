var UsersData = require('./mockdata/users.json');
var EventsData = require('./mockdata/events.json');

var UserModel = require('../models/user');

var helpers = {
    cleanDatabase: function () {

    },
	//not sure about this because what will happen if we create 2 users and both returns same
    createUser : function () {
        var randomId = Math.floor((Math.random() * 99) + 1);
        return Users[randomId];
    },
    createEvent : function () {
        var randomId = Math.floor((Math.random() * 99) + 1);
        return Events[randomId]
    },
	
	createUserByNumber : function(number){
		return UsersData[number]
	},
	
	createEventByNumber : function(number){
		return EventsData[number]
	},
	
};

module.exports = helpers;
