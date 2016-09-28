var factors = module.exports = {};
var Promise = require('bluebird'),
    debug = require('debug')('tripsuppliesplanner:services:factors'),
    factorsTable = require('./../models/factors'),
    agesTable = require('./../models/ages'),
    itemsTable = require('./../models/items');

var FACTOR_NOT_FOUND = "item_not_found";
var FACTOR_INCLUDE = [
    {
        model: agesTable,
        attributes: [
            "id",
            "name"
        ]
    }
];

factors.getAllFactors = () => {
    return factorsTable.findAll({
        attributes: [
            "id",
            "name",
            "type"
        ]
    })
        .then(function (allItemsResult) {
            return allItemsResult;
        });
};

factors.addFactors = (newFactors) => {
    return Promise.map(newFactors, (factor) => {
        factor.created_by = factor.user_id; // jshint ignore:line
        return factorsTable.create(factor);
    }).then(function (createResult) {
        return createResult;
    });
};