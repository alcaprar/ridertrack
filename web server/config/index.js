var config = {
    port: 5000,
    rootFolder: __dirname + '/../',
    mongodb: {
        uri: 'mongodb://localhost/my_database'
    },
    passport: {
        facebookAuth: {
            clientID: '278876872621248',
            clientSecret: '53f98a00b42e720b69ad44110b1c48a7',
            callbackURL: "http://localhost:5000/api/auth/register/facebook/callback",
            profileFields:['id','displayName','emails']
        },
        googleAuth:{
                 client_id :"81577305569-u01r8b47n4o2f4m8l1r1gu8099puolfo.apps.googleusercontent.com",
                 client_secret:"pZyGLQUglyurszgfveC6H3Yg",
                 redirect_uri:"http://localhost:5000/api/auth/register/google/callback",
                 project_id:"ridertrackapp",
                 auth_uri:"https://accounts.google.com/o/oauth2/auth",
                 token_uri:"https://accounts.google.com/o/oauth2/token",
                 auth_provider_x509_cert_url:"https://www.googleapis.com/oauth2/v1/certs"
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