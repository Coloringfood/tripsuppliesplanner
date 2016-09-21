var items = module.exports = {};
var Promise = require('bluebird'),
    debug = require('debug')('tripsuppliesplanner:services:items'),
    vacationsTable = require('./../models/vacations'),
    itemsTable = require('./../models/items');

var ITEM_NOT_FOUND = "item_not_found";

items.getAllItems = () => {
    debug("getAllItems");
    return itemsTable.findAll().then(function (allItemsResult) {
        return allItemsResult;
    });
};

items.getItem = (id) => {
    debug("getItem");
    return itemsTable.find({
        where: {
            id: id
        }
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
        return createResult;
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