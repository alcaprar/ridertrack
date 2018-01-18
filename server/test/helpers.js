var UsersData = require('./mockdata/users.json');
var EventsData = require('./mockdata/events.json');

var EnrollmentModel = require('../models/enrollment');
var EventModel = require('../models/event');
var PositionsModel = require('../models/positions');
var RankingModel = require('../models/ranking');
var RouteModel = require('../models/route');
var UserModel = require('../models/user');

var helpers = {
    /**
     * It cleans the database. It should be used before all the tests.
     * It calls the remove method on all the models.
     */
    cleanDatabase: function (mainCallback) {
        var async = require('async');
        async.parallel([
            function (callback) {
                EnrollmentModel.remove({}, function () {callback() })
            },
            function (callback) {
                EventModel.remove({}, function () {callback() })
            },
            function (callback) {
                PositionsModel.remove({}, function () {callback() })
            },
            function (callback) {
                RankingModel.remove({}, function () {callback() })
            },function (callback) {
                RouteModel.remove({}, function () {callback() })
            },function (callback) {
                UserModel.remove({}, function () {callback() })
            }
        ], function (callback) {
            if(typeof callback !== 'undefined'){
                mainCallback()
            }
        })

    },
	//not sure about this because what will happen if we create 2 users and both returns same
    createUser : function () {
        var randomId = Math.floor((Math.random() * 99) + 1);
        return UsersData[randomId];
    },
    createEvent : function () {
        var randomId = Math.floor((Math.random() * 99) + 1);
        return EventsData[randomId]
    },

	createUserByNumber : function(number){
		return UsersData[number]
	},

	createEventByNumber : function(number){
		return EventsData[number]
	},

};

module.exports = helpers;
