var config = require('../config');

var utils = {
    email: {
        /**
         * It sends an email using mailjet provider.
         * @param recepient
         * @param subject
         * @param body
         */
        send: function (recipient, subject, body, callback) {
            var mailjet = require('node-mailjet').connect(config.MJ_APIKEY_PUBLIC, config.MJ_APIKEY_PRIVATE);
            const request = mailjet
                .post("send", {'version': 'v3.1'})
                .request({
                    "Messages":[
                        {
                            "From": {
                                "Email": "alessandrocaprarelli@hotmail.it",
                                "Name": "Ridertrack"
                            },
                            "To": [
                                {
                                    "Email": recipient.email,
                                    "Name": recipient.name
                                }
                            ],
                            "Subject": subject,
                            "TextPart": body
                        }
                    ]
                });

            request
                .then((result) => {
                    return callback(null)
                })
                .catch((err) => {
                    return callback(err)
                })

        }
    }
};

module.exports = utils;
