var jwt = require('jsonwebtoken');
var config = require('../config');

var User = require('../models/user');

var authMiddlewares = {
    /**
     * It checks if the token passed along with the request is valid.
     * If the token is valid, it calls the next function.
     * If not it sends a 401 response.
     */
    hasValidToken: function (req, res, next) {
        var authHeader = req.get('Authorization');
        if(typeof authHeader === 'undefined'){
            return res.status(401).send({
                errors: ['Unauthorized']
            })
        }else{
            if(authHeader.split(' ')[0] === 'JWT'){
                // check token if it is valid
                jwt.verify(authHeader.split(' ')[1], config.passport.jwt.jwtSecret, function (err, decoded) {
                    if(err){
                        return res.status(401).send({
                            errors: [err.message]
                        })
                    }
                    req.userId = decoded.id;
                    return next()
                })
            }else{
                // invalid authorization header
                return res.status(401).send({
                    errros: ['Invalid authorization header']
                })
            }
        }
    },
    
    /**
     * It checks if the logged user has enough permission.
     * @param role role to accept.
     * @returns {Function}
     */
    hasRole: function (role) {
        return function(req, res, next) {
            User.findById(req.userId, function (err, user) {
                if(user.role === role){
                    return next()
                }else{
                    return res.status(401).send({
                        errors: ['Unauthorized']
                    })
                }
            });
        }
    }
};

module.exports = authMiddlewares;