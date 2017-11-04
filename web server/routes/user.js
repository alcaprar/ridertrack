var express = require('express');
var router = express.Router();

var User = require('../models/user');

router.get('/user', function (req, res) {
    var username = 'a';
    var aaaa = 'aaaaaa';
    User.get(username, function (err, user) {
        if(err){
            res.send("test1")
        }else{
            res.send("test2");
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



module.exports = router;