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
            request.get('/users')
                .end(function (err, res) {
                    expect(res.status).to.be.eql(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body.status).to.be.eql('success');
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

            request.post('/users')
                .send(user)
                .end(function (err, res) {
                    expect(res.status).to.be.eql(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('errors');
                    done()
                })
        });

        it('it should NOT add a user beacuse the role is not recognized', function (done) {
            let user = {
                name: 'name',
                surname: 'surname',
                email: 'test@test.it',
                password: 'aaa',
                role: 'fakerole'
            };

            request.post('/users')
                .send(user)
                .end(function (err, res) {
                    expect(res.status).to.be.eql(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('errors');
                    done()
                })
        });

        it('it should return an empty list since the database is empty', function (done) {
            request.get('/users')
                .end(function (err, res) {
                    expect(res.status).to.be.eql(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body.status).to.be.eql('success');
                    expect(res.body.users).to.be.an('array');
                    expect(res.body.users.length).to.be.eql(0);
                    done();
                })
        });

        it('it should add a participant', function (done) {
            let user = {
                name: 'name',
                surname: 'surname',
                email: 'test@test.it',
                password: 'aaa',
                role: 'participant'
            };

            request.post('/users')
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
            request.get('/users')
                .end(function (err, res) {
                    expect(res.status).to.be.eql(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body.status).to.be.eql('success');
                    expect(res.body.users).to.be.an('array');
                    expect(res.body.users.length).to.be.eql(1);
                    done();
                })
        });
        
        var organizerId;

        it('it should add an organizer', function (done) {
            let user = {
                name: 'organzer1',
                surname: 'organzer1Sur',
                email: 'organzer1@test.it',
                password: 'aaa',
                role: 'organizer'
            };

            request.post('/users')
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
            request.get('/users')
                .end(function (err, res) {
                    expect(res.status).to.be.eql(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body.status).to.be.eql('success');
                    expect(res.body.users).to.be.an('array');
                    expect(res.body.users.length).to.be.eql(2);
                    done();
                })
        });

        it('it should update the name of an organizer', function (done) {
            let user = {
                name: 'organzer2'
            };
            
            request.put('/users/' + organizerId)
                .send(user)
                .end(function (err, res) {
                    expect(res.status).to.be.eql(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.not.have.property('errors');
                    expect(res.body).to.have.property('user');
                    done()
                })
        });

        it('it should NOT update the role of an organizer', function (done) {
            let user = {
                role: 'participant'
            };

            request.put('/users/' + organizerId)
                .send(user)
                .end(function (err, res) {
                    expect(res.status).to.be.eql(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('errors');
                    done()
                })
        });

        it('it should NOT update the email of an organizer', function (done) {
            let user = {
                email: 'email'
            };

            request.put('/users/' + organizerId)
                .send(user)
                .end(function (err, res) {
                    expect(res.status).to.be.eql(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('errors');
                    done()
                })
        });

        it('it should NOT update the hash and salt of an organizer', function (done) {
            let user = {
                hash: 'hash',
                salt: 'salt'
            };

            request.put('/users/' + organizerId)
                .send(user)
                .end(function (err, res) {
                    expect(res.status).to.be.eql(200);
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

            request.post('/users/register')
                .send(user)
                .end(function (err, res) {
                    console.log(res.body);
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

    // it closes the server at the end
    after(function (done) {
        server.close();
        done()
    });
});