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


describe('Auth API tests', function () {
    // this will run before every test to clear the database
    // TODO clear database

    beforeEach(function (done) {
        User.remove({}, function (err) {
            done()
        })
    });

    describe('POST /auth/register', function () {
        it('it should NOT register an user with no email', function (done) {
            let user = {
                name: 'Organizer2Name',
                surname: 'Organizer2Surname',
                password: 'aaa'
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

        it('it should NOT register an user with no password', function (done) {
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

        
        it('it should register an user and receive back a jwt token', function (done) {
            let user = {
                name: 'Organizer2Name',
                surname: 'Organizer2Surname',
                email: 'organizer2@test.it',
                password: 'aaa'
            };

            request.post('/api/auth/register')
                .send(user)
                .end(function (err, res) {
                    expect(res.status).to.be.eql(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.not.have.property('errors');
                    expect(res.body).to.have.property('userId');
                    expect(res.body).to.have.property('jwtToken');
                    expect(res.body.jwtToken).to.not.eql('');

                    organizerId = res.body.userId;

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
                    expect(res.status).to.be.eql(400);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('errors');

                    done()
                })
        });
        
        it('it should login and get a jwtToken', function (done) {
            let user = {
                name: 'TestName',
                surname: 'TestSurname',
                email: 'testuser@ridertrack.com',
                password: 'AVeryStrongPassword'
            };

            User.create(user, function () {
                console.log('User created');
                request.post('/api/auth/login')
                    .send({email: user.email, password: user.password})
                    .end(function (err, res) {
                        expect(res.status).to.be.eql(200);
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.not.have.property('errors');
                        expect(res.body).to.have.property('userId');
                        expect(res.body).to.have.property('jwtToken');
                        expect(res.body).to.have.property('expiresIn');
                        expect(res.body.jwtToken).to.not.eql('');
                        expect(res.body.expiresIn).to.be.above(0);

                        done()
                    })
            });
        });
    });

    // it closes the server at the end
    after(function (done) {
        server.close();
        done()
    });
});
