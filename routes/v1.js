var express = require('express');
var router = express.Router();
var debug = require('debug')('tripsuppliesplanner:routes:v1');
var itemsService = require('../services/items');

router.route('/items')
    .get((req, res, next) => {
        debug('GET /item');
        itemsService.getAllItems()
            .then((results) => {
                res.json(results);
            })
            .catch((e) => {
                next(e);
            });
    })
    .post((req, res, next) => {
        debug("Post: %o", req.body);
        itemsService.addItem(req.body)
            .then((result) => {
                res.json(result);
            })
            .catch((e) => {
                next(e);
            });
    });

router.route('/items/:itemId')
    .get((req, res, next) => {
        debug("Put on id:%o, object: %o", req.params.itemId, req.body);
        itemsService.getItem(req.params.itemId)
            .then((result) => {
                res.json(result);
            })
            .catch((e) => {
                next(e);
            });
    })
    .put((req, res, next) => {
        debug("Put on id:%o, object: %o", req.params.itemId, req.body);
        itemsService.updateItem(req.params.itemId, req.body)
            .then((result) => {
                res.json(result);
            })
            .catch((e) => {
                next(e);
            });
    })
    .delete((req, res, next) => {
        itemsService.deleteItem(req.params.itemId)
            .then((result) => {
                res.json(result);
            })
            .catch((e) => {
                next(e);
            });
    });

module.exports = router;