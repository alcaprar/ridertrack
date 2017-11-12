var express = require('express');
var router = express.Router();
var config = require('../config');

var User = require('../models/user');

/**
 * It returns the list of all the users
 */
router.get('/', function (req, res) {
    User.find({}, function (err, users) {
        if(err){
            res.send({
                status: 'failed',
                errors: err
            })
        }else{
            res.send({
                status: 'success',
                users: users
            })
        }
    })
});

/**
 * It return the details of the requested userId.
 */

router.get('/:userId', function (req, res) {
    User.findByUserId(req.params.userId, function (err, user) {
        if(err){
            res.send({
                status: 'failed',
                errors: err
            })
        }else{
            res.send({
                status: 'success',
                users: user
            })
        }
    })
});
//it returns the details of user which mail was requested
//i put user in front of mail because in other case it cannot distinct between mail and Id(it can be in header**to do)
router.get('/user/:mail', function (req, res) {

    User.findByEmail(req.params.mail, function (err, user) {
        if(err){
            res.send({
                status: 'failed',
                errors: err
            })
        }else{
            res.send({
                status: 'success',
                users: user
            })
        }
    })
});
/**
 * It creates the user passed in the body.
 * It returns the detail of the user just created.
 */
router.post('/', function (req, res) {
    User.create(req.body, function (err, user) {
        if(err){
            res.status(400).send({
                errors: err
            })
        }else{
            res.status(200).send({
                user: user
            })
        }
    });
});


/**
 * It updates the fields passed in the body of the given userId
 */
router.put('/:userId', function (req, res) {
    User.update(req.params.userId, req.body, function (err, user) {
        if(err){
            res.status(400).send({
                errors: err
            })
        }else{
            res.status(200).send({
                user: user
            })
        }
    })
});

/**
 * It deletes the given user by Id
 * Can be called only by the given user.
 * This will delete permanently everything related to it.
 */
router.delete('/:userId', function (req, res) {
    User.delete(req.params.userId, function (err, user) {
        if(err){
            res.status(400).send({
                errors: err
            })
        }else{
            res.status(200).send({
                users: user
            })
        }
    })
});

module.exports = router;