var authMiddlewares = {
    /**
     * It checks if the token passed along with the request is valid.
     */
    hasValidToken: function (req, res, next) {
        
    },
    
    /**
     * It checks if the logged user has enough permission.
     * @param roles array of accepted roles for this route.
     * @returns {Function}
     */
    hasRole: function (roles) {
        return function(req, res, next) {
            if (roles.indexOf(req.user.role) > -1){
                return next()
            }else{
                return res.send(401, 'Not enough permission.');
            }
        }
    }
};

module.exports = authMiddlewares;