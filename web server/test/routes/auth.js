//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
var chai = require('chai');
var server = require('../../index');
var uuid = require('uuid');
var supertest = require('supertest');

var Browser = require('zombie');
var path = require('path');

global.server = server;
global.uuid = uuid;
global.expect = chai.expect;
global.request = supertest(server);

var User = require('../../models/user');


describe('User API tests', function () {
    // this will run before every test to clear the database
    // TODO clear database

    before(function (done) {
        User.remove({}, function (err) {
            done()
        })
    });

    describe('POST /auth/register', function () {
        it('it should NOT register an organizer with no email', function (done) {
            let user = {
                name: 'Organizer2Name',
                surname: 'Organizer2Surname',
                password: 'aaa',
                role: 'organizer'
            };

            request.post('/api/auth/register')
                .send(user)
                .end(function (err, res) {
                    expect(res.status).to.be.eql(400);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('errors');

                    done()
                })
        });

        it('it should NOT register an organizer with no password', function (done) {
            let user = {
                name: 'Organizer2Name',
                surname: 'Organizer2Surname',
                email: "test@test.it",
                role: 'organizer'
            };

            request.post('/api/auth/register')
                .send(user)
                .end(function (err, res) {
                    expect(res.status).to.be.eql(400);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('errors');

                    done()
                })
        });

        it('it should NOT register an organizer with no role', function (done) {
            let user = {
                name: 'Organizer2Name',
                surname: 'Organizer2Surname',
                email: "test@test.it"
            };

            request.post('/api/auth/register')
                .send(user)
                .end(function (err, res) {
                    expect(res.status).to.be.eql(400);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('errors');

                    done()
                })
        });


        it('it should register an organizer and receive back a jwt token', function (done) {
            let user = {
                name: 'Organizer2Name',
                surname: 'Organizer2Surname',
                email: 'organizer2@test.it',
                password: 'aaa',
                role: 'organizer'
            };

            request.post('/api/auth/register')
                .send(user)
                .end(function (err, res) {
                    expect(res.status).to.be.eql(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.not.have.property('errors');
                    expect(res.body).to.have.property('user');
                    expect(res.body).to.have.property('jwtToken');
                    expect(res.body.jwtToken).to.not.eql('');

                    organizerId = res.body.user._id;

                    done()
                })
        });
    });

    describe('POST /auth/login', function () {
        it('it should NOT login because credentials are wrong', function (done) {
            let user = {
                email: 'organizear2@test.it',
                password: 'aaaa'
            };

            request.post('/api/auth/login')
                .send(user)
                .end(function (err, res) {
                    console.log(res.status)
                    expect(res.status).to.be.eql(400);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('errors');

                    done()
                })
        });
        
        it('it should login and get a jwtToken', function (done) {
            let user = {
                email: 'organizer2@test.it',
                password: 'aaa'
            };

            request.post('/api/auth/login')
                .send(user)
                .end(function (err, res) {
                    console.log(res.body);
                    expect(res.status).to.be.eql(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.not.have.property('errors');
                    expect(res.body).to.have.property('user');
                    expect(res.body).to.have.property('jwtToken');
                    expect(res.body).to.have.property('expiresIn');
                    expect(res.body.jwtToken).to.not.eql('');
                    expect(res.body.expiresIn).to.be.above(0)

                    done()
                })
        });
    });

    // it closes the server at the end
    after(function (done) {
        server.close();
        done()
    });
});

describe('Public authentication service API test',function(){

    var browser = new Browser();
    var events = [];
    beforeEach(function(done){

        done()
    });

    before(function(done) {
        User.remove({}, function (err) {
            done()
        });
    });

    before(function(done){
        browser.on('request', function(request) {
            events.push([request.url]);
        });
        browser.on('redirect', function(request, response) {
            events.push([request.url, response.url, response.status]);
        });
        browser.on('response', function(request, response) {
            events.push([request.url, response.url, response.status]);
        });
        done()
    });

    it('should login with google account',function(done){

        done();
    });

    it('should login with facebook account',function(done){
        done();
    });

    // it closes the server at the end
    after(function (done) {
        server.close();
        done()
    });

});