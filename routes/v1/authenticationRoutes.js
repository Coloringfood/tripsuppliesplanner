var express = require('express');
var router = express.Router();
var debug = require('debug')('tripsuppliesplanner:routes:v1:authentication');
var userService = require('./../../services/users');

router.route('/create')
    .post((req, res, next) => {
        debug(req.body);
        userService.createUser(req.body, req.body)
            .then((result) => {
                res.send(result)
            })
            .catch((e) => {
                next(e);
            });
    });

router.route('/')
    .post((req, res, next) => {
        debug(req.body);
        //TODO: Actually verify if person exists, and create proper token data for User
        userService.authenticate(req.body.username, req.body.password)
            .then((result) => {
                res.send(result)
            })
            .catch((e) => {
                next(e);
            });
    });


module.exports = router;