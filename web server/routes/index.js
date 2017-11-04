var express = require('express');
var router = express.Router();

// require user endpoints
var userRouter = require('./user');
router.use(userRouter);

router.use(require('./event'));


router.get('*', function (req, res) {
    // send the angular app
});

module.exports = router;