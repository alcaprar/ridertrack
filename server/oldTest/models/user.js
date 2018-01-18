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
        User.remove({}, function (err) {
            done()
        });
    });

    /*it('should be invalid if name is empty', function(done) {
        var user = new User({
            surname: 'Caprarelli',
            email: 'ale.capra@hotmail.it'
        });

        user.validate(function(err) {
            expect(err).to.not.be.eql(null);
            done();
        });
    });

    it('should be invalid if surname is empty', function(done) {
        var user = new User({
            name: 'Alessandro',
            email: 'ale.capra@hotmail.it'
        });

        user.validate(function(err) {
            expect(err).to.not.be.eql(null);
            done();
        });
    });

    it('should be invalid if email is empty', function(done) {
        var user = new User({
            name: 'Alessandro',
            surname: 'Caprarelli'
        });

        user.validate(function(err) {
            expect(err).to.not.be.eql(null);
            done();
        });
    });

    it('should be valid if password is empty', function(done) {
        var user = new User({
            name: 'Alessandro',
            surname: 'Caprarelli',
            email: 'ale@hotmail.it'
        });

        user.validate(function(err) {
            expect(err).to.be.eql(null);
            done();
        });
    });

    it('should be valid if email is correct', function(done) {
        var user = new User({
            name: 'Alessandro',
            surname: 'Caprarelli',
            email: 'ale@hotmail.it'
        });

        user.validate(function(err) {
            expect(err).to.be.eql(null);
            done();
        });
    });

    it('should be NOT valid if email is NOT correct', function(done) {
        var user = new User({
            name: 'Alessandro',
            surname: 'Caprarelli',
            email: 'alehotmail.it'
        });

        user.validate(function(err) {
            expect(err).to.not.be.eql(null);
            done();
        });
    });

    it('should save a user', function (done) {
        var user = new User({
            name: 'Alessandro',
            surname: 'Caprarelli',
            email: 'alessandrocaprarelli@hotmail.it',
            password: 'aa'
        });

        user.save(function (err) {
            expect(err).to.be.eql(null);
            done();
        })

    });

    // useful for facebook authentication
    it('should save an user without a password', function (done) {
        var user = new User({
            name: 'a',
            surname: 'a',
            email: 'aaaa@aa.it'
        });

        user.save(function (err) {
            expect(err).to.be.eql(null);
            done();
        })

    })*/
});
