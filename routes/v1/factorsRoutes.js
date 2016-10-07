var express = require('express');
var router = express.Router();
var debug = require('debug')('tripsuppliesplanner:routes:v1:factors');
var factorsService = require('./../../services/factors');


router.use((req, res, next) => {
        req.validateFactors = () => {
            debug('validateFactors');

            if (Array.isArray(req.body)) {
                if (typeof req.body === 'object' && Array.isArray(req.body)) {
                    var featuresLength = req.body.length;
                    for (var i = 0; i < featuresLength; i++) {
                        validateFactorData('[' + i + '].');
                    }

                }
            }
            else {
                next({
                    message: 'Validation errors',
                    errors: [{param: "body", msg: "You must pass in an array object for the body"}],
                    status: 400
                });
            }

            return req.checkErrors();
        };

        function validateFactorData(baseLocation) {
            console.log("baseLocation: ", baseLocation);
            debug('validatingCategoryData for %o', baseLocation);
            req.assert(baseLocation + 'name', 'Name is requierd for factors').isString();
            req.assert(baseLocation + 'type', 'Type must be one of: "Vacation Type", "Activities", "Other"').isInList(['Vacation Type', 'Activities', 'Other']);
        }


        return next();
    }
);

router.route('/')
    .get((req, res, next) => {
        debug("Get Factors");
        factorsService.getAllFactors()
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
        if (req.validateFactors()) {
            var body = req.body;
            body.created_by = req.user.userId;
            return factorsService.addFactors(body)
                .then((result) => {
                    debug("post result: %o", result);
                    res.status(201).send();
                })
                .catch((e) => {
                    next(e);
                });
        }
    });

module.exports = router;