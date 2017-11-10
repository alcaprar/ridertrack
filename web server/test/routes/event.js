//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
var chai = require('chai');
var server = require('../../index');
var uuid = require('uuid');
var supertest = require('supertest');

global.server = server;
global.uuid = uuid;
global.expect = chai.expect;
global.request = supertest(server);

var User = require('../../models/event');


describe('Event API tests', function () {
    // this will run before every test to clear the database
    // TODO clear database

    before(function (done) {
        Event.remove({}, function (err) {
            done()
        })
    });

    //Testing the endpoint to the events
    describe('GET /events', function () {
        it('it should return an empty list since the database is empty', function (done) {
            request.get('/api/events')
                .end(function (err, res) {
                    expect(res.status).to.be.eql(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body.status).to.be.eql('success');
                    expect(res.body.events).to.be.an('array');
                    expect(res.body.events.length).to.be.eql(0);
                    done();
                })
        })
    });


    //Testing the endpoint to the events
    describe('PUT /events', function () {
        it('it should update the name of an event', function (done) {
            let event = {
                name: 'event2'
            };

            request.put('/api/event/')
                .send(event)
                .end(function (err, res) {
                    //expect(res.status).to.be.eql(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.not.have.property('errors');
                    //expect(res.body).to.have.property('event_num_update');
                    done()
                })
        });
    });


    // it closes the server at the end
    after(function (done) {
        server.close();
        done()
    })
});

