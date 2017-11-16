var express = require('express');
var router = express.Router();
var config = require('../config');

var User = require('../models/user');

/**
 * It returns the list of all the users.
 * It accepts query params for filtering the users: email, name, surname.
 */
router.get('/', function (req, res) {
    var conditions = {};
    
    // check for query parameters
    // if they are present, add them to the conditions
    if(req.query.email){
        conditions.email = req.query.email
    }
    if(req.query.name){
        conditions.name = req.query.name
    }
    if(req.query.surname){
        conditions.surname = req.query.surname
    }
    
    User.find(conditions, function (err, user) {
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

/**
 * It return the details of the requested userId.
 */

router.get('/:userId', function (req, res) {
    User.findByUserId(req.params.userId, function (err, user) {
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
                message: 'User successfully created',
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
                message: 'User successfully updated',
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
                message: 'User successfully deleted'
            })
        }
    })
});

module.exports = router;