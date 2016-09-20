var express = require('express');
var router = express.Router();
var debug = require('debug')('tripsuppliesplanner:routes:v1');
var itemsService = require('../services/items');

router.route('/items')
    .get(function (req, res, next) {
        debug('GET /item');
        itemsService.getAllItems()
            .then(function (results) {
                res.json(results);
            })
            .catch(function (e) {
                next(e);
            });
    })
    .post(function (req, res, next) {
        debug("Post: %o", req.body);
        itemsService.addItem(req.body)
            .then(function (result) {
                res.json(result);
            })
            .catch(function (e) {
                next(e);
            });
    });

router.route('/items/:itemId')
    .get(function (req, res, next) {
        debug("Put on id:%o, object: %o", req.params.itemId, req.body);
        itemsService.getItem(req.params.itemId)
            .then(function (result) {
                res.json(result);
            })
            .catch(function (e) {
                next(e);
            });
    })
    .put(function (req, res, next) {
        debug("Put on id:%o, object: %o", req.params.itemId, req.body);
        itemsService.updateItem(req.params.itemId, req.body)
            .then(function (result) {
                res.json(result);
            })
            .catch(function (e) {
                next(e);
            });
    })
    .delete(function (req, res, next) {
        itemsService.deleteItem(req.params.itemId)
            .then(function (result) {
                res.json(result);
            })
            .catch(function (e) {
                next(e);
            });
    });

module.exports = router;