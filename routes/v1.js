var express = require('express');
var router = express.Router();
var debug = require('debug')('tripsuppliesplanner:routes:v1');
var itemsService = require('./../services/items');

router.route('/list')
    .get(function (req, res, next) {
        debug('GET /list');
        itemsService.getAllItems({})
            .then(function (results) {
                res.json(results);
            })
            .catch(function (e) {
                next(e);
            })
    })
    .post(function (req, res, next) {
        itemsService.addItem(req.body)
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
        itemsService.updateItem(req.params.listId, req.body.item)
            .then(function (result) {
                res.json(result);
            })
            .catch(function (e) {
                next(e);
            })
    })
    .delete(function (req, res, next) {
        itemsService.deleteItem(req.params.listId)
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