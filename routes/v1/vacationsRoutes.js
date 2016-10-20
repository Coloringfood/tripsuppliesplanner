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

            return req.checkErrors();
        };

        function validateFactorData(baseLocation) {
            debug('validatingCategoryData for %o', baseLocation);
            req.assert(baseLocation + 'id', 'This field (factor.id) should be an integer').isInt();
            req.assert(baseLocation + 'name', 'This optional field (factor.name) should be a string').optional({checkFalsy: true}).isString();
            req.assert(baseLocation + 'vacations_factors', 'This field (factor.vacations_factors) should be an object').isObject();
        }

        return next();
    }
);

router.route('/')
    .get((req, res, next) => {
        debug("Get All Vacations");

        var userId = req.user.userId;
        return vacationService.getAllVacations(userId)
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
            var body = req.body;
            body.created_by_id = req.user.userId;
            return vacationService.addVacation(body)
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
        debug("Get Vacation id: %o", req.params.vacationId);
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
            var body = req.body;
            body.created_by_id = req.user.userId;
            // NOTE: THIS DOES NOT UPDATE PARTICIPANTS
            return vacationService.updateVacation(req.params.vacationId, body)
                .then((result) => {
                    debug("put result: %o", result);
                    res.status(201).send();
                })
                .catch((e) => {
                    next(e);
                });
        }
    })
    .delete((req, res, next) => {
        debug("Delete vacation id: %o", req.params.vacationId);
        return vacationService.deleteVacation(req.params.vacationId)
            .then((result) => {
                debug("delete result: %o", result);
                res.json(result);
            })
            .catch((e) => {
                next(e);
            });
    });

router.route('/:vacationId/pack/:userId')
    .get((req, res, next) => {
        debug("Pack Vacation id: %o, user id: %o", req.params.vacationId, req.params.userId);

        var vacationId = req.params.vacationId,
            userId = req.params.userId;

        try {
            parseInt(vacationId);
            parseInt(userId);
            return vacationService.packingListForVacation(vacationId, userId)
                .then((result) => {
                    debug("Get Result: %o", result);
                    res.json(result);
                })
                .catch((e) => {
                    next(e);
                });
        } catch (e) {
            next(e);
        }
    });

router.route('/pack')
    .post((req, res, next) => {
        debug("Anonymous packing: %o", req.body);
        req.assert('ageId', 'This field (ageId) should be an integer').isInt();
        if (req.validateVacation()) {
            var body = req.body;
            return vacationService.packingForAnonymous(body, body.ageId)
                .then((result) => {
                    debug("post result: %o", result);
                    res.status(200).send(result);
                })
                .catch((e) => {
                    next(e);
                });
        }
    });

module.exports = router;