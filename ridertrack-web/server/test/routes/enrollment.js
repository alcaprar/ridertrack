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

var Enrollment = require('../../models/enrollment');
var User = require('../../models/user');
var Event = require('../../models/event');


describe('Enrollment API tests', function () {
    // this will run before every test to clear the database
    // TODO clear database

    beforeEach(function (done) {
        Enrollment.remove({}, function (err) {
            done()
        })
    });

    describe('POST /enrollments', function () {
        it('it should NOT add a new enrollment because eventId field is missing', function (done) {
            let enrollment =  new Enrollment({
                userId :"userId",
                additionalInfo : Object,
                trackingSources: [],
                created_at: "2017-09-10T00:00:00.000Z",
                updated_at: "2017-09-10T00:00:00.000Z"
            });

            request.post('/api/enrollments')
                .send(enrollment)
                .end(function (err, res) {
                    expect(res.status).to.be.eql(400);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('errors');
                    done()
                })
        });


        it('it should add an enrollment', function (done) {
            let enrollment = new Enrollment({

                eventId: "eventId1",
                userId :"userId1",
                additionalInfo : Object,
                trackingSources: [Object],
                created_at: "2017-09-10T00:00:00.000Z",
                updated_at: "2017-09-10T00:00:00.000Z"
            });

            request.post('/api/enrollments')
                .send(enrollment)
                .end(function (err, res) {
                    expect(res.status).to.be.eql(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.not.have.property('errors');
                    expect(res.body).to.have.property('enrollment');
                    done()
                })
        });

        it('it should return a list with two object', function (done) {
            let enrollment1 = new Enrollment({
                eventId: "eventId1",
                userId :"first_user",
                additionalInfo : Object,
                trackingSources: [],
                created_at: "2017-09-10T00:00:00.000Z",
                updated_at: "2017-09-10T00:00:00.000Z"
            });
            let enrollment2 = new Enrollment( {
                eventId: "eventId1",
                userId :"second_user",
                additionalInfo : Object,
                trackingSources: [],
                created_at: "2017-09-10T00:00:00.000Z",
                updated_at: "2017-09-10T00:00:00.000Z"
            });
            enrollment1.save(function () {
                enrollment2.save(function () {
                    request.get('/api/enrollments')
                        .end(function (err, res) {
                            expect(res.status).to.be.eql(200);
                            expect(res.body).to.be.an('object');
                            expect(res.body.enrollments).to.be.an('array');
                            expect(res.body.enrollments.length).to.be.eql(2);
                            done();
                        })
                })
            });
        });

        it('it should return a list with one object', function (done) {
            let enrollment1 = new Enrollment({
                eventId: "eventId1",
                userId :"first_user",
                additionalInfo : Object,
                trackingSources: [],
                created_at: "2017-09-10T00:00:00.000Z",
                updated_at: "2017-09-10T00:00:00.000Z"
            });
            let enrollment2 = new Enrollment( {
                eventId: "eventId1",
                userId :"second_user",
                additionalInfo : Object,
                trackingSources: [],
                created_at: "2017-09-10T00:00:00.000Z",
                updated_at: "2017-09-10T00:00:00.000Z"
            });
            enrollment1.save(function () {
                enrollment2.save(function () {
                    request.get('/api/enrollments?userId=' + enrollment1.userId)
                        .end(function (err, res) {
                            expect(res.status).to.be.eql(200);
                            expect(res.body).to.be.an('object');
                            expect(res.body.enrollments).to.be.an('array');
                            expect(res.body.enrollments.length).to.be.eql(1);
                            done();
                        })
                })
            });

        });

        it('it should returns ok even if we changed to ask nothing', function (done) {
            let enrollment = new Enrollment({

                eventId: "eventId",
                userId :"userId",
                additionalInfo : Object,
                trackingSources: [],
                created_at: "2017-09-10T00:00:00.000Z",
                updated_at: "2017-09-10T00:00:00.000Z"
            });

            let change = {};

            enrollment.save(function () {
                request.put('/api/enrollments/' + enrollment._id)
                    .send(change)
                    .end(function (err, res) {
                        expect(res.status).to.be.eql(200);
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.not.have.property('errors');
                        expect(res.body).to.have.property('enrollment');
                        done()
                    })
            });
        });

        it('it should NOT update the eventId of an enrollment', function (done) {
            let enrollment = new Enrollment({

                eventId: "eventId",
                userId :"userId",
                additionalInfo : Object,
                trackingSources: [],
                created_at: "2017-09-10T00:00:00.000Z",
                updated_at: "2017-09-10T00:00:00.000Z"
            });

            let change = {
                eventId: 'new_eventId'
            };

            enrollment.save(function () {
                request.put('/api/enrollments/' + enrollment._id)
                    .send(change)
                    .end(function (err, res) {
                        expect(res.status).to.be.eql(400);
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('errors');
                        done()
                    })
            });
        });

    });
    describe('DELETE /enrollments', function () {
        // TODO Same test but without specifying one, should return an error, currently does not.
        it('it should add a new enrollment then delete it!', function (done) {
            var user = {
                "name": "userId1",
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
                        "name": "TestEvent",
                        "organizerId": user._id,
                        "type": "running",
                        "description": "Blablabla",
                        "country": "MyCountry",
                        "city": "MyCity",
                        "startingTime": "2017-09-23T12:00:00.000Z",
                        "maxDuration": 150,
                        "length": 40,
                        "enrollmentOpeningAt": "2017-09-10T00:00:00.000Z",
                        "enrollmentClosingAt": "2017-09-17T00:00:00.000Z",
                        "participantsList": [255],
                        "routes": ["Route1"]
                    };
                    request.post('/api/events')
                        .send(event)
                        .set('Authorization', 'JWT ' + user.jwtToken)
                        .end(function (err, res) {
                            expect(res.status).to.be.eql(200);
                            expect(res.body).to.be.an('object');
                            expect(res.body.event).to.be.an('object');
                            expect(res.body.event._id).to.not.be.eql('');

                            var enrollment = {
                                eventId: event.organizerId,
                                userId: user._id,
                                additionalInfo: Object,
                                trackingSources: [],
                                created_at: "2017-09-10T00:00:00.000Z",
                                updated_at: "2017-09-10T00:00:00.000Z"
                            };

                            request.post('/api/enrollments')
                                    .send(enrollment)
                                    .set('Authorization', 'JWT ' + user.jwtToken)
                                    .end(function (err, res) {
                                        expect(res.status).to.be.eql(200);
                                        expect(res.body).to.be.an('object');
                                        expect(res.body).to.not.have.property('errors');
                                        expect(res.body).to.have.property('enrollment');


                                        request.delete('/api/enrollments/?eventId='+event.organizerId + '\&userId=' + user._id)
                                            .send(enrollment)
                                            .set('Authorization', 'JWT ' + user.jwtToken)
                                            .end(function (err, res) {
                                                expect(res.status).to.be.eql(200);
                                                expect(res.body).to.be.an('object');
                                                expect(res.body).to.not.have.property('errors');
                                                expect(res.body).to.have.property('deleted_enrollment');
                                                done();
                                            })
                                    })
                        });
                });
        });
    });


    // it closes the server at the end
    after(function (done) {
        server.close();
        done()
    });
});