var User = require('./models/user');
var Event = require('./models/event');

module.exports = function () {
    var user1 = new User({
        "name": 'Name1',
        "surname": "Surname1",
        "email": "user1@ridertrack.com",
        "password": 'qwerty'
    });

    var user2 = new User({
        "name": 'Name2',
        "surname": "Surname2",
        "email": "user2@ridertrack.com",
        "password": 'qwerty'
    });

    var event1 = {
        "name": "New york marathon",
        "description": "The New York City Marathon has grown from a Central Park race with 55 finishers to the world's biggest and most popular marathon, with more than 51,000 finishers in 2016.",
        "city": "New York",
        "country": "USA",
        "type": "Marathon",
        "organizerId": "",
        "startingTime": "2017-09-23T12:00:00.000Z",
        "maxDuration": 150,
        "length": 42.195,
        "enrollmentOpeningAt": "2017-09-10T00:00:00.000Z",
        "enrollmentClosingAt": "2017-09-17T00:00:00.000Z",
        "participantsList": [255],
        "routes": ["Route1"]
    };

    var event2 = {
        "name": "London marathon",
        "description": "The New York City Marathon has grown from a Central Park race with 55 finishers to the world's biggest and most popular marathon, with more than 51,000 finishers in 2016.",
        "city": "London",
        "country": "UK",
        "type": "Marathon",
        "organizerId": "",
        "startingTime": "2017-09-23T12:00:00.000Z",
        "maxDuration":150,
        "length": 110,
        "enrollmentOpeningAt": "2017-09-10T00:00:00.000Z",
        "enrollmentClosingAt": "2017-09-17T00:00:00.000Z",
        "participantsList": [255],
        "routes": ["Route1"]
    };
    
    user1.save(function () {
        user2.save(function () {
            event1.organizerId = user1._id;
            event1 = new Event(event1);
            event2.organizerId = user1._id;
            event2 = new Event(event2);
            
            event1.save(function () {
                event2.save(function () {
                    
                })
            })
        })
    })
};