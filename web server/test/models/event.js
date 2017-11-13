//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
var chai = require('chai');
var uuid = require('uuid');
var supertest = require('supertest');

global.uuid = uuid;
global.expect = chai.expect;

var Event = require('../../models/event');


describe('Event model test', function () {
    // this will run before every test to clear the database
    // TODO clear database
    before(function (done) {
        Event.remove({}, function (err) {
            done()
        });
    });

    it('should be invalid if name is empty', function(done) {
        var event = new Event();

        event.validate(function(err) {
            expect(err).to.not.be.eql(null);
            done();
        });
    });
});