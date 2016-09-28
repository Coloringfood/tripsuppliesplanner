var express = require('express');
var router = express.Router();
var debug = require('debug')('tripsuppliesplanner:routes:v1:items');
var itemsService = require('./../../services/items');

router.use((req, res, next) => {
    req.validateItem = () => {
        debug('validateItem');
        validateItemData();
        if (typeof req.body.factors === 'object' && Array.isArray(req.body.factors)) {
            var featuresLength = req.body.factors.length;
            for (var i = 0; i < featuresLength; i++) {
                validateFactorData('factors[' + i + ']');
            }
        }
        req.validateAuditTrail('');

        return req.checkErrors();
    };

    function validateItemData() {
        req.assert('name', 'This field should be a string').isString();
        req.assert('name', 'This field should be 30 characters or less').len(0, 30);
        req.assert('personal', 'This optional field should be a Boolean').optional({checkFalsy: true}).isBoolean();
        req.assert('required', 'This optional field should be a Boolean').optional({checkFalsy: true}).isBoolean();
        req.assert('always_needed', 'This optional field should be a Boolean').optional({checkFalsy: true}).isBoolean();
        req.assert('factors', 'Factors must be an array').optional({checkFalsy: true}).isArray();
    }

    function validateFactorData(baseLocation) {
        debug('validatingCategoryData for %o', baseLocation);
        req.assert(baseLocation, 'This field (factor) should be a string').isInt();
    }

    return next();
});

router.route('/')
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
        if (req.validateItem()) {
            return itemsService.addItem(req.body)
                .then((result) => {
                    debug("post result: %o", result);
                    res.status(201).send();
                })
                .catch((e) => {
                    next(e);
                });
        }
    });

router.route('/:itemId')
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
        if (req.validateItem()) {
            itemsService.updateItem(req.params.itemId, req.body)
                .then((result) => {
                    res.json(result);
                })
                .catch((e) => {
                    next(e);
                });
        }
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