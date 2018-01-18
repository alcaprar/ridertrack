var Users = require('./users.json');
var Events = require('./events.json');

var helpers = {
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
