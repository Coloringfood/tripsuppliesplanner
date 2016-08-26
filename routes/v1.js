var express = require('express');
var router = express.Router();
var debug = require('debug')('tripsuppliesplanner:routes:v1');
var itemsModel = require('./../models/itemsModel');

var Items = [
    "Blah 1",
    "Blah 2",
    "Awesome"
];

router.route('/list')
    .get(function (req, res, next) {
        debug('GET /list');
        // res.json(Items);
        itemsModel.find({})
            .then(function (results) {
                res.json(results);
            })
            .catch(function (e) {
                next(e);
            })
    })
    .put(function (req, res, next) {
        Items.push(req.body.value);
        // res.send(Items);
        itemsMode.insert(req.body.value)
            .then(function (result) {
                res.json(result);
            })
            .catch(function (e) {
                next(e);
            })
    });

/* GET home page. */
router.get('/*', function (req, res, next) {
    debug("called api");
    res.send("Success");
});

module.exports = router;
