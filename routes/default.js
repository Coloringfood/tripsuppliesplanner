var express = require('express'),
router = express.Router(),
path = require('path');

/* GET home page. */
router.get('/', (req, res) => {
    res.sendFile('index.html', {root: './public'});
});
router.get('*', (req, res) => {
    res.status(404).send("404, page not found");
});

module.exports = router;
