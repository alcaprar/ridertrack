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



describe('API tests', function () {
    // this will run before every test to clear the database
    // TODO clear database

    describe('GET /', function () {
        it('it should return the home page', function (done) {
            request.get('/')
                .end(function (err, res) {
                    expect(res.status).to.eql(200);
                    done();
                })
        })
    });
    
    // it stops the server and finishes the tests
    server.close();
});