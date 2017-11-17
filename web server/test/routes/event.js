//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
var chai = require('chai');
var server = require('../../index');
var uuid = require('uuid');
var supertest = require('supertest');
var path = require('path')

global.server = server;
global.uuid = uuid;
global.expect = chai.expect;
global.assert = chai.assert;
global.request = supertest(server);

var Event = require('../../models/event');
var User = require('../../models/user');

describe('Event API tests', function () {
    // this will run before every test to clear the database
    // TODO clear database

    before(function (done) {
        Event.remove({},function(){
        })
        User.remove({},function(){
        })
        done();
    });

    var userCreator = {
        "id":"",
        "email":"testUser@gmail.com",
        "name":"User",
        "surname":"Creatpr",
        "password":"creator",
        "role":"user",
        "jwtToken":""
    };

    var userNotCreator= {
        "id":"",
        "email":"testUser2@gmail.com",
        "name":"User",
        "surname":"NotCreator",
        "password":"notcreator",
        "role":"user",
        "jwtToken":""
    };

    var userToken = "";

    var event = {
        "name":"TestEvent",
        "eventId":"",
        "organizerId":"",
        "type":"Running",
        "description":"Blablabla",
        "country":"MyCountry",
        "city":"MyCity",
        "startingTime":"2017-09-23T12:00:00.000Z",
        "maxDuration":150,
        "enrollmentOpeningAt":"2017-09-10T00:00:00.000Z",
        "enrollmentClosingAt":"2017-09-17T00:00:00.000Z",
        //It seems I can't create event without specifying at least one participantId and route
        "participantsList":[255],
        "routes":["Route1"]
    };


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
        })
    });


    //Testing the endpoint to the events
    describe('POST /events', function () {

        before(function(done) {
            var userPost ={
                "id":"",
                "email":"testUser@gmail.com",
                "name":"Mariano",
                "surname":"Etchart",
                "password":"password",
                "role":"user",
                "jwtToken":""
            };
            User.create(userPost, function (err, returnedUser) {
                userPost.id = returnedUser._id;

                //login and get userToken
                request.post('/api/auth/login').send(userPost)
                    .end(function (req, res) {
                        userPost.jwtToken = "JWT " + res.body.jwtToken;
                        console.log("Token that user has iiiiiis" + userPost.jwtToken);
                        done();
                    });
            });

        });



        it('it should create an event', function(done) {
                let eventPost =  new Event({
                    name: "London Marathon",
                    organizerId: "Organizer1",
                    type:"Marathon",
                    description: "Marathon in London",
                    country: "United Kingdom",
                    city: "London",
                    startingTime: "2011-05-26T07:56:00.123Z",
                    maxDuration: 15,
                    enrollmentOpeningAt: "2011-05-26T07:56:00.123Z",
                    enrollmentClosingAt:"2011-05-28T07:56:00.123Z",
                    participantsList: [],
                    logo: "logo",
                    routes: [],
                    created_at: "2011-05-28T07:56:00.123Z",
                    updated_at: "2011-05-28T07:56:00.123Z"
                });
                eventPost.save(function(err, eventPost){
                    request.post('/api/events')
                    .send(eventPost)
                    .end(function(err, res)  {
                        //expect(res.status).to.be.eql(200);
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.have.property('name');
                    expect(res.body).to.have.property('organizerId');
                    expect(res.body).to.have.property('type');
                    expect(res.body).to.have.property('description');
                    done();
                    });
            });
        });
    });



    //TODO update,delete operations can be tested here
    //Testing the endpoint to the events
    describe('delete and update of events', function () {

        //create an user function
        var userCreationFunc = function(user,next){
            User.create(user, function (err, returnedUser) {
                user.id = returnedUser._id;

                //login and get userToken
                request.post('/api/auth/login').send(user)
                    .end(function (req, res) {
                        user.jwtToken = "JWT " + res.body.jwtToken;
                       // console.log("Token that user has iiiiiis" + user.jwtToken);
                        next();
                    });
            });

        }
        //create an user before tests start
        before(function(done) {
            //I don't now how to use promises so for now it will be like this
            userCreationFunc(userCreator,function(){
                userCreationFunc(userNotCreator,done);
            });
        });

        describe('event creation',function() {
            //create new event first
            before(function (done) {
                User.findByEmail(userCreator.email, function (err, returnedUser) {
                    event.organizerId = returnedUser._id;
                    Event.create(event, function (err, newEvent) {
                        //console.log("New event: " + newEvent);
                        done();
                    });
                });
            });

            it('should update an event', function (done) {
                //changed maximumDuration
                var changedData = {
                    "maxDuration": 1500
                };
                Event.findByName(event.name,function(err,resEvent) {
                  //  console.log("Token user got is " + userCreator.jwtToken + "and eventId" + resEvent.id);

                    request.put('/api/events/' + resEvent.id)
                        .set('Authorization', userCreator.jwtToken)
                        .send(changedData)
                        .end(function (req, res) {
                            expect(res.status).to.be.eql(200);
                            Event.findByEventId(resEvent.id, function (err,eventResponse) {
                                expect(eventResponse.maxDuration).to.be.eql(1500);
                                done();
                            });
                        });
                });
            });

            it ('should not update an event',function(done){
               var changedData = {
                   "maxDuration":250
               } ;

                Event.findByName(event.name,function(err,resEvent) {
                    //  console.log("Token user got is " + userCreator.jwtToken + "and eventId" + resEvent.id);

                    request.put('/api/events/' + resEvent.id)
                        .set('Authorization', userNotCreator.jwtToken)
                        .send(changedData)
                        .end(function (req, res) {
                            expect(res.status).to.be.eql(401);
                            Event.findByEventId(resEvent.id, function (err,eventResponse) {
                                expect(eventResponse.maxDuration).to.be.eql(1500);
                                done();
                            });
                        });
                });

            });


            it ('should not delete an event',function(done){
                Event.findByName(event.name,function(err,resEvent) {
                      //console.log("Token user got is " + userNotCreator.jwtToken + "and eventId" + resEvent.id);

                    request.delete('/api/events/' + resEvent.id)
                        .set('Authorization', userNotCreator.jwtToken)
                        .end(function (req, res) {
                            expect(res.status).to.be.eql(401);
                            Event.findByEventId(resEvent.id, function (err,eventResponse) {
                                expect(eventResponse).to.not.equal(null);
                                done();
                            });
                        });
                });
            });

            //for now this should fail
            it ('should delete an event',function(done){
                Event.findByName(event.name,function(err,resEvent) {
                    //  console.log("Token user got is " + userCreator.jwtToken + "and eventId" + resEvent.id);

                    request.delete('/api/events/' + resEvent.id)
                        .set('Authorization', userCreator.jwtToken)
                        .end(function (req, res) {
                            expect(res.status).to.be.eql(200);
                            Event.findByEventId(resEvent.id, function (err,eventResponse) {
                                console.log("Ispiši eventResponse");
                                expect(eventResponse).to.equal(null);
                                done();
                            });
                        });

                });
            });

        });

        after(function(done){
            done();
        });

        });

    // it closes the server at the end
    after(function (done) {
        server.close();
        done();
    })
});

