var express = require('express');
var router = express.Router();
var debug = require('debug')('tripsuppliesplanner:routes:webpages');

/* GET home page. */
router.get('/', function (req, res) {
    debug("Called Homepage");
    var initialState = {
        items: [
            'document your ',
            'drop the kids off at the pool',
            '</script><script>alert(666)</script>'
        ],
        text: 'asdf'
    };
    res.render('Html', {data: initialState});
});

module.exports = router;






