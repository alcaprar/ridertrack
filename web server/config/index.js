var config = {
    port: 5000,
    mongodb: {
        uri: 'mongodb://localhost/my_database'
    },
    passport: {
        facebookAuth: {
            clientID: 'appId',
            clientSecret: 'appSecret',
            callbackURL: "http://localhost:5000/auth/facebook/callback",
            profileFields:['id','displayName','emails']
        },
        jwt: {
            jwtSecret: 'S3cre3tttt',
            jwtSession: {
                session: false
            }
        }
    }
};

module.exports = config;