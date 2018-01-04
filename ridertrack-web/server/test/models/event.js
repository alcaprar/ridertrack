//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

var helpers = require('../helpers');

//Require the dev-dependencies
var chai = require('chai');
var uuid = require('uuid');
var supertest = require('supertest');
var mongoose = require('mongoose');

global.uuid = uuid;
global.expect = chai.expect;

var Event = require('../../models/event');
var User = require('../../models/user');


describe('Event model test', function () {
    /**
     * It is called before each test.
     * It cleans the database in order to have a clean state.
     */
    beforeEach(function (done) {
        helpers.cleanDatabase(function () {
            done()
        })
    });


    it('should NOT create an event', function(done) {
        var event = new Event();

        event.save(function(err, event) {
            expect(err).to.not.be.eql(null);
            done();
        });
    });
    /*

    it('it should create an event', function (done) {
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

        event.save(function (err) {
            expect(err).to.be.eql(null);
            done();
        })
    });

    it('it should NOT create an event without a name', function (done) {
        var event = new Event({
            "organizerId": mongoose.Types.ObjectId(),
            "type":"marathon",
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

        event.save(function (err) {
            expect(err).to.not.be.eql(null);
            done();
        })
    });

    it('it should NOT create an event without an organizerId', function (done) {
        var event = new Event({
            "name":"TestEvent",
            "type":"marathon",
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

        event.save(function (err) {
            expect(err).to.not.be.eql(null);
            done();
        })
    });

    it('it should NOT create an event with a not recognized type', function (done) {
        var event = new Event({
            "name":"TestEvent",
            "organizerId": mongoose.Types.ObjectId(),
            "type":"marathon",
            "description":"Blablabla",
            "country":"MyCountry",
            "city":"MyCity",
            "startingDate":"2017-09-23",
            "startingTime":"12:00:00.000Z",
            "maxDuration":150,
            "length": 40,
            "enrollmentOpeningAt":"2017-09-10T00:00:00.000Z",
            "enrollmentClosingAt":"2017-09-17T00:00:00.000Z",
            "participantsList":[255],
            "routes":["Route1"]
        });

        event.save(function (err) {
            expect(err).to.not.be.eql(null);
            done();
        })
    })*/
});
