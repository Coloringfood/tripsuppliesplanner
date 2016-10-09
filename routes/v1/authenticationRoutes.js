var express = require('express');
var router = express.Router();
var debug = require('debug')('tripsuppliesplanner:routes:v1:authentication');
var userService = require('./../../services/users');
var fs = require('fs');
var path = require('path');

router.use((req, res, next) => {
        req.validateFactors = () => {
            debug('validateFactors');

            validateUserData();

            return req.checkErrors();
        };

        function validateUserData() {
            req.assert('name', 'This field should be a string').isString();
            req.assert('name', 'This field should be 30 characters or less').len(0, 30);
            req.assert('email', 'This field should be a string').isString();
            req.assert('email', 'This field should be 100 characters or less').len(0, 100);
            req.assert('username', 'This field should be a string').isString();
            req.assert('username', 'This field should be 30 characters or less').len(0, 30);
            req.assert('password', 'This field should be a string').isString();
            req.assert('age', 'This field should be a string').isString();
        }

        return next();
    }
);

router.route('/create')
    .post((req, res, next) => {
        debug(req.body);
        if (req.validateFactors()) {
            var body = req.body;
            return userService.createUser(body)
                .then((result) => {
                    res.send(result);
                })
                .catch((e) => {
                    next(e);
                });

        }
    });

router.route('/update')
    .put((req, res, next) => {
        debug('updateUser');
        if (req.body.id === req.user.userId) {
            return userService.updateUser(req.body)
                .then((result) => {
                    debug("updateResult: %o", result);
                    res.status(200).send(result);
                });
        }
        else {
            next({
                showMessage: "You are not allowed to edit other people's settings",
                status: 400
            });
        }

    });

router.route('/themes')
    .get((req, res, next) => {
        var location = path.join(__dirname, '..','..','public','assets','css','themes');
        fs.readdir(location, (err, results) => {
            res.send(results);
        });
    });

router.route('/')
    .post((req, res, next) => {
        debug(req.body);
        return userService.authenticate(req.body.username, req.body.password)
            .then((result) => {
                res.send(result);
            })
            .catch((e) => {
                next(e);
            });
    });


module.exports = router;