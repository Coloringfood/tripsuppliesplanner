var users = module.exports = {};
var Promise = require('bluebird'),
    debug = require('debug')('tripsuppliesplanner:services:users'),
    usersTable = require('./../models/users'),
    jwt = require('jsonwebtoken'),
    config = require('./../config/config.json');

users.authenticate = (username, password) => {
    debug("authenticate");
    // return usersTable.findAll({
    //     attributes: [
    //         "id",
    //         "name",
    //         "type"
    //     ]
    // })
    //     .then(function (allItemsResult) {
    //         return allItemsResult;
    //     });
    return Promise.resolve(generateToken());
};

users.createUser = (newUser) => {
    debug("Create User");
    return Promise.resolve(generateToken(newUser));
    // return usersTable.create(factor)
    //     .then(function (createResult) {
    //         return createResult;
    //     });
};

function generateToken(user) {
    var tokenData = {
        userId: 1,
        user: user
    };
    var options = {
        expiresIn: 600, // 10 minutes
        issuer: config.security.issuer
    };
    var token = jwt.sign(tokenData, config.security.secret, options);
    return {
        id: 1,
        token: token
    };
}