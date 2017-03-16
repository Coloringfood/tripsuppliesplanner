let express = require('express');
let router = express.Router();
let debug = require('debug')('tripsuppliesplanner:routes:v1:factors');
let factorsService = require('./../../services/factors');


router.use((req, res, next) => {
        req.validateFactors = () => {
            debug('validateFactors');

            if (Array.isArray(req.body)) {
                if (typeof req.body === 'object' && Array.isArray(req.body)) {
                    let featuresLength = req.body.length;
                    for (let i = 0; i < featuresLength; i++) {
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
            debug('validatingCategoryData for %o', baseLocation);
            req.assert(baseLocation + 'name', 'Name is required for factors').isString();
            req.assert(baseLocation + 'type', 'Type must be one of: "Vacation Type", "Activities", "Other"').isInList(['Vacation Type', 'Activities', 'Other']);
        }


        return next();
    }
);

router.route('/list')
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
	});

router.route('/')
    .post((req, res, next) => {
        debug("Post: %o", req.body);
        if (req.validateFactors()) {
            let body = req.body;
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