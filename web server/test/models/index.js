//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
var chai = require('chai');
var uuid = require('uuid');
var supertest = require('supertest');

global.uuid = uuid;
global.expect = chai.expect;

describe('User model test', function () {
    // this will run before every test to clear the database
    // TODO clear database
    before(function (done) {
        done()
    });

    describe('it should export a module', function () {
        it('it should export a module', function (done) {
            var User = require('../../models/user');
            expect(User).to.be.ok;
            done()
        })        
    });
});