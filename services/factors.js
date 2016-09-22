var factors = module.exports = {};
var Promise = require('bluebird'),
    debug = require('debug')('tripsuppliesplanner:services:factors'),
    factorsTable = require('./../models/factors'),
    agesTable = require('./../models/ages'),
    itemsTable = require('./../models/items');

var ITEM_NOT_FOUND = "item_not_found";
var ITEMS_INCLUDE = [
    {
        model: agesTable,
        attributes: [
            "id",
            "name"
        ]
    }
];

factors.getAllFactors = ()=> {
    return factorsTable.findAll()
        .then(function (allItemsResult) {
            return allItemsResult;
        });
};