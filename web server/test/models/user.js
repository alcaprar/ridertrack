//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
var chai = require('chai');
var uuid = require('uuid');
var supertest = require('supertest');

global.uuid = uuid;
global.expect = chai.expect;

var User = require('../../models/user');

describe('User model test', function () {
    // this will run before every test to clear the database
    // TODO clear database
    before(function (done) {
        done()
    });

    it('should be invalid if name is empty', function(done) {
        var user = new User();

        user.validate(function(err) {
            expect(err.errors.name).to.exist;
            done();
        });
    });
});