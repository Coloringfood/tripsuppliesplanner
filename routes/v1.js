var express = require('express');
var expressValidator = require('express-validator');
var router = express.Router();
var debug = require('debug')('tripsuppliesplanner:routes:v1');
var itemsService = require('../services/items');
var factorsService = require('../services/factors');

router.use(expressValidator({
    customValidators: {
        isString: function (param) {
            var isValid = true;
            try {
                if (typeof param !== 'string') {
                    isValid = false;
                }
            } catch (err) {
                isValid = false;
            }
            return isValid;
        },
        isInList: function (param, list) {
            /* check if param is in the list of valid options passed to function, returns boolean */
            try {
                var isValid = false;
                var i = 0;
                var listLength = list.length;
                while (i < listLength && isValid === false) {
                    isValid = (list[i] === param);
                    ++i;
                }
                return isValid;
            } catch (err) {
                return false;
            }
        },
        isArray: function (param) {
            var isValid;
            try {
                isValid = Array.isArray(param);
            } catch (err) {
                isValid = false;
            }
            return isValid;
        }
    }
}));
router.use((req, res, next) => {
    req.validateItem = () => {
        debug('validateItem');
        validateItemData();
        if (typeof req.body.factors === 'object' && Array.isArray(req.body.factors)) {
            var featuresLength = req.body.factors.length;
            for (var i = 0; i < featuresLength; i++) {
                validateCategoryData('factors[' + i + '].');
            }
        }
        validateAuditTrail('');

        return checkErrors();
    };

    function validateItemData() {
        req.assert('name', 'This optional field should be a string').isString();
        req.assert('name', 'This optional field should be 100 characters or less').len(0, 30);
        req.assert('personal', 'This optional field should be a Boolean').optional({checkFalsy: true}).isBoolean();
        req.assert('required', 'This optional field should be a Boolean').optional({checkFalsy: true}).isBoolean();
        req.assert('always_needed', 'This optional field should be a Boolean').optional({checkFalsy: true}).isBoolean();
        req.assert('factors', 'Factors must be an array').optional({checkFalsy: true}).isArray();
    }

    function validateCategoryData(baseLocation) {
        debug('validatingCategoryData for %o', baseLocation);
        req.assert(baseLocation + 'name', 'This optional field should be a string').isString();
        req.assert(baseLocation + 'name', 'This optional field should be 100 characters or less').len(0, 30);
        req.assert(baseLocation + 'type', 'the type must be one of ["Vacation Type", "Activities", "Other"]')
            .isInList(['Vacation Type', 'Activities', 'Other']);
    }

    var validateAuditTrail = function (baseLocation) {
        debug('validateAuditTrail');
        req.assert(baseLocation + 'user_id', 'This field is required').notEmpty();
        req.assert(baseLocation + 'user_id', 'This field must be an integer').isInt();
    };

    var checkErrors = function () {
        debug('checkErrors');
        var valid = true;
        var errors = req.validationErrors();
        if (errors) {
            valid = false;
            debug("Validation Errors: %o", errors);
            res.status(400)
                .send({
                    message: 'Validation errors',
                    errors: errors,
                    status: 400
                });
        }
        return valid;
    };

    return next();
});

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

router.route('/factors')
    .get((req, res, next) => {
        factorsService.getAllFactors()
            .then((result) => {
                res.json(result);
            })
            .catch((e) => {
                next(e);
            });
    });

module.exports = router;