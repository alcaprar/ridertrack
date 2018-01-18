//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
var chai = require('chai');
var server = require('../../../server');
var uuid = require('uuid');
var supertest = require('supertest');

global.server = server;
global.uuid = uuid;
global.expect = chai.expect;
global.request = supertest(server);

var User = require('../../models/user');
var Event = require('../../models/event');
var Positions = require('../../models/positions');
var Enrollment = require('../../models/enrollment');
var Ranking = require('../../models/ranking');
var Route = require('../../models/route');


describe('Position API tests', function () {

    beforeEach(function (done) {
        Event.remove({}, function () {
            Enrollment.remove({}, function () {
                Positions.remove({}, function () {
                    Route.remove({}, function () {
                        User.remove({}, function (err) {
                            done()
                        })
                    })
                })
            })
        });
    });

    describe('POST /positions', function () {
        it('it should send a position', function (done) {
            // create an user
            var user = {
                name: 'Name',
                surname: 'Surname',
                email: 'email@email.it',
                password: 'password'
            };
            request.post('/api/auth/register')
                .end(function (err, res) {
                    user.jwtToken = res.body.jwtToken;
                })
        });
    });

    // it closes the server at the end
    after(function (done) {
        server.close();
        done()
    });
});
