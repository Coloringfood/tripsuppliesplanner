var users = module.exports = {};
var Promise = require('bluebird'),
    debug = require('debug')('tripsuppliesplanner:services:users'),
    usersTable = require('./../models/users'),
    agesTable = require('./../models/ages'),
    jwt = require('jsonwebtoken'),
    config = require('./../config/config.json');

var USERS_INCLUDE = [
    {
        model: agesTable,
        as: 'age',
        attributes: [
            "id",
            "name"
        ]
    }
];


users.authenticate = (username, password) => {
    debug("authenticate");
    return usersTable.find({
        where: {
            username: username,
            password: password
        },
        include: USERS_INCLUDE
    })
        .then(function (allItemsResult) {
            if (allItemsResult) {
                return generateToken(allItemsResult);
            }
            else {
                return Promise.reject({
                    showMessage: "Invalid credentials",
                    status: 400
                });
            }
        });
};

users.createUser = (newUser) => {
    debug("Create User");
    return agesTable.find({where: {name: newUser.age}})
        .catch(function (error) {
            debug("sequelize error: %o", error);
            return Promise.reject({
                errors: error,
                message: "sequelize_error",
                showMessage: "Error finding age",
                status: error.status || 400
            });
        })
        .then(function (findAgeResult) {
            if (!findAgeResult) {
                return Promise.reject({
                    message: "sequelize_error",
                    showMessage: "Age Not Found",
                    status: 400
                });
            }
            newUser.age_id = findAgeResult.id;
            return usersTable.create(newUser)
                .catch(function (error) {
                    debug("sequelize error: %o", error);
                    return Promise.reject({
                        errors: error,
                        message: "sequelize_error",
                        location: "",
                        showMessage: "Error Creating User",
                        status: error.status || 400
                    });
                })
                .then(function (createResult) {
                    debug("createResult.dataValues: %o", createResult.dataValues);
                    return Promise.resolve(users.authenticate(newUser.username, newUser.password));
                });
        });
};

users.updateUser = (userData) => {
    debug("updateUser");
    userData.settings = JSON.stringify(userData.settings);
    return agesTable.find({where: {name: userData.age.name}})
        .catch(function (error) {
            debug("sequelize error: %o", error);
            return Promise.reject({
                errors: error,
                message: "sequelize_error",
                showMessage: "Error finding age",
                status: error.status || 400
            });
        })
        .then(function (findAgeResult) {
            if (!findAgeResult) {
                return Promise.reject({
                    message: "sequelize_error",
                    showMessage: "Age Not Found",
                    status: 400
                });
            }
            userData.age_id = findAgeResult.id;

            return usersTable.update(userData, {
                where: {
                    id: userData.id
                }
            }).then((result) => {
                debug("updating User's age");

                return usersTable.find({
                    where: {
                        id: userData.id
                    },
                    include: USERS_INCLUDE
                }).then((result) => {
                    return generateToken(result.dataValues);
                });
            });
        });
};

function generateToken(user) {
    debug("generateToken");

    if (!user.settings) {
        user.settings = {};
    } else {
        user.settings = JSON.parse(user.settings);
    }
    var tokenData = {
        userId: user.id,
        user: user
    };
    var options = {
        expiresIn: config.security.expiration, // 10 minutes
        issuer: config.security.issuer
    };
    debug(tokenData);
    var token = jwt.sign(tokenData, config.security.secret, options);
    return {
        id: 1,
        token: token
    };
}