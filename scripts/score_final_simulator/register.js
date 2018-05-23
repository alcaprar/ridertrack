var endpoints = require('./endpoints');
var http = require('http');

var mdl = {
    'register': function (name, surname, email, password, callback) {
        http.post({
            host: endpoints.host,
            path: endpoints.register,
            method: 'POST'
        }, function (res) {
            console.log(res)
        })
    }
};

mdl.register('ale', 'surname', 'ale@capra.it', 'prova');

module.exports = mdl;