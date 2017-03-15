let factors = module.exports = {};
let Promise = require('bluebird'),
    debug = require('debug')('tripsuppliesplanner:services:factors'),
    factorsTable = require('./../models/factors');

factors.getAllFactors = () => {
    debug("getAllFactors");
    return factorsTable.findAll({
        attributes: [
            "id",
            "name",
            "type"
        ],
        order: [
            ["name", "ASC"]
        ]
    })
        .then(function (allItemsResult) {
            return allItemsResult;
        });
};

factors.addFactors = (newFactors) => {
    debug("addFactors: %o", newFactors);
    return Promise.map(newFactors, (factor) => {
        factor.created_by = newFactors.created_by;
        return factorsTable.create(factor);
    }).then(function (createResult) {
        return createResult;
    });
};