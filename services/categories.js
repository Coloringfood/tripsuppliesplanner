let factors = module.exports = {};
let Promise = require('bluebird'),
    debug = require('debug')('tripsuppliesplanner:services:categories'),
    categoriesTable = require('./../models/categories');

factors.getAllCategories = () => {
    debug("getAllCategories");
    return categoriesTable.findAll()
        .then(function (allItemsResult) {
            return allItemsResult;
        });
};