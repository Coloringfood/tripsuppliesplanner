var express = require('express');
var router = express.Router();
var debug = require('debug')('tripsuppliesplanner:routes:v1');
var itemsModel = require('./../models/itemsModel');

router.route('/list')
    .get(function (req, res, next) {
        debug('GET /list');
        itemsModel.find({})
            .then(function (results) {
                res.json(results);
            })
            .catch(function (e) {
                next(e);
            })
    })
    .post(function (req, res, next) {
        itemsModel.insert(req.body)
            .then(function (result) {
                res.json(result);
            })
            .catch(function (e) {
                next(e);
            })
    });

router.route('/list/:listId')
    .put(function (req, res, next) {
        console.log(req.body.item);
        itemsModel.updateId(req.params.listId, req.body.item)
            .then(function (result) {
                res.json(result);
            })
            .catch(function (e) {
                next(e);
            })
    })
    .delete(function (req, res, next) {
        itemsModel.removeId(req.params.listId)
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