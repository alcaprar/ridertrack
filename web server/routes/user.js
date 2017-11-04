var express = require('express');
var router = express.Router();

var User = require('../models/user');

router.get('/user', function (req, res) {
    var username = 'a';
    User.get(username, function (err, user) {
        if(err){
            res.send({
                type: 'blabla',
                message: 'asdasdasd'
            })
        }else{
            res.send({
                username: 'blabla'
            });
        }
    })
});

router.post('/user', function (req, res) {
    var data = {};
    
    User.createUser(data, function (err, user) {
        if(err){
            res.send('User NOT created.')
        }else{
            res.send({
                
            })
        }
    })
});

router.delete('/user', function (req, res) {
    
});

module.exports = router;