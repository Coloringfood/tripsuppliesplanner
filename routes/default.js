var express = require('express'),
    router = express.Router(),
    path = require('path'),
    debug = require('debug')('tripsuppliesplanner:routes:default');

/* GET home page. */
router.get('/', (req, res) => {
    res.sendFile('index.html', {root: './public'});
});
router.get('/itemspage', (req, res) => {
    res.sendFile('index.html', {root: './public'});
});
router.get('/vacationspage', (req, res) => {
    res.sendFile('index.html', {root: './public'});
});
router.get('/login', (req, res) => {
    res.sendFile('index.html', {root: './public'});
});
router.get('*', (req, res) => {
    debug("req.originalUrl: ", req.originalUrl);
    res.status(404).send("404, page not found");
});

module.exports = router;
