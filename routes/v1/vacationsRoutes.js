var express = require('express');
var router = express.Router();
var debug = require('debug')('tripsuppliesplanner:routes:v1:vacations');
var vacationService = require('./../../services/vacations');

router.use((req, res, next) => {
        req.validateVacation = () => {
            debug('validateVacation');

            req.assert('name', 'This field should be a string').isString();
            req.assert('name', 'This field should be 30 characters or less').len(0, 30);
            req.assert('start_date', 'This field should be a date').isDate();
            req.assert('end_date', 'This field should be a date').isDate();
            req.assert('factors', "This field should be an array").isArray();

            if (typeof req.body.factors === 'object' && Array.isArray(req.body.factors)) {
                var featuresLength = req.body.factors.length;
                for (var i = 0; i < featuresLength; i++) {
                    validateFactorData('factors[' + i + '].');
                }
            }

            req.validateAuditTrail('');

            return req.checkErrors();
        };

        function validateFactorData(baseLocation) {
            debug('validatingCategoryData for %o', baseLocation);
            req.assert(baseLocation + 'id', 'This field (factor.id) should be an integer').isInt();
            req.assert(baseLocation + 'name', 'This optional field (factor.name) should be a string').optional({checkFalsy: true}).isString();
            req.assert(baseLocation + 'vacations_factors', 'This field (factor.name) should be an object').isObject();
        }

        return next();
    }
);

router.route('/')
    .get((req, res, next) => {
        debug("Get All Vacations");
        return vacationService.getAllVacations()
            .then((result) => {
                debug("Get Result: %o", result);
                res.json(result);
            })
            .catch((e) => {
                next(e);
            });
    })
    .post((req, res, next) => {
        debug("Post: %o", req.body);
        if (req.validateVacation()) {
            return vacationService.addVacation(req.body)
                .then((result) => {
                    debug("post result: %o", result);
                    res.status(201).send();
                })
                .catch((e) => {
                    next(e);
                });
        }
    });

router.route('/:vacationId')
    .get((req, res, next) => {
        debug("Get Vacation");
        return vacationService.getVacation(req.params.vacationId)
            .then((result) => {
                debug("Get Result: %o", result);
                res.json(result);
            })
            .catch((e) => {
                next(e);
            });
    })
    .put((req, res, next) => {
        debug("Put: %o", req.body);
        if (req.validateVacation()) {
            // NOTE: THIS DOES NOT UPDATE PARTICIPANTS
            return vacationService.updateVacation(req.params.vacationId, req.body)
                .then((result) => {
                    debug("post result: %o", result);
                    res.status(201).send();
                })
                .catch((e) => {
                    next(e);
                });
        }
    })
    .delete((req, res, next) => {
        debug("Delete");
        return vacationService.deleteVacation(req.params.vacationId)
            .then((result) => {
                debug("delete result: %o", result);
                res.json(result);
            })
            .catch((e) => {
                next(e);
            });
    });

module.exports = router;