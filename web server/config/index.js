var config = {
    port: 5000,
    mongodb: {
        uri: 'mongodb://localhost/my_database'
    },
    passport: {
        jwt: {
            jwtSecret: 'S3cre3tttt',
            jwtSession: {
                session: false
            }
        }
    }
};

module.exports = config;