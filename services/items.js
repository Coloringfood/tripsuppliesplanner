var items = module.exports = {};
var Promise = require('bluebird'),
    debug = require('debug')('tripsuppliesplanner:services:items'),
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

items.getAllItems = () => {
    debug("getAllItems");
    return itemsTable.findAll(
        {
            include: ITEMS_INCLUDE
        }
    ).then(function (allItemsResult) {
        return allItemsResult;
    });
};

items.getItem = (id) => {
    debug("getItem");
    return itemsTable.find({
        where: {
            id: id
        },
        include: ITEMS_INCLUDE
    }).then(function (findResult) {
        if (findResult === null) {
            return Promise.reject({
                errors: ITEM_NOT_FOUND,
                location: "items.getItem",
                showMessage: "Item ID: " + id + " not found",
                status: 404
            });
        }
        return findResult;
    });
};

items.addItem = (item) => {
    debug("addItem");
    return itemsTable.create(item).then(function (createResult) {
        var returnValue = createResult.dataValues;
        returnValue.ages = [];
        return Promise.map(item.ages, (age) => {
            return agesTable.find({
                where: {
                    name: age.name
                }
            }).then(function (ageResult){
                return createResult.addAges(ageResult, age.items_per_age)
                    .then(function (result) {
                        returnValue.ages.push(result);
                    });
            });
        }).then(function (){
            return createResult;
        });
    });
};

items.updateItem = (id, item) => {
    debug("updateItem");
    return itemsTable.update(item, {
        where: {
            id: id
        }
    }).then(function (updateResult) {
        if (updateResult[0] === 0) {
            return Promise.reject({
                errors: ITEM_NOT_FOUND,
                location: "items.updateItem",
                showMessage: "Item ID: " + id + " not found",
                status: 404
            });
        }
        return updateResult;
    });
};

items.deleteItem = (id) => {
    debug("deleteItem");
    return itemsTable.destroy({
        where: {
            id: id
        }
    }).then(function (destroyResults) {
        if (destroyResults === 0) {
            return Promise.reject({
                errors: ITEM_NOT_FOUND,
                location: "items.updateItem",
                showMessage: "Item ID: " + id + " not found",
                status: 404
            });
        }
        return destroyResults;
    });
};