var express = require('express');
var router = express.Router();
var debug = require('debug')('tripsuppliesplanner:routes:v1');

/* GET home page. */
router.get('/', function (req, res, next) {
    debug("called api");
    res.send("Success");
});

module.exports = router;
