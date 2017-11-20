//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
var chai = require('chai');
var server = require('../../index');
var uuid = require('uuid');
var supertest = require('supertest');
var mongoose = require('mongoose')

global.server = server;
global.uuid = uuid;
global.expect = chai.expect;
global.assert = chai.assert;
global.request = supertest(server);

var Event = require('../../models/event');
var User = require('../../models/user');

describe('Event API tests', function () {

    before(function (done) {
        done()
    });

    /**
     * It clears the database.
     */
    beforeEach(function (done) {
        Event.remove({},function(){
            User.remove({},function(){
                done()
            });
        });
    });

    //Testing the endpoint to the events
    describe('GET /events', function () {
        it('it should return an empty list since the database is empty', function (done) {
            request.get('/api/events')
                .end(function (err, res) {
                    expect(res.status).to.be.eql(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body.events).to.be.an('array');
                    expect(res.body.events.length).to.be.eql(0);
                    done();
                })
        });
        
        it('General search: it should add an event and return an array with one element', function (done) {
            var event = new Event({
                "name":"TestEvent",
                "organizerId": mongoose.Types.ObjectId(),
                "type":"running",
                "description":"Blablabla",
                "country":"MyCountry",
                "city":"MyCity",
                "startingTime":"2017-09-23T12:00:00.000Z",
                "maxDuration":150,
                "length": 40,
                "enrollmentOpeningAt":"2017-09-10T00:00:00.000Z",
                "enrollmentClosingAt":"2017-09-17T00:00:00.000Z",
                "participantsList":[255],
                "routes":["Route1"]
            });
            event.save(function () {
                request.get('/api/events')
                    .end(function (err, res) {
                        expect(res.status).to.be.eql(200);
                        expect(res.body).to.be.an('object');
                        expect(res.body.events).to.be.an('array');
                        expect(res.body.events.length).to.be.eql(1);
                        expect(res.body.totalPages).to.be.eql(1);
                        done();
                    })
            })
        });

        it('it should return the event', function (done) {
            var event = new Event({
                "name":"TestEvent",
                "organizerId": mongoose.Types.ObjectId(),
                "type":"running",
                "description":"Blablabla",
                "country":"MyCountry",
                "city":"MyCity",
                "startingTime":"2017-09-23T12:00:00.000Z",
                "maxDuration":150,
                "length": 40,
                "enrollmentOpeningAt":"2017-09-10T00:00:00.000Z",
                "enrollmentClosingAt":"2017-09-17T00:00:00.000Z",
                "participantsList":[255],
                "routes":["Route1"]
            });
            event.save(function () {
                request.get('/api/events/' + event._id)
                    .end(function (err1, res) {
                        expect(res.status).to.be.eql(200);
                        expect(res.body).to.be.an('object');
                        expect(res.body.event).to.be.an('object');
                        done();
                    })
            });
        });
        
        it('it should return the organizer of the event', function (done) {
            var user = new User({
                "name": "User",
                "surname": "Surname",
                "email": "email@domain.it",
                "password": "AVeryStrongPasword"
            });
            user.save(function () {
                var event = new Event({
                    "name":"TestEvent",
                    "organizerId": user._id,
                    "type":"running",
                    "description":"Blablabla",
                    "country":"MyCountry",
                    "city":"MyCity",
                    "startingTime":"2017-09-23T12:00:00.000Z",
                    "maxDuration":150,
                    "length": 40,
                    "enrollmentOpeningAt":"2017-09-10T00:00:00.000Z",
                    "enrollmentClosingAt":"2017-09-17T00:00:00.000Z",
                    "participantsList":[255],
                    "routes":["Route1"]
                });
                event.save(function () {
                    request.get('/api/events/' + event._id + '/organizer')
                        .end(function (err, res) {
                            expect(res.status).to.be.eql(200);
                            expect(res.body).to.be.an('object');
                            expect(res.body.organizer).to.be.an('object');
                            expect(res.body.organizer._id).to.be.eql(user._id.toString());
                            expect(res.body.organizer.email).to.be.eql(user.email);
                            expect(res.body.organizer.salt).to.be.eql(undefined);
                            expect(res.body.organizer.hash).to.be.eql(undefined);
                            expect(res.body.organizer.googleProfile).to.be.eql(undefined);
                            expect(res.body.organizer.facebookProfile).to.be.eql(undefined);

                            done();
                        })
                })
            });
        });

        it('Search using filtering by length range', function (done) {
            var event = new Event({
                "name":"TestEvent",
                "organizerId": mongoose.Types.ObjectId(),
                "type":"running",
                "description":"Blablabla",
                "country":"MyCountry",
                "city":"MyCity",
                "startingTime":"2017-09-23T12:00:00.000Z",
                "maxDuration":150,
                "length": 40,
                "enrollmentOpeningAt":"2017-09-10T00:00:00.000Z",
                "enrollmentClosingAt":"2017-09-17T00:00:00.000Z",
                "participantsList":[255],
                "routes":["Route1"]
            });
            var event2 = new Event({
                "name":"TestEvent2",
                "organizerId": mongoose.Types.ObjectId(),
                "type":"running",
                "description":"Blablabla",
                "country":"MyCountry",
                "city":"MyCity",
                "startingTime":"2017-09-23T12:00:00.000Z",
                "maxDuration":150,
                "length": 50,
                "enrollmentOpeningAt":"2017-09-10T00:00:00.000Z",
                "enrollmentClosingAt":"2017-09-17T00:00:00.000Z",
                "participantsList":[255],
                "routes":["Route1"]
            });
            event.save(function () {
                event2.save(function () {
                    request.get('/api/events?sort=length&length=gt:10&length=lt:40')
                        .end(function (err1, res) {
                            expect(res.status).to.be.eql(200);
                            expect(res.body).to.be.an('object');
                            expect(res.body.events).to.be.an('array');
                            expect(res.body.events.length).to.be.eql(2);
                            expect(res.body.events[0]._id).to.be.eql(event._id.toString());
                            done();
                        })
                });
            });
        });

        it('Search using sorting by length without specifying asc or desc', function (done) {
            var event = new Event({
                "name":"TestEvent",
                "organizerId": mongoose.Types.ObjectId(),
                "type":"running",
                "description":"Blablabla",
                "country":"MyCountry",
                "city":"MyCity",
                "startingTime":"2017-09-23T12:00:00.000Z",
                "maxDuration":150,
                "length": 40,
                "enrollmentOpeningAt":"2017-09-10T00:00:00.000Z",
                "enrollmentClosingAt":"2017-09-17T00:00:00.000Z",
                "participantsList":[255],
                "routes":["Route1"]
            });
            var event2 = new Event({
                "name":"TestEvent2",
                "organizerId": mongoose.Types.ObjectId(),
                "type":"running",
                "description":"Blablabla",
                "country":"MyCountry",
                "city":"MyCity",
                "startingTime":"2017-09-23T12:00:00.000Z",
                "maxDuration":150,
                "length": 50,
                "enrollmentOpeningAt":"2017-09-10T00:00:00.000Z",
                "enrollmentClosingAt":"2017-09-17T00:00:00.000Z",
                "participantsList":[255],
                "routes":["Route1"]
            });
            event.save(function () {
                event2.save(function () {
                    request.get('/api/events?sort=length')
                        .end(function (err1, res) {
                            expect(res.status).to.be.eql(200);
                            expect(res.body).to.be.an('object');
                            expect(res.body.events).to.be.an('array');
                            expect(res.body.events.length).to.be.eql(2);
                            expect(res.body.events[0]._id).to.be.eql(event._id.toString());
                            done();
                        })
                });
            });
        });

        it('Search using sorting by length asc', function (done) {
            var event = new Event({
                "name":"TestEvent",
                "organizerId": mongoose.Types.ObjectId(),
                "type":"running",
                "description":"Blablabla",
                "country":"MyCountry",
                "city":"MyCity",
                "startingTime":"2017-09-23T12:00:00.000Z",
                "maxDuration":150,
                "length": 40,
                "enrollmentOpeningAt":"2017-09-10T00:00:00.000Z",
                "enrollmentClosingAt":"2017-09-17T00:00:00.000Z",
                "participantsList":[255],
                "routes":["Route1"]
            });
            var event2 = new Event({
                "name":"TestEvent2",
                "organizerId": mongoose.Types.ObjectId(),
                "type":"running",
                "description":"Blablabla",
                "country":"MyCountry",
                "city":"MyCity",
                "startingTime":"2017-09-23T12:00:00.000Z",
                "maxDuration":150,
                "length": 50,
                "enrollmentOpeningAt":"2017-09-10T00:00:00.000Z",
                "enrollmentClosingAt":"2017-09-17T00:00:00.000Z",
                "participantsList":[255],
                "routes":["Route1"]
            });
            event.save(function () {
                event2.save(function () {
                    request.get('/api/events?sort=length:asc')
                        .end(function (err1, res) {
                            expect(res.status).to.be.eql(200);
                            expect(res.body).to.be.an('object');
                            expect(res.body.events).to.be.an('array');
                            expect(res.body.events.length).to.be.eql(2);
                            expect(res.body.events[0]._id).to.be.eql(event._id.toString());
                            done();
                        })
                });
            });
        });

        it('Search using sorting by length desc', function (done) {
            var event = new Event({
                "name":"TestEvent",
                "organizerId": mongoose.Types.ObjectId(),
                "type":"running",
                "description":"Blablabla",
                "country":"MyCountry",
                "city":"MyCity",
                "startingTime":"2017-09-23T12:00:00.000Z",
                "maxDuration":150,
                "length": 40,
                "enrollmentOpeningAt":"2017-09-10T00:00:00.000Z",
                "enrollmentClosingAt":"2017-09-17T00:00:00.000Z",
                "participantsList":[255],
                "routes":["Route1"]
            });
            var event2 = new Event({
                "name":"TestEvent2",
                "organizerId": mongoose.Types.ObjectId(),
                "type":"running",
                "description":"Blablabla",
                "country":"MyCountry",
                "city":"MyCity",
                "startingTime":"2017-09-23T12:00:00.000Z",
                "maxDuration":150,
                "length": 50,
                "enrollmentOpeningAt":"2017-09-10T00:00:00.000Z",
                "enrollmentClosingAt":"2017-09-17T00:00:00.000Z",
                "participantsList":[255],
                "routes":["Route1"]
            });
            event.save(function () {
                event2.save(function () {
                    request.get('/api/events?sort=length:desc')
                        .end(function (err1, res) {
                            expect(res.status).to.be.eql(200);
                            expect(res.body).to.be.an('object');
                            expect(res.body.events).to.be.an('array');
                            expect(res.body.events.length).to.be.eql(2);
                            expect(res.body.events[1]._id).to.be.eql(event._id.toString());
                            done();
                        })
                });
            });
        });

        it('Search using sorting by price without specifying asc or desc', function (done) {
            var event = new Event({
                "name":"TestEvent",
                "organizerId": mongoose.Types.ObjectId(),
                "type":"running",
                "description":"Blablabla",
                "country":"MyCountry",
                "city":"MyCity",
                "startingTime":"2017-09-23T12:00:00.000Z",
                "maxDuration":150,
                "length": 40,
                "price": 100,
                "enrollmentOpeningAt":"2017-09-10T00:00:00.000Z",
                "enrollmentClosingAt":"2017-09-17T00:00:00.000Z",
                "participantsList":[255],
                "routes":["Route1"]
            });
            var event2 = new Event({
                "name":"TestEvent2",
                "organizerId": mongoose.Types.ObjectId(),
                "type":"running",
                "description":"Blablabla",
                "country":"MyCountry",
                "city":"MyCity",
                "startingTime":"2017-09-23T12:00:00.000Z",
                "maxDuration":150,
                "length": 50,
                "price": 120,
                "enrollmentOpeningAt":"2017-09-10T00:00:00.000Z",
                "enrollmentClosingAt":"2017-09-17T00:00:00.000Z",
                "participantsList":[255],
                "routes":["Route1"]
            });
            event.save(function () {
                event2.save(function () {
                    request.get('/api/events?sort=price')
                        .end(function (err1, res) {
                            expect(res.status).to.be.eql(200);
                            expect(res.body).to.be.an('object');
                            expect(res.body.events).to.be.an('array');
                            expect(res.body.events.length).to.be.eql(2);
                            expect(res.body.events[0]._id).to.be.eql(event._id.toString());
                            done();
                        })
                });
            });
        });

        it('Search using sorting by price asc', function (done) {
            var event = new Event({
                "name":"TestEvent",
                "organizerId": mongoose.Types.ObjectId(),
                "type":"running",
                "description":"Blablabla",
                "country":"MyCountry",
                "city":"MyCity",
                "startingTime":"2017-09-23T12:00:00.000Z",
                "maxDuration":150,
                "length": 40,
                "price": 100,
                "enrollmentOpeningAt":"2017-09-10T00:00:00.000Z",
                "enrollmentClosingAt":"2017-09-17T00:00:00.000Z",
                "participantsList":[255],
                "routes":["Route1"]
            });
            var event2 = new Event({
                "name":"TestEvent2",
                "organizerId": mongoose.Types.ObjectId(),
                "type":"running",
                "description":"Blablabla",
                "country":"MyCountry",
                "city":"MyCity",
                "startingTime":"2017-09-23T12:00:00.000Z",
                "maxDuration":150,
                "length": 50,
                "price": 120,
                "enrollmentOpeningAt":"2017-09-10T00:00:00.000Z",
                "enrollmentClosingAt":"2017-09-17T00:00:00.000Z",
                "participantsList":[255],
                "routes":["Route1"]
            });
            event.save(function () {
                event2.save(function () {
                    request.get('/api/events?sort=price:asc')
                        .end(function (err1, res) {
                            expect(res.status).to.be.eql(200);
                            expect(res.body).to.be.an('object');
                            expect(res.body.events).to.be.an('array');
                            expect(res.body.events.length).to.be.eql(2);
                            expect(res.body.events[0]._id).to.be.eql(event._id.toString());
                            done();
                        })
                });
            });
        });

        it('Search using sorting by price desc', function (done) {
            var event = new Event({
                "name":"TestEvent",
                "organizerId": mongoose.Types.ObjectId(),
                "type":"running",
                "description":"Blablabla",
                "country":"MyCountry",
                "city":"MyCity",
                "startingTime":"2017-09-23T12:00:00.000Z",
                "maxDuration":150,
                "length": 40,
                "price": 100,
                "enrollmentOpeningAt":"2017-09-10T00:00:00.000Z",
                "enrollmentClosingAt":"2017-09-17T00:00:00.000Z",
                "participantsList":[255],
                "routes":["Route1"]
            });
            var event2 = new Event({
                "name":"TestEvent2",
                "organizerId": mongoose.Types.ObjectId(),
                "type":"running",
                "description":"Blablabla",
                "country":"MyCountry",
                "city":"MyCity",
                "startingTime":"2017-09-23T12:00:00.000Z",
                "maxDuration":150,
                "length": 50,
                "price": 120,
                "enrollmentOpeningAt":"2017-09-10T00:00:00.000Z",
                "enrollmentClosingAt":"2017-09-17T00:00:00.000Z",
                "participantsList":[255],
                "routes":["Route1"]
            });
            event.save(function () {
                event2.save(function () {
                    request.get('/api/events?sort=price:desc')
                        .end(function (err, res) {
                            expect(res.status).to.be.eql(200);
                            expect(res.body).to.be.an('object');
                            expect(res.body.events).to.be.an('array');
                            expect(res.body.events.length).to.be.eql(2);
                            expect(res.body.events[1]._id).to.be.eql(event._id.toString());
                            done();
                        })
                });
            });
        });

        it('Search using sorting by startingTime without specifying asc or desc', function (done) {
            var event = new Event({
                "name":"TestEvent",
                "organizerId": mongoose.Types.ObjectId(),
                "type":"running",
                "description":"Blablabla",
                "country":"MyCountry",
                "city":"MyCity",
                "startingTime":"2017-09-23T12:00:00.000Z",
                "maxDuration":150,
                "length": 40,
                "price": 100,
                "enrollmentOpeningAt":"2017-09-10T00:00:00.000Z",
                "enrollmentClosingAt":"2017-09-17T00:00:00.000Z",
                "participantsList":[255],
                "routes":["Route1"]
            });
            var event2 = new Event({
                "name":"TestEvent2",
                "organizerId": mongoose.Types.ObjectId(),
                "type":"running",
                "description":"Blablabla",
                "country":"MyCountry",
                "city":"MyCity",
                "startingTime":"2017-10-24T12:00:00.000Z",
                "maxDuration":150,
                "length": 50,
                "price": 120,
                "enrollmentOpeningAt":"2017-09-10T00:00:00.000Z",
                "enrollmentClosingAt":"2017-09-17T00:00:00.000Z",
                "participantsList":[255],
                "routes":["Route1"]
            });
            event.save(function () {
                event2.save(function () {
                    request.get('/api/events?sort=startingTime')
                        .end(function (err1, res) {
                            expect(res.status).to.be.eql(200);
                            expect(res.body).to.be.an('object');
                            expect(res.body.events).to.be.an('array');
                            expect(res.body.events.length).to.be.eql(2);
                            expect(res.body.events[0]._id).to.be.eql(event._id.toString());
                            done();
                        })
                });
            });
        });

        it('Search using sorting by startingTime asc', function (done) {
            var event = new Event({
                "name":"TestEvent",
                "organizerId": mongoose.Types.ObjectId(),
                "type":"running",
                "description":"Blablabla",
                "country":"MyCountry",
                "city":"MyCity",
                "startingTime":"2017-09-23T12:00:00.000Z",
                "maxDuration":150,
                "length": 40,
                "price": 100,
                "enrollmentOpeningAt":"2017-09-10T00:00:00.000Z",
                "enrollmentClosingAt":"2017-09-17T00:00:00.000Z",
                "participantsList":[255],
                "routes":["Route1"]
            });
            var event2 = new Event({
                "name":"TestEvent2",
                "organizerId": mongoose.Types.ObjectId(),
                "type":"running",
                "description":"Blablabla",
                "country":"MyCountry",
                "city":"MyCity",
                "startingTime":"2017-10-24T12:00:00.000Z",
                "maxDuration":150,
                "length": 50,
                "price": 120,
                "enrollmentOpeningAt":"2017-09-10T00:00:00.000Z",
                "enrollmentClosingAt":"2017-09-17T00:00:00.000Z",
                "participantsList":[255],
                "routes":["Route1"]
            });
            event.save(function () {
                event2.save(function () {
                    request.get('/api/events?sort=startingTime:asc')
                        .end(function (err1, res) {
                            expect(res.status).to.be.eql(200);
                            expect(res.body).to.be.an('object');
                            expect(res.body.events).to.be.an('array');
                            expect(res.body.events.length).to.be.eql(2);
                            expect(res.body.events[0]._id).to.be.eql(event._id.toString());
                            done();
                        })
                });
            });
        });

        it('Search using sorting by startingTime desc', function (done) {
            var event = new Event({
                "name":"TestEvent",
                "organizerId": mongoose.Types.ObjectId(),
                "type":"running",
                "description":"Blablabla",
                "country":"MyCountry",
                "city":"MyCity",
                "startingTime":"2017-09-23T12:00:00.000Z",
                "maxDuration":150,
                "length": 40,
                "price": 100,
                "enrollmentOpeningAt":"2017-09-10T00:00:00.000Z",
                "enrollmentClosingAt":"2017-09-17T00:00:00.000Z",
                "participantsList":[255],
                "routes":["Route1"]
            });
            var event2 = new Event({
                "name":"TestEvent2",
                "organizerId": mongoose.Types.ObjectId(),
                "type":"running",
                "description":"Blablabla",
                "country":"MyCountry",
                "city":"MyCity",
                "startingTime":"2017-10-24T12:00:00.000Z",
                "maxDuration":150,
                "length": 50,
                "price": 120,
                "enrollmentOpeningAt":"2017-09-10T00:00:00.000Z",
                "enrollmentClosingAt":"2017-09-17T00:00:00.000Z",
                "participantsList":[255],
                "routes":["Route1"]
            });
            event.save(function () {
                event2.save(function () {
                    request.get('/api/events?sort=startingTime:desc')
                        .end(function (err, res) {
                            expect(res.status).to.be.eql(200);
                            expect(res.body).to.be.an('object');
                            expect(res.body.events).to.be.an('array');
                            expect(res.body.events.length).to.be.eql(2);
                            expect(res.body.events[1]._id).to.be.eql(event._id.toString());
                            done();
                        })
                });
            });
        });


        it('Search by city: it should return an array with one element', function (done) {
            var event = new Event({
                "name":"TestEvent",
                "organizerId": mongoose.Types.ObjectId(),
                "type":"running",
                "description":"Blablabla",
                "country":"MyCountry",
                "city":"MyCity",
                "startingTime":"2017-09-23T12:00:00.000Z",
                "maxDuration":150,
                "length": 40,
                "enrollmentOpeningAt":"2017-09-10T00:00:00.000Z",
                "enrollmentClosingAt":"2017-09-17T00:00:00.000Z",
                "participantsList":[255],
                "routes":["Route1"]
            });
            event.save(function () {
                request.get('/api/events?city=' + event.city)
                    .end(function (err1, res) {
                        expect(res.status).to.be.eql(200);
                        expect(res.body).to.be.an('object');
                        expect(res.body.events).to.be.an('array');
                        expect(res.body.events.length).to.be.eql(1);
                        done();
                    })
            });
        });

        it('Search by name: it should return an array with one element', function (done) {
            var event = new Event({
                "name":"TestEvent",
                "organizerId": mongoose.Types.ObjectId(),
                "type":"running",
                "description":"Blablabla",
                "country":"MyCountry",
                "city":"MyCity",
                "startingTime":"2017-09-23T12:00:00.000Z",
                "maxDuration":150,
                "length": 40,
                "enrollmentOpeningAt":"2017-09-10T00:00:00.000Z",
                "enrollmentClosingAt":"2017-09-17T00:00:00.000Z",
                "participantsList":[255],
                "routes":["Route1"]
            });
            event.save(function () {
                request.get('/api/events?name=' + event.name)
                    .end(function (err1, res) {
                        expect(res.status).to.be.eql(200);
                        expect(res.body).to.be.an('object');
                        expect(res.body.events).to.be.an('array');
                        expect(res.body.events.length).to.be.eql(1);
                        done();
                    })
            });
        });

        it('Search by type: it should return an array with one element', function (done) {
            var event = new Event({
                "name":"TestEvent",
                "organizerId": mongoose.Types.ObjectId(),
                "type":"running",
                "description":"Blablabla",
                "country":"MyCountry",
                "city":"MyCity",
                "startingTime":"2017-09-23T12:00:00.000Z",
                "maxDuration":150,
                "length": 40,
                "enrollmentOpeningAt":"2017-09-10T00:00:00.000Z",
                "enrollmentClosingAt":"2017-09-17T00:00:00.000Z",
                "participantsList":[255],
                "routes":["Route1"]
            });
            event.save(function () {
                request.get('/api/events?type=' + event.type)
                    .end(function (err1, res) {
                        expect(res.status).to.be.eql(200);
                        expect(res.body).to.be.an('object');
                        expect(res.body.events).to.be.an('array');
                        expect(res.body.events.length).to.be.eql(1);
                        done();
                    })
            });
        });

        it('Search by country: it should return an array with one element', function (done) {
            var event = new Event({
                "name":"TestEvent",
                "organizerId": mongoose.Types.ObjectId(),
                "type":"running",
                "description":"Blablabla",
                "country":"MyCountry",
                "city":"MyCity",
                "startingTime":"2017-09-23T12:00:00.000Z",
                "maxDuration":150,
                "length": 40,
                "enrollmentOpeningAt":"2017-09-10T00:00:00.000Z",
                "enrollmentClosingAt":"2017-09-17T00:00:00.000Z",
                "participantsList":[255],
                "routes":["Route1"]
            });
            event.save(function () {
                request.get('/api/events?country=' + event.country)
                    .end(function (err1, res) {
                        expect(res.status).to.be.eql(200);
                        expect(res.body).to.be.an('object');
                        expect(res.body.events).to.be.an('array');
                        expect(res.body.events.length).to.be.eql(1);
                        done();
                    })
            });
        });

        it('it should return only 5 elements using page and itemsPerPage', function (done) {
            createRandomEvents(20, function () {
                request.get('/api/events?page=2&itemsPerPage=5')
                    .end(function (err, res) {
                        expect(res.status).to.be.eql(200);
                        expect(res.body).to.be.an('object');
                        expect(res.body.events).to.be.an('array');
                        expect(res.body.events.length).to.be.eql(5);
                        expect(res.body.totalPages).to.be.eql(4);
                        done();
                    })
            });
        })

        it('it should return the list of distinct cities', function (done) {
            var event = {
                "name":"TestEvent",
                "organizerId": mongoose.Types.ObjectId(),
                "type":"running",
                "description":"Blablabla",
                "country":"MyCountry",
                "city":"MyCity",
                "startingTime":"2017-09-23T12:00:00.000Z",
                "maxDuration":150,
                "length": 40,
                "enrollmentOpeningAt":"2017-09-10T00:00:00.000Z",
                "enrollmentClosingAt":"2017-09-17T00:00:00.000Z",
                "participantsList":[255],
                "routes":["Route1"]
            };
            var event1 = new Event(event);
            event1.save(function () {
                event.name = event.name + 1;
                var event2 = new Event(event);
                event2.save(function () {
                    event.name = event.name + 2;
                    event.city = "Other city";
                    var event3 = new Event(event);
                    event3.save(function () {
                        request.get('/api/events/allCities')
                            .end(function (err, res) {
                                expect(res.status).to.be.eql(200);
                                expect(res.body).to.be.an('object');
                                expect(res.body.cities).to.be.an('array');
                                expect(res.body.cities.length).to.be.eql(2);
                                done();
                            })
                    })
                })
            })
        })
    });

    describe('POST /events', function () {
        it('it should create an event', function (done) {
            var user = {
                "name": "User",
                "surname": "Surname",
                "email": "email@domain.it",
                "password": "AVeryStrongPasword"
            };
            request.post('/api/auth/register')
                .send(user)
                .end(function (err, res) {
                    user._id = res.body.userId;
                    user.jwtToken = res.body.jwtToken;

                    var event = {
                        "name":"TestEvent",
                        "organizerId": user._id,
                        "type":"running",
                        "description":"Blablabla",
                        "country":"MyCountry",
                        "city":"MyCity",
                        "startingTime":"2017-09-23T12:00:00.000Z",
                        "maxDuration":150,
                        "length": 40,
                        "enrollmentOpeningAt":"2017-09-10T00:00:00.000Z",
                        "enrollmentClosingAt":"2017-09-17T00:00:00.000Z",
                        "participantsList":[255],
                        "routes":["Route1"]
                    };

                    request.post('/api/events')
                        .send(event)
                        .set('Authorization', 'JWT ' + user.jwtToken)
                        .end(function (err, res) {
                            expect(res.status).to.be.eql(200);
                            expect(res.body).to.be.an('object');
                            expect(res.body.event).to.be.an('object');
                            expect(res.body.event._id).to.not.be.eql('');

                            done();
                        })
                });
        });

        it('it should NOT create an event without login', function (done) {
            var user = {
                "name": "User",
                "surname": "Surname",
                "email": "email@domain.it",
                "password": "AVeryStrongPasword"
            };
            request.post('/api/auth/register')
                .send(user)
                .end(function (err, res) {
                    user._id = res.body.userId;
                    user.jwtToken = res.body.jwtToken;

                    var event = {
                        "name":"TestEvent",
                        "organizerId": user._id,
                        "type":"running",
                        "description":"Blablabla",
                        "country":"MyCountry",
                        "city":"MyCity",
                        "startingTime":"2017-09-23T12:00:00.000Z",
                        "maxDuration":150,
                        "length": 40,
                        "enrollmentOpeningAt":"2017-09-10T00:00:00.000Z",
                        "enrollmentClosingAt":"2017-09-17T00:00:00.000Z",
                        "participantsList":[255],
                        "routes":["Route1"]
                    };

                    request.post('/api/events')
                        .send(event)
                        .end(function (err, res) {
                            expect(res.status).to.be.eql(401);
                            expect(res.body).to.be.an('object');
                            expect(res.body.errors).to.not.be.eql(undefined);
                            done();
                        })
                });
        });
    });

    
    describe('PUT /events', function () {
        it('it should NOT update the event if it is not the organizer', function (done) {
            var user = {
                "name": "User",
                "surname": "Surname",
                "email": "email@domain.it",
                "password": "AVeryStrongPasword"
            };
            request.post('/api/auth/register')
                .send(user)
                .end(function (err, res) {
                    user._id = res.body.userId;
                    user.jwtToken = res.body.jwtToken;

                    var event = new Event({
                        "name":"TestEvent",
                        "organizerId": user._id,
                        "type":"running",
                        "description":"Blablabla",
                        "country":"MyCountry",
                        "city":"MyCity",
                        "startingTime":"2017-09-23T12:00:00.000Z",
                        "maxDuration":150,
                        "length": 40,
                        "enrollmentOpeningAt":"2017-09-10T00:00:00.000Z",
                        "enrollmentClosingAt":"2017-09-17T00:00:00.000Z",
                        "participantsList":[255],
                        "routes":["Route1"]
                    });

                    var user2 = {
                        "name": "User",
                        "surname": "Surname",
                        "email": "email@domain.it",
                        "password": "AVeryStrongPasword"
                    };

                    request.post('/api/auth/register')
                        .send(user2)
                        .end(function (err, res) {
                            user2._id = res.body.userId;
                            user2.jwtToken = res.body.jwtToken;

                            event.save(function () {
                                var newFields = {
                                    name: 'newName'
                                };

                                request.put('/api/events/' + event._id)
                                    .send(newFields)
                                    .set('Authorization', 'JWT ' + user2.jwtToken)
                                    .end(function (req, res) {
                                        expect(res.status).to.be.eql(401);
                                        expect(res.body).to.be.an('object');
                                        expect(res.body.errors).to.not.be.eql(null);

                                        done()
                                    });
                            });
                        });
                });
        });

        it('should NOT update the id of the event', function (done) {
            var user = {
                "name": "User",
                "surname": "Surname",
                "email": "email@domain.it",
                "password": "AVeryStrongPasword"
            };
            request.post('/api/auth/register')
                .send(user)
                .end(function (err, res) {
                    user._id = res.body.userId;
                    user.jwtToken = res.body.jwtToken;

                    var event = new Event({
                        "name":"TestEvent",
                        "organizerId": user._id,
                        "type":"running",
                        "description":"Blablabla",
                        "country":"MyCountry",
                        "city":"MyCity",
                        "startingTime":"2017-09-23T12:00:00.000Z",
                        "maxDuration":150,
                        "length": 40,
                        "enrollmentOpeningAt":"2017-09-10T00:00:00.000Z",
                        "enrollmentClosingAt":"2017-09-17T00:00:00.000Z",
                        "participantsList":[255],
                        "routes":["Route1"]
                    });

                    event.save(function () {
                        let newFields = {
                            _id: mongoose.Types.ObjectId()
                        };

                        request.put('/api/events/' + event._id)
                            .send(newFields)
                            .set('Authorization', 'JWT ' + user.jwtToken)
                            .end(function (req, res) {
                                expect(res.status).to.be.eql(400);
                                expect(res.body).to.be.an('object');
                                expect(res.body.errors).to.not.be.eql(null);

                                done()
                            });
                    });
                });
        });

        it('should NOT update without login', function (done) {
            var event = new Event({
                "name":"TestEvent",
                "organizerId": mongoose.Types.ObjectId(),
                "type":"running",
                "description":"Blablabla",
                "country":"MyCountry",
                "city":"MyCity",
                "startingTime":"2017-09-23T12:00:00.000Z",
                "maxDuration":150,
                "length": 40,
                "enrollmentOpeningAt":"2017-09-10T00:00:00.000Z",
                "enrollmentClosingAt":"2017-09-17T00:00:00.000Z",
                "participantsList":[255],
                "routes":["Route1"]
            });

            event.save(function () {
                var newFields = {
                    name: 'newName'
                };

                request.put('/api/events/' + event._id)
                    .send(newFields)
                    .end(function (req, res) {
                        expect(res.status).to.be.eql(401);
                        expect(res.body).to.be.an('object');
                        expect(res.body.errors).to.not.be.eql(null);

                        done()
                    });
            });
        });

        it('it should update the name of the event', function (done) {
            var user = {
                "name": "User",
                "surname": "Surname",
                "email": "email@domain.it",
                "password": "AVeryStrongPasword"
            };
            request.post('/api/auth/register')
                .send(user)
                .end(function (err, res) {
                    user._id = res.body.userId;
                    user.jwtToken = res.body.jwtToken;

                    var event = new Event({
                        "name":"TestEvent",
                        "organizerId": user._id,
                        "type":"running",
                        "description":"Blablabla",
                        "country":"MyCountry",
                        "city":"MyCity",
                        "startingTime":"2017-09-23T12:00:00.000Z",
                        "maxDuration":150,
                        "length": 40,
                        "enrollmentOpeningAt":"2017-09-10T00:00:00.000Z",
                        "enrollmentClosingAt":"2017-09-17T00:00:00.000Z",
                        "participantsList":[255],
                        "routes":["Route1"]
                    });

                    event.save(function () {
                        var newFields = {
                            name: 'newName'
                        };

                        request.put('/api/events/' + event._id)
                            .send(newFields)
                            .set('Authorization', 'JWT ' + user.jwtToken)
                            .end(function (req, res) {
                                expect(res.status).to.be.eql(200);
                                expect(res.body).to.be.an('object');
                                expect(res.body.errors).to.be.eql(undefined);
                                expect(res.body.event.name).to.be.eql(newFields.name);

                                done()
                            });
                    });
                });
        })
    });

    describe('DELETE /events', function () {
        it('it should NOT delete an event without login', function (done) {
            var event = new Event({
                "name":"TestEvent",
                "organizerId": mongoose.Types.ObjectId(),
                "type":"running",
                "description":"Blablabla",
                "country":"MyCountry",
                "city":"MyCity",
                "startingTime":"2017-09-23T12:00:00.000Z",
                "maxDuration":150,
                "length": 40,
                "enrollmentOpeningAt":"2017-09-10T00:00:00.000Z",
                "enrollmentClosingAt":"2017-09-17T00:00:00.000Z",
                "participantsList":[255],
                "routes":["Route1"]
            });

            event.save(function () {
                var newFields = {
                    name: 'newName'
                };

                request.delete('/api/events/' + event._id)
                    .end(function (req, res) {
                        expect(res.status).to.be.eql(401);
                        expect(res.body).to.be.an('object');
                        expect(res.body.errors).to.not.be.eql(null);

                        done()
                    });
            });
        });

        it('it should NOT delete the event if it is not the organizer', function (done) {
            var user = {
                "name": "User",
                "surname": "Surname",
                "email": "email@domain.it",
                "password": "AVeryStrongPasword"
            };
            request.post('/api/auth/register')
                .send(user)
                .end(function (err, res) {
                    user._id = res.body.userId;
                    user.jwtToken = res.body.jwtToken;

                    var event = new Event({
                        "name":"TestEvent",
                        "organizerId": user._id,
                        "type":"running",
                        "description":"Blablabla",
                        "country":"MyCountry",
                        "city":"MyCity",
                        "startingTime":"2017-09-23T12:00:00.000Z",
                        "maxDuration":150,
                        "length": 40,
                        "enrollmentOpeningAt":"2017-09-10T00:00:00.000Z",
                        "enrollmentClosingAt":"2017-09-17T00:00:00.000Z",
                        "participantsList":[255],
                        "routes":["Route1"]
                    });

                    var user2 = {
                        "name": "User",
                        "surname": "Surname",
                        "email": "email@domain.it",
                        "password": "AVeryStrongPasword"
                    };

                    request.post('/api/auth/register')
                        .send(user2)
                        .end(function (err, res) {
                            user2._id = res.body.userId;
                            user2.jwtToken = res.body.jwtToken;

                            event.save(function () {
                                var newFields = {
                                    name: 'newName'
                                };

                                request.delete('/api/events/' + event._id)
                                    .set('Authorization', 'JWT ' + user2.jwtToken)
                                    .end(function (req, res) {
                                        expect(res.status).to.be.eql(401);
                                        expect(res.body).to.be.an('object');
                                        expect(res.body.errors).to.not.be.eql(null);

                                        done()
                                    });
                            });
                        });
                });
        });

        it('it should delete the event', function (done) {
            var user = {
                "name": "User",
                "surname": "Surname",
                "email": "email@domain.it",
                "password": "AVeryStrongPasword"
            };
            request.post('/api/auth/register')
                .send(user)
                .end(function (err, res) {
                    user._id = res.body.userId;
                    user.jwtToken = res.body.jwtToken;

                    var event = new Event({
                        "name":"TestEvent",
                        "organizerId": user._id,
                        "type":"running",
                        "description":"Blablabla",
                        "country":"MyCountry",
                        "city":"MyCity",
                        "startingTime":"2017-09-23T12:00:00.000Z",
                        "maxDuration":150,
                        "length": 40,
                        "enrollmentOpeningAt":"2017-09-10T00:00:00.000Z",
                        "enrollmentClosingAt":"2017-09-17T00:00:00.000Z",
                        "participantsList":[255],
                        "routes":["Route1"]
                    });

                    event.save(function () {
                        var newFields = {
                            name: 'newName'
                        };

                        request.delete('/api/events/' + event._id)
                            .set('Authorization', 'JWT ' + user.jwtToken)
                            .end(function (req, res) {
                                expect(res.status).to.be.eql(200);
                                expect(res.body).to.be.an('object');
                                expect(res.body.errors).to.be.eql(undefined);
                                expect(res.body.event).to.be.an('object');

                                done()
                            });
                    });
                });
        })
    });


    // it closes the server at the end
    after(function (done) {
        server.close();
        done();
    })
});

function createRandomEvents(numberToCreate, callback) {
    var basicEvent = {
        "name":"TestEvent",
        "organizerId": '',
        "type":"running",
        "description":"Blablabla",
        "country":"MyCountry",
        "city":"MyCity",
        "startingTime": new Date(),
        "maxDuration":150,
        "length": 50,
        "price": 120,
        "enrollmentOpeningAt":"2017-09-10T00:00:00.000Z",
        "enrollmentClosingAt":"2017-09-17T00:00:00.000Z",
        "participantsList":[255],
        "routes":["Route1"]
    };

    var created = 0;
    for(let i = 0; i < numberToCreate; i++){
        (function () {
            var event = Object.assign({}, basicEvent);
            event.name = event.name + i;
            event.organizerId = mongoose.Types.ObjectId();
            event.city = event.city+i;
            event.price = event.price + i;
            event.length = event.length + i;
            event.startingTime = new Date(event.startingTime.getTime() + i * 86400000);

            event.enrollmentClosingAt = new Date(event.startingTime.getTime() - 3 * 86400000);
            event.enrollmentOpeningAt = new Date(event.enrollmentClosingAt.getTime() - 3 * 86400000);

            var ev = new Event(event);
            ev.save(function () {
                if (++created == numberToCreate) callback();
            })
        })()
    }
}

