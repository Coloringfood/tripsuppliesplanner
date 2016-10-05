var express = require('express');
var router = express.Router();
var debug = require('debug')('tripsuppliesplanner:routes:v1:vacations');
var jwt = require('jsonwebtoken');
var config = require('./../../config/config.json');

router.route('/')
    .post((req, res, next) => {
        //TODO: Actually verify if person exists, and create proper token data for User
        var tokenData = {
            iss: config.security.issuer,
            userId: 1
        };
        var token = jwt.sign(tokenData, config.security.secret);
        res.send(token);
    });


module.exports = router;