var express = require('express');
var expressValidator = require('express-validator');
var router = express.Router();
var debug = require('debug')('tripsuppliesplanner:routes:v1');
var itemsRoutes = require('./v1/itemsRoutes');
var factorsRoutes = require('./v1/factorsRoutes');
var vacationsRoutes = require('./v1/vacationsRoutes');

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
        isObject: function (param) {
            var isValid = true;
            try {
                if (typeof param !== 'object') {
                    var jsonVersion = JSON.parse(param);
                    if (jsonVersion !== 'object') {
                        isValid = false;
                    }
                }
            } catch (err) {
                isValid = false;
            }
            return isValid;
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
    req.validateAuditTrail = (baseLocation) => {
        debug('validateAuditTrail');
        req.assert(baseLocation + 'user_id', 'This field is required').notEmpty();
        req.assert(baseLocation + 'user_id', 'This field must be an integer').isInt();
    };

    req.checkErrors = () => {
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

router.use('/items', itemsRoutes);

router.use('/factors', factorsRoutes);

router.use('/vacations', vacationsRoutes);

router.get('*', (req, res) => {
    res.status(400).send("Not Valid URI");
});

module.exports = router;