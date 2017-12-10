//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
var chai = require('chai');
var server = require('../../../server');
var uuid = require('uuid');
var supertest = require('supertest');
var mongoose = require('mongoose');

global.server = server;
global.uuid = uuid;
global.expect = chai.expect;
global.assert = chai.assert;
global.request = supertest(server);

var Event = require('../../models/event');
var User = require('../../models/user');
var Enrollment = require('../../models/enrollment');
var Route = require ('../../models/route');

describe('Event API tests', function () {

    before(function (done) {
        done()
    });

    /**
     * It clears the database.
     */
    beforeEach(function (done) {
        Event.remove({}, function () {
            User.remove({}, function () {
               Route.remove({}, function () {
                    Enrollment.remove({}, function () {
                        done()
                    })
               });
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
                "startingDate":"2017-09-23",
                "startingTime":"12:00:00.000",
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
                "name": "TestEvent",
                "organizerId": mongoose.Types.ObjectId(),
                "type": "running",
                "description": "Blablabla",
                "country": "MyCountry",
                "city": "MyCity",
                "startingDate": "2017-09-23",
                "startingTime": "12:00:00.000",
                "maxDuration": 150,
                "length": 40,
                "enrollmentOpeningAt": "2017-09-10T00:00:00.000Z",
                "enrollmentClosingAt": "2017-09-17T00:00:00.000Z",
                "participantsList": [255],
                "routes": ["Route1"]
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
                    "startingDate":"2017-09-23",
                    "startingTime":"12:00:00.000",
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
                "startingDate":"2017-09-23",
                "startingTime":"12:00:00.000",
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
                "startingDate":"2017-09-23",
                "startingTime":"12:00:00.000",
                "maxDuration":150,
                "length": 50,
                "enrollmentOpeningAt":"2017-09-10T00:00:00.000Z",
                "enrollmentClosingAt":"2017-09-17T00:00:00.000Z",
                "participantsList":[255],
                "routes":["Route1"]
            });
            var event3 = new Event({
                "name":"TestEvent3",
                "organizerId": mongoose.Types.ObjectId(),
                "type":"running",
                "description":"Blablabla",
                "country":"MyCountry",
                "city":"MyCity",
                "startingDate":"2017-09-23",
                "startingTime":"12:00:00.000",
                "maxDuration":150,
                "length": 60,
                "enrollmentOpeningAt":"2017-09-10T00:00:00.000Z",
                "enrollmentClosingAt":"2017-09-17T00:00:00.000Z",
                "participantsList":[255],
                "routes":["Route1"]
            });
            event.save(function () {
                event2.save(function () {
                    event3.save(function () {
                        request.get('/api/events?sort=length&length=gte:45&length=lt:50.5')
                            .end(function (err1, res) {
                                expect(res.status).to.be.eql(200);
                                expect(res.body).to.be.an('object');
                                expect(res.body.events).to.be.an('array');
                                expect(res.body.events.length).to.be.eql(1);
                                expect(res.body.events[0]._id).to.be.eql(event2._id.toString());
                                done();
                            })
                    })
                });
            });
        });

        it('Search using filtering by keyword', function (done) {
            var event = new Event({
                "name":"The best marathon ever of Italy",
                "organizerId": mongoose.Types.ObjectId(),
                "type":"running",
                "description":"The right one",
                "country":"MyCountry",
                "city":"MyCity",
                "startingDate":"2017-09-23",
                "startingTime":"12:00:00.000",
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
                "startingDate":"2017-09-23",
                "startingTime":"12:00:00.000",
                "maxDuration":150,
                "length": 50,
                "enrollmentOpeningAt":"2017-09-10T00:00:00.000Z",
                "enrollmentClosingAt":"2017-09-17T00:00:00.000Z",
                "participantsList":[255],
                "routes":["Route1"]
            });
            var event3 = new Event({
                "name":"TestEvent3",
                "organizerId": mongoose.Types.ObjectId(),
                "type":"running",
                "description":"Blablabla222",
                "country":"MyCountry",
                "city":"MyCity",
                "startingDate":"2017-09-23",
                "startingTime":"12:00:00.000",
                "maxDuration":150,
                "length": 60,
                "enrollmentOpeningAt":"2017-09-10T00:00:00.000Z",
                "enrollmentClosingAt":"2017-09-17T00:00:00.000Z",
                "participantsList":[255],
                "routes":["Route1"]
            });
            event.save(function () {
                event2.save(function () {
                    event3.save(function () {
                        request.get('/api/events?city=MyCity&keyword=Italy')
                            .end(function (err1, res) {
                                expect(res.status).to.be.eql(200);
                                expect(res.body).to.be.an('object');
                                expect(res.body.events).to.be.an('array');
                                expect(res.body.events.length).to.be.eql(1);
                                expect(res.body.events[0]._id).to.be.eql(event._id.toString());
                                done();
                            })
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
                "startingDate":"2017-09-23",
                "startingTime":"12:00:00.000",
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
                "startingDate":"2017-09-23",
                "startingTime":"12:00:00.000",
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

        it('Search using filtering by keyword', function (done) {
            var event = new Event({
                "name":"The best marathon ever of Italy",
                "organizerId": mongoose.Types.ObjectId(),
                "type":"running",
                "description":"The right one",
                "country":"MyCountry",
                "city":"MyCity",
                "startingDate":"2017-09-23",
                "startingTime":"12:00:00.000",
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
                "description":"Blablabla in Italy",
                "country":"MyCountry",
                "city":"MyCity",
                "startingDate":"2017-09-23",
                "startingTime":"12:00:00.000",
                "maxDuration":150,
                "length": 50,
                "enrollmentOpeningAt":"2017-09-10T00:00:00.000Z",
                "enrollmentClosingAt":"2017-09-17T00:00:00.000Z",
                "participantsList":[255],
                "routes":["Route1"]
            });
            var event3 = new Event({
                "name":"TestEvent3",
                "organizerId": mongoose.Types.ObjectId(),
                "type":"running",
                "description":"Blablabla222",
                "country":"MyCountry",
                "city":"MyCity",
                "startingDate":"2017-09-23",
                "startingTime":"12:00:00.000",
                "maxDuration":150,
                "length": 60,
                "enrollmentOpeningAt":"2017-09-10T00:00:00.000Z",
                "enrollmentClosingAt":"2017-09-17T00:00:00.000Z",
                "participantsList":[255],
                "routes":["Route1"]
            });
            event.save(function () {
                event2.save(function () {
                    event3.save(function () {
                        request.get('/api/events?city=MyCity&keyword=Italy')
                            .end(function (err1, res) {
                                expect(res.status).to.be.eql(200);
                                expect(res.body).to.be.an('object');
                                expect(res.body.events).to.be.an('array');
                                expect(res.body.events.length).to.be.eql(2);
                                done();
                            })
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
                "startingDate":"2017-09-23",
                "startingTime":"12:00:00.000",
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
                "startingDate":"2017-09-23",
                "startingTime":"12:00:00.000",
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
                "startingDate":"2017-09-23",
                "startingTime":"12:00:00.000",
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
                "startingDate":"2017-09-23",
                "startingTime":"12:00:00.000",
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
                "startingDate":"2017-09-23",
                "startingTime":"12:00:00.000",
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
                "startingDate":"2017-09-23",
                "startingTime":"12:00:00.000",
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
                "startingDate":"2017-09-23",
                "startingTime":"12:00:00.000",
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
                "startingDate":"2017-09-23",
                "startingTime":"12:00:00.000",
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
                "startingDate":"2017-09-23",
                "startingTime":"12:00:00.000",
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
                "startingDate":"2017-09-23",
                "startingTime":"12:00:00.000",
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
                "startingDate":"2017-09-23",
                "startingTime":"12:00:00.000",
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
                "startingDate":"2017-10-24",
                "startingTime":"12:00:00.000",
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
                "startingDate":"2017-09-23",
                "startingTime":"12:00:00.000",
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
                "startingDate":"2017-10-24",
                "startingTime":"12:00:00.000",
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
                "startingDate":"2017-09-23",
                "startingTime":"12:00:00.000",
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
                "startingDate":"2017-10-24",
                "startingTime":"12:00:00.000",
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
                "startingDate":"2017-09-23",
                "startingTime":"12:00:00.000",
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
                "startingDate":"2017-09-23",
                "startingTime":"12:00:00.000",
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
                "startingDate":"2017-09-23",
                "startingTime":"12:00:00.000",
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
                "startingDate":"2017-09-23",
                "startingTime":"12:00:00.000",
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
                "startingDate":"2017-09-23",
                "startingTime":"12:00:00.000",
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

    describe('GET /participants', function () {
        it('should return the participants list', function (done) {
            var user = new User({
                "name": "User",
                "surname": "Surname",
                "email": "email@domain.it",
                "password": "AVeryStrongPasword"
            });
            user.save(function () {
                var user2 = new User({
                    "name": "User2",
                    "surname": "Surname2",
                    "email": "email2@domain.it",
                    "password": "AVeryStrongPasword2"
                });
                user2.save(function () {
                    var event = new Event({
                        "name":"TestEvent",
                        "organizerId": mongoose.Types.ObjectId(),
                        "type":"running",
                        "description":"Blablabla",
                        "country":"MyCountry",
                        "city":"MyCity",
                        "startingDate":"2017-09-23",
                        "startingTime":"12:00:00.000",
                        "maxDuration":150,
                        "length": 40,
                        "enrollmentOpeningAt":"2017-09-10T00:00:00.000Z",
                        "enrollmentClosingAt":"2017-09-17T00:00:00.000Z"
                    });
                    event.save(function () {
                        var enrollment1 = new Enrollment({
                            userId: user._id,
                            eventId: event._id
                        })

                        enrollment1.save(function () {
                            var enrollment2 = new Enrollment({
                                userId: user2._id,
                                eventId: event._id
                            });

                            enrollment2.save(function () {
                                request.get('/api/events/' + event._id + '/participantsList')
                                    .end(function (err, res) {
                                        expect(res.status).to.be.eql(200);
                                        expect(res.body).to.be.an('object');
                                        expect(res.body.participants).to.be.an('array');
                                        expect(res.body.participants.length).to.be.eql(2);

                                        done();
                                    })
                            })
                        })
                    })
                })
            })
        })
    });

    describe('POST /events', function () {

		var userJson = {
			"name": "User",
			"surname": "Surname",
			"email": "email@domain.it",
			"password": "AVeryStrongPasword",
			"id":'',
			"jwtToken":''
		};

		var eventJson ={
			"id":'',
			"name":"TestEvent",
			"organizerId": '',
			"type":"running",
			"description":"Blablabla",
			"country":"MyCountry",
			"city":"MyCity",
			"startingDate":"2017-09-23",
			"startingTime":"12:00:00.000",
			"maxDuration":150,
			"length": 40,
			"enrollmentOpeningAt":"2017-09-10T00:00:00.000Z",
			"enrollmentClosingAt":"2017-09-17T00:00:00.000Z",
			"participantsList":[255],
			"routes":["Route1"]

		}

		beforeEach(function(done){

			request.post('/api/auth/register')
				.send(userJson)
				.end(function(err,resUser){
					if (err)
						throw new Error(err);

					userJson.id = resUser.body.userId;
					userJson.jwtToken = "JWT " + resUser.body.jwtToken;
					eventJson.organizerId = userJson.id;

					done();
				});
		});





        it('it should create an event', function (done) {

			request.post('/api/events')
				.set('Authorization', userJson.jwtToken)
				.send(eventJson)
				.end(function (err, res) {
					expect(res.status).to.be.eql(200);
					expect(res.body).to.be.an('object');
					expect(res.body.event).to.be.an('object');
					expect(res.body.event._id).to.not.be.eql('');

					done();

                });
        });

        it('it should NOT create an event without login', function (done) {

			request.post('/api/events')
				.send(eventJson)
				.end(function (err, res) {
					expect(res.status).to.be.eql(401);
					expect(res.body).to.be.an('object');
					expect(res.body.event).to.be.an('object');
					expect(res.body.event._id).to.not.be.eql('');

					done();

                });
        });
	});


    describe('PUT /events', function () {

		var userJson = {
			"name": "User",
			"surname": "Surname",
			"email": "email@domain.it",
			"password": "AVeryStrongPasword",
			"id":'',
			"jwtToken":''
		};

		var eventJson ={
			"id":'',
			"name":"TestEvent",
			"organizerId": '',
			"type":"running",
			"description":"Blablabla",
			"country":"MyCountry",
			"city":"MyCity",
			"startingDate":"2017-09-23",
			"startingTime":"12:00:00.000",
			"maxDuration":150,
			"length": 40,
			"enrollmentOpeningAt":"2017-09-10T00:00:00.000Z",
			"enrollmentClosingAt":"2017-09-17T00:00:00.000Z",
			"participantsList":[255],
			"routes":["Route1"]

		}

		beforeEach(function(done){

			request.post('/api/auth/register')
				.send(userJson)
				.end(function(err,resUser){

					userJson.id = resUser.body.userId;
					userJson.jwtToken = "JWT " + resUser.body.jwtToken;
					eventJson.organizerId = userJson.id;

					Event.create(organizerId,eventJson,function(err,event){
						eventJson.id = event._id;
						done();
					});
				});
		});


        it('it should NOT update the event if it is not the organizer', function (done) {

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

						var newFields = {
                                    name: 'newName'
                                };

						request.put('/api/events/' + eventJson.id)
							.send(newFields)
							.set('Authorization', 'JWT ' + user2.jwtToken)
							.end(function (req, res) {
								expect(res.status).to.be.eql(401);
								expect(res.body).to.be.an('object');
								expect(res.body.errors).to.not.be.eql(null);

								done();

                            });
                    });
		});

        it('should NOT update the id of the event', function (done) {

			let newFields = {
				_id: mongoose.Types.ObjectId()
				};

			request.put('/api/events/' + eventJson.id)
				.set('Authorization', userJson.jwtToken)
				.send(newFields)
				.end(function (req, res) {
					//authorization error
					expect(res.status).to.be.eql(401);
					expect(res.body).to.be.an('object');
					expect(res.body.errors).to.not.be.eql(null);

					done();

                });
        });

        it('should NOT update without login', function (done) {

			var newFields = {
				name: 'newName'
				};

			request.put('/api/events/' + eventJson.id)
				.send(newFields)
				.end(function (req, res) {
					expect(res.status).to.be.eql(401);
					expect(res.body).to.be.an('object');
					expect(res.body.errors).to.not.be.eql(null);

					done()
                    });
		});

        it('it should update the name of the event', function (done) {

			var newFields = {
				name: 'newName'

				};

			request.put('/api/events/' + eventJson.id)
				.set('Authorization', userJson.jwtToken)
				.send(newFields)
				.end(function (req, res) {
					//console.log(res.body);
					expect(res.status).to.be.eql(200);
					expect(res.body).to.be.an('object');
					expect(res.body.errors).to.be.eql(undefined);
					expect(res.body.event.name).to.be.eql(newFields.name);

					done()
                });
        });
	});

    describe('DELETE /events', function () {

		var userJson = {
			"name": "User",
			"surname": "Surname",
			"email": "email@domain.it",
			"password": "AVeryStrongPasword",
			"id":'',
			"jwtToken":''
		};

		var eventJson ={
			"id":'',
			"name":"TestEvent",
			"organizerId": '',
			"type":"running",
			"description":"Blablabla",
			"country":"MyCountry",
			"city":"MyCity",
			"startingDate":"2017-09-23",
			"startingTime":"12:00:00.000",
			"maxDuration":150,
			"length": 40,
			"enrollmentOpeningAt":"2017-09-10T00:00:00.000Z",
			"enrollmentClosingAt":"2017-09-17T00:00:00.000Z",
			"participantsList":[255],
			"routes":["Route1"]

		}

		beforeEach(function(done){

			request.post('/api/auth/register')
				.send(userJson)
				.end(function(err,resUser){

					userJson.id = resUser.body.userId;
					userJson.jwtToken = "JWT " + resUser.body.jwtToken;
					eventJson.organizerId = userJson.id;

					Event.create(organizerId,eventJson,function(err,event){
						eventJson.id = event._id;
						done();
					});
				});
		});



        it('it should NOT delete an event without login', function (done) {

			request.delete('/api/events/' + eventJson.id)
				.end(function (req, res) {
					expect(res.status).to.be.eql(401);
					expect(res.body).to.be.an('object');
					expect(res.body.errors).to.not.be.eql(null);

					done()
                    });
            });
        });

        it('it should NOT delete the event if it is not the organizer', function (done) {

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

					request.delete('/api/events/' + eventJson.id)
						.set('Authorization', 'JWT ' + user2.jwtToken)
						.end(function (req, res) {
							expect(res.status).to.be.eql(401);
							expect(res.body).to.be.an('object');
							expect(res.body.errors).to.not.be.eql(null);

							done()
                        });
                });
        });

        it('it should delete the event', function (done) {

			request.delete('/api/events/' + eventJson.id)
				.set('Authorization', 'JWT ' + userJson.jwtToken)
				.end(function (req, res) {
					expect(res.status).to.be.eql(200);
					expect(res.body).to.be.an('object');
					expect(res.body.errors).to.be.eql(undefined);
					expect(res.body.event).to.be.an('object');

					done()
                });
        });

    describe('GET /organizedEvents',function(){

        var firstUser = {
            "userId":'',
            "email":"firstUser@user.com",
            "password":'firstUser',
            "name":"First",
            "surname":"User",
            "role":"user",
            "userToken":''
        };

        var secondUser = {
            "userId":'',
            "email":'secondUser@user.com',
            "password":'secondUser',
            "name":'Second',
            "surname":'User',
            "role":'user',
            "userToken":''
        };

        //login users
        before (function(done){
            request.post('/api/auth/register')
                .send(firstUser)
                .end(function(err,res){
                    firstUser.userToken = 'JWT ' + res.body.jwtToken;
                    firstUser.userId = res.body.userId;

                    request.post('/api/auth/register')
                        .send(secondUser)
                        .end(function(err,res){
                           secondUser.userToken = 'JWT ' + res.body.jwtToken;
                           secondUser.userId = res.body.userId;
                           done();
                        });
                });
        });

        it('should return 2 user events',function(done) {

            //console.log("Usertoken " + firstUser.userToken + " userId " + firstUser.userId);
            var myEvent = new Event({
                "name": "First event I created",
                "organizerId": firstUser.userId,
                "type": "running",
                "description": "Blablabla",
                "country": "MyCountry",
                "city": "MyCity",
                "startingDate":"2017-09-23",
                "startingTime": "12:00:00.000",
                "maxDuration": 150,
                "length": 40,
                "enrollmentOpeningAt": "2017-09-10T00:00:00.000Z",
                "enrollmentClosingAt": "2017-09-17T00:00:00.000Z",
                "participantsList": [255],
                "routes": ["Route1"]
            });

            var alsoMyEvent = new Event({
                "name": "Second event I created",
                "organizerId": firstUser.userId,
                "type": "running",
                "description": "Blablabla",
                "country": "MyCountry",
                "city": "MyCity",
                "startingDate":"2017-09-23",
                "startingTime": "12:00:00.000",
                "maxDuration": 150,
                "length": 40,
                "enrollmentOpeningAt": "2017-09-10T00:00:00.000Z",
                "enrollmentClosingAt": "2017-09-17T00:00:00.000Z",
                "participantsList": [255],
                "routes": ["Route1"]
            });

            var notMyEvent = new Event({
                "name": "Not my event",
                "organizerId": secondUser.userId,
                "type": "running",
                "description": "Blablabla",
                "country": "MyCountry",
                "city": "MyCity",
                "startingDate":"2017-09-23",
                "startingTime": "12:00:00.000",
                "maxDuration": 150,
                "length": 40,
                "enrollmentOpeningAt": "2017-09-10T00:00:00.000Z",
                "enrollmentClosingAt": "2017-09-17T00:00:00.000Z",
                "participantsList": [255],
                "routes": ["Route1"]
            });

            //create 3 events
            myEvent.save(function() {
                notMyEvent.save(function() {
                    alsoMyEvent.save(function() {
                        request.get('/api/events/' + firstUser.userId + '/organizedEvents')
                            .set('Authorization', firstUser.userToken)
                            .end(function (err, res) {
                                var resultedEvents = res.body.events;

                               // console.log(resultedEvents);
                                expect(resultedEvents.length).to.be.eql(2);
                                for (var i in resultedEvents){
                                    expect(resultedEvents[i].organizerId).to.be.eql(firstUser.userId);
                                    expect(resultedEvents[i].name).not.to.be.eql(notMyEvent.name);
                                }
                                done();
                            });
                    });
                });
            });
        });

    });

	describe ('route APIs',function(done){

		var userCreatorObject = {
            "email":"firstUser@user.com",
            "password":'firstUser',
            "name":"First",
            "surname":"User",
            "jwtToken":""
		};

		var userNotCreatorObject = {
            "email":"secondUser@user.com",
            "password":'secondUserUser',
            "name":"Second",
            "surname":"User",
            "jwtToken":""
		};

		var createdEventObject = {
		    "id":"",
			"name": "First event I created try number 2",
			"organizerId": '',
			"type": "running",
			"description": "Blablabla",
			"country": "MyCountry",
			"city": "MyCity",
			"startingDate":"2017-09-23",
			"startingTime": "12:00:00.000",
			"maxDuration": 150,
			"length": 40,
			"enrollmentOpeningAt": "2017-09-10T00:00:00.000Z",
			"enrollmentClosingAt": "2017-09-17T00:00:00.000Z",
			"participantsList": [255],
			"routes": ["Route1"]
		};
		//Login 2 users and create one event
		beforeEach(function(done) {
            request.post('/api/auth/register')
                .send(userCreatorObject)
                .end(function (err1, res1) {

                    userCreatorObject.userToken = "JWT " + res1.body.jwtToken;
                    createdEventObject.organizerId = res1.body.userId;
                    var createdEvent = new Event(createdEventObject);
                    createdEvent.save(function (err, event) {
                        createdEventObject.id = event._id;
                        request.post('/api/auth/register')
                            .send(userNotCreatorObject)
                            .end(function (err2, res2) {
                                userNotCreatorObject.userToken = "JWT " + res2.body.jwtToken;
                                done();
                            });

                    });


                });
        });

		var coordinates = [{
		    lat:20,
            lng:5
        },
            {
                lat:15,
                lng:10
            },{
		        lat:50,
                lng:25
            }];

		//Before each function user creator should create function
		beforeEach(function(done){
		    request.post('/api/events/' + createdEventObject.id + "/route")
                .set('Authorization',userCreatorObject.userToken)
                .send({coordinates:coordinates})
                .end(function(err,res){
                    done();
                });
        });

		//check for some more useful tests
        it ('should get an created route',function(done){
            request.get('/api/events/' + createdEventObject.id + "/route")
                .end(function(err,res) {
                    expect(res.body).not.to.be.eql(null);
					expect(res.body).to.have.property('coordinates');
					expect(res.body.coordinates).not.to.be.eql(null);
					//console.log(res.body.coordinates);
                    done();
                });
            });

        it('should allow user to update routes',function(done){
            request.put('/api/events/' + createdEventObject.id + '/route')
                .set('Authorization',userCreatorObject.userToken)
                .send({coordinates:[{lat:-1,lng:-1},{lat:6,lng:3},{lat:11,lng:5}]})
                .end(function(err,res){
					expect(res.status).to.be.eql(200);
                    expect(res.body).not.to.be.eql(null);
					//console.log(res.body.coordinates);
					done();
                });
        });

		it('should allow user to delete route',function(done){
			request.delete('/api/events/' + createdEventObject.id + '/route')
				.set('Authorization',userCreatorObject.userToken)
				.end(function(err,res){
					console.log(res.body.coordinates);
					Route.findByEventId(createdEventObject.id,function(err,route){
						expect(route).to.be.eql(null);
						done();
					});
				});
		});

		it('should not allow user to update route if he is not creator',function(done){
			     request.put('/api/events/' + createdEventObject.id + '/route')
                .set('Authorization',userNotCreatorObject.userToken)
                .send({coordinates:[{lat:-1,lng:-1},{lat:6,lng:3},{lat:11,lng:5}]})
                .end(function(err,res){
                    expect(res.status).to.be.eql(401);
                    done();
                });
		});

		it('should not allow user to delete route if he is not creator',function(done){
						request.delete('/api/events/' + createdEventObject.id + '/route')
				.set('Authorization',userNotCreatorObject.userToken)
				.end(function(err,res){
					Route.findByEventId(createdEventObject.id,function(err,route){
						expect(route).not.to.be.eql(null);
						done();
					});
				});
		});
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
        "startingDate":"2017-01-01",
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
        })
    }
}
