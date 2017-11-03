var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.send('Ciao, it works!')
});

module.exports = router;