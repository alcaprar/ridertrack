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
global.assert = chai.assert;
global.request = supertest(server);

var Event = require('../../models/event');
var User = require('../../models/user');

describe('Event API tests', function () {

    var user1 = {
        "name": "User",
        "surname": "Surname",
        "email": "email@domain.it",
        "password": "AVeryStrongPasword"
    };

    var user2 = {
        "name": "User2",
        "surname": "Surname2",
        "email": "email2@domain.it",
        "password": "AVeryStrongPasword2"
    };


    var event1 = {
        "name":"TestEvent",
        "organizerId":"",
        "type":"Running",
        "description":"Blablabla",
        "country":"MyCountry",
        "city":"MyCity",
        "startingTime":"2017-09-23T12:00:00.000Z",
        "maxDuration":150,
        "enrollmentOpeningAt":"2017-09-10T00:00:00.000Z",
        "enrollmentClosingAt":"2017-09-17T00:00:00.000Z",
        "participantsList":[255],
        "routes":["Route1"]
    };

    var event2 = {
        "name":"TestEvent2",
        "organizerId":"",
        "type":"Running",
        "description":"Blablabla2",
        "country":"MyCountry2",
        "city":"MyCity2",
        "startingTime":"2017-09-23T12:00:00.000Z",
        "maxDuration": 150,
        "enrollmentOpeningAt":"2017-09-10T00:00:00.000Z",
        "enrollmentClosingAt":"2017-09-17T00:00:00.000Z",
        "participantsList":[255],
        "routes":["Route1"]
    };

    /**
     * It clears the Db and register one user.
     */
    before(function (done) {
        Event.remove({},function(){
            User.remove({},function(){
                // create the user
                request.post('/api/auth/register')
                    .send(user1)
                    .end(function (err, res) {
                        user1._id = res.body.userId;
                        user1.jwtToken = res.body.jwtToken;

                        event1.organizerId = user1._id;
                        event2.organizerId = user1._id;

                        request.post('/api/auth/register')
                            .send(user2)
                            .end(function (err, res) {
                                user2._id = res.body.userId;

                                done()
                            });
                    });
            });
        });
    });

    /**
     * It logins the user.
     */
    beforeEach(function (done) {
        request.post('/api/auth/login')
            .send({email: user1.email, password: user1.password})
            .end(function (err, res) {
                user1.jwtToken = res.body.jwtToken;

                request.post('/api/auth/login')
                    .send({email: user2.email, password: user2.password})
                    .end(function (err, res) {
                        user2.jwtToken = res.body.jwtToken;

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
            var ev = new Event(event1);
            ev.save(function () {
                event1._id = ev._id;
                request.get('/api/events')
                    .end(function (err1, res) {
                        expect(res.status).to.be.eql(200);
                        expect(res.body).to.be.an('object');
                        expect(res.body.events).to.be.an('array');
                        expect(res.body.events.length).to.be.eql(1);
                        done();
                    })
            })
        });

        it('it should return the event', function (done) {
            request.get('/api/events/' + event1._id)
                .end(function (err1, res) {
                    expect(res.status).to.be.eql(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body.event).to.be.an('object');
                    done();
                })
        });

        it('Search by city: it should return an array with one element', function (done) {
            
            request.get('/api/events?city=' + event1.city)
                .end(function (err1, res) {
                    expect(res.status).to.be.eql(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body.events).to.be.an('array');
                    expect(res.body.events.length).to.be.eql(1);
                    done();
                })
            
        });

        it('Search by name: it should return an array with one element', function (done) {

            request.get('/api/events?name=' + event1.name)
                .end(function (err1, res) {
                    expect(res.status).to.be.eql(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body.events).to.be.an('array');
                    expect(res.body.events.length).to.be.eql(1);
                    done();
                })

        });

        it('Search by type: it should return an array with one element', function (done) {

            request.get('/api/events?type=' + event1.type)
                .end(function (err1, res) {
                    expect(res.status).to.be.eql(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body.events).to.be.an('array');
                    expect(res.body.events.length).to.be.eql(1);
                    done();
                })

        });

        it('Search by country: it should return an array with one element', function (done) {

            request.get('/api/events?country=' + event1.country)
                .end(function (err1, res) {
                    expect(res.status).to.be.eql(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body.events).to.be.an('array');
                    expect(res.body.events.length).to.be.eql(1);
                    done();
                })
        })
    });

    describe('POST /events', function () {
        it('it should create an event', function (done) {
            request.post('/api/events')
                .send(event2)
                .set('Authorization', 'JWT ' + user1.jwtToken)
                .end(function (err, res) {
                    expect(res.status).to.be.eql(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body.event).to.be.an('object');
                    expect(res.body.event._id).to.not.be.eql('');

                    event2._id = res.body.event._id;
                    done();
                })
        });

        it('it should NOT create an event without login', function (done) {
            request.post('/api/events')
                .send(event2)
                .end(function (err, res) {
                    expect(res.status).to.be.eql(401);
                    expect(res.body).to.be.an('object');

                    done();
                })
        })
    });

    
    describe('PUT /events', function () {
        it('should update the name of the event', function (done) {
            let newFields = {
                name: 'New name of event2'
            };
            request.put('/api/events/' + event2._id)
                .send(newFields)
                .set('Authorization', 'JWT ' + user1.jwtToken)
                .end(function (req, res) {
                    expect(res.status).to.be.eql(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body.event).to.be.an('object');
                    expect(res.body.event.name).to.be.eql(newFields.name);

                    done()
                });
        });

        it('it should NOT update the event if it is not the organizer', function (done) {
            let newFields = {
                name: 'New name of event2'
            };
            request.put('/api/events/' + event2._id)
                .send(newFields)
                .set('Authorization', 'JWT ' + user2.jwtToken)
                .end(function (req, res) {
                    expect(res.status).to.be.eql(401);
                    expect(res.body).to.be.an('object');
                    expect(res.body.errors).to.be.not.eql(undefined);

                    done()
                });
        });

        it('should NOT update the id of the event', function (done) {
            let newFields = {
                _id: event2._id.replace('5', '1')
            };
            request.put('/api/events/' + event2._id)
                .send(newFields)
                .set('Authorization', 'JWT ' + user1.jwtToken)
                .end(function (req, res) {
                    expect(res.status).to.be.eql(400);
                    expect(res.body).to.be.an('object');
                    expect(res.body.errors).to.not.be.eql(null);

                    done()
                });
        });

        it('should NOT update without login', function (done) {
            let newFields = {
                _id: event2._id.replace('5', '1')
            };
            request.put('/api/events/' + event2._id)
                .send(newFields)
                .end(function (req, res) {
                    expect(res.status).to.be.eql(401);
                    expect(res.body).to.be.an('object');
                    expect(res.body.errors).to.not.be.eql(null);

                    done()
                });
        })
    });

    describe('DELETE /events', function () {
        it('it should NOT delete an event without login', function (done) {
            request.delete('/api/events/' + event2._id)
                .end(function (req, res) {
                    expect(res.status).to.be.eql(401);
                    expect(res.body).to.be.an('object');
                    expect(res.body.errors).to.not.be.eql(null);

                    done()
                });
        });

        it('it should NOT delete the event if it is not the organizer', function (done) {
            request.delete('/api/events/' + event2._id)
                .set('Authorization', 'JWT ' + user2.jwtToken)
                .end(function (req, res) {
                    expect(res.status).to.be.eql(401);
                    expect(res.body).to.be.an('object');
                    expect(res.body.errors).to.not.be.eql(null);

                    done()
                });
        });

        it('it should delete the event', function (done) {
            request.delete('/api/events/' + event2._id)
                .set('Authorization', 'JWT ' + user1.jwtToken)
                .end(function (req, res) {
                    expect(res.status).to.be.eql(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body.event).to.be.an('object');

                    done()
                });
        })
    });


    // it closes the server at the end
    after(function (done) {
        server.close();
        done();
    })
});

