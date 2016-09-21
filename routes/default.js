var express = require('express'),
router = express.Router(),
path = require('path');

/* GET home page. */
router.get('*', (req, res) => {
    res.sendFile('index.html', {root: './public'});
});

module.exports = router;
