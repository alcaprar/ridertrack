var jwt = require('jsonwebtoken');
var config = require('../config');

var User = require('../models/user');
var Event = require('../models/event');

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
     * It checks if the user that requested the endpoint is the organizer of the event.
     * It MUST be called after hasValidToken.
     * If the checks passes, it attaches to the req variable the event object.
     * @param req
     * @param res
     * @param next
     */
    isOrganizer: function (req, res, next) {
        var userId = req.userId;
        var eventId = req.params.eventId;

        // return an error if the userId is not set
        if(!userId){
            console.log('[middleware][isOrganizer] userId not set. he/she might not be logged.');
            return res.status(401).send({
                errors: [{message: 'Not authorized.'}]
            })
        }

        // return an error if the eventId is not set
        if(!eventId){
            console.log('[middleware][isOrganizer] eventId not passed. the route might not accept it.');
            return res.status(400).send({
                errors: [{message: 'Error while controlling the permissions.'}]
            })
        }

        // retrieve the event
        Event.findByEventId(eventId, function (err, event) {
            if(err){
                console.log('[middleware][isOrganizer] db error while retrieving the event.', err);
                return res.status(400).send({
                    errors: [{message: 'Error while controlling the permissions.'}]
                })
            }

            if(!event){
                console.log('[middleware][isOrganizer] event not found.');
                return res.status(400).send({
                    errors: [{message: 'Error while controlling the permissions.'}]
                })
            }

            // check if the user is the organizer
            if(userId === event.organizerId){
                req.event = event;
                return next()
            }else{
                console.log('[middleware][isOrganizer] the user is not the organizer', userId, event.organizerId);
                return res.status(401).send({
                    errors: [{message: 'Not authorized.'}]
                })
            }
        })
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
