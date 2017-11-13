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

var User = require('../../models/user');


describe('User API tests', function () {
    // this will run before every test to clear the database
    // TODO clear database

    before(function (done) {
        User.remove({}, function (err) {
            done()
        })
    });

    describe('GET /users', function () {
        it('it should return an empty list since the database is empty', function (done) {
            request.get('/api/users')
                .end(function (err, res) {
                    expect(res.status).to.be.eql(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body.users).to.be.an('array');
                    expect(res.body.users.length).to.be.eql(0);
                    done();
                })
        })
    });

    describe('POST /users', function () {
        it('it should NOT add a new user because some fields are missing', function (done) {
            let user = {
                email: 'test@test.it',
                password: 'aaa'
            };

            request.post('/api/users')
                .send(user)
                .end(function (err, res) {
                    expect(res.status).to.be.eql(400);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('errors');
                    done()
                })
        });
        

        it('it should return an empty list since the database is empty', function (done) {
            request.get('/api/users')
                .end(function (err, res) {
                    expect(res.status).to.be.eql(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body.users).to.be.an('array');
                    expect(res.body.users.length).to.be.eql(0);
                    done();
                })
        });

        it('it should add a user', function (done) {
            let user = {
                name: 'name',
                surname: 'surname',
                email: 'test@test.it',
                password: 'aaa'
            };

            request.post('/api/users')
                .send(user)
                .end(function (err, res) {
                    expect(res.status).to.be.eql(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.not.have.property('errors');
                    expect(res.body).to.have.property('user');
                    done()
                })
        });

        it('it should return a list with one object', function (done) {
            request.get('/api/users')
                .end(function (err, res) {
                    expect(res.status).to.be.eql(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body.users).to.be.an('array');
                    expect(res.body.users.length).to.be.eql(1);
                    done();
                })
        });
        
        var organizerId;

        it('it should add an user', function (done) {
            let user = {
                name: 'organzer1',
                surname: 'organzer1Sur',
                email: 'organzer1@test.it',
                password: 'aaa'
            };

            request.post('/api/users')
                .send(user)
                .end(function (err, res) {
                    expect(res.status).to.be.eql(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.not.have.property('errors');
                    expect(res.body).to.have.property('user');

                    organizerId = res.body.user._id;

                    done()
                })
        });

        it('it should return a list with two object', function (done) {
            request.get('/api/users')
                .end(function (err, res) {
                    expect(res.status).to.be.eql(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body.users).to.be.an('array');
                    expect(res.body.users.length).to.be.eql(2);
                    done();
                })
        });

        it('it should return a list with one object', function (done) {
            request.get('/api/users?name=organzer1')
                .end(function (err, res) {
                    expect(res.status).to.be.eql(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body.users).to.be.an('array');
                    expect(res.body.users.length).to.be.eql(1);
                    done();
                })
        });

        it('it should returns ok even if we changed to ask nothing', function (done) {
            let user = {};

            request.put('/api/users/' + organizerId)
                .send(user)
                .end(function (err, res) {
                    expect(res.status).to.be.eql(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.not.have.property('errors');
                    expect(res.body).to.have.property('user');
                    done()
                })
        });

        it('it should update the name of an user', function (done) {
            let user = {
                name: 'organzer2'
            };
            
            request.put('/api/users/' + organizerId)
                .send(user)
                .end(function (err, res) {
                    expect(res.status).to.be.eql(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.not.have.property('errors');
                    expect(res.body).to.have.property('user');
                    done()
                })
        });
        

        it('it should NOT update the email of an user', function (done) {
            let user = {
                email: 'email'
            };

            request.put('/api/users/' + organizerId)
                .send(user)
                .end(function (err, res) {
                    expect(res.status).to.be.eql(400);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('errors');
                    done()
                })
        });

        it('it should NOT update the hash and salt of an user', function (done) {
            let user = {
                hash: 'hash',
                salt: 'salt'
            };

            request.put('/api/users/' + organizerId)
                .send(user)
                .end(function (err, res) {
                    expect(res.status).to.be.eql(400);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('errors');
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