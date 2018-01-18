var express = require('express');
var router = express.Router();
var utils = require('../utils');

/**
 * Endpoint used by the contact form.
 */
router.post('/sendEmail', function (req, res) {
    utils.email.send(
        {name: 'Contact form', email: 'ante.brescic@gmail.com'},
        '[CF] ' + req.body.firstname + ' ' + req.body.lastname + ' | ' + req.body.subject,
        req.body.message,
        function (err) {
            if(err){
                console.log('Error while sending email from contact form.', err);
                return res.status(400).send({
                    message: 'Email not sent.'
                })
            }else {
                return res.status(200).send({
                    message: 'Email successfully sent.'
                })
            }
        }
    )
});

module.exports = router;
