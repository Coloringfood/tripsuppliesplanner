var items = module.exports = {};
var Promise = require('bluebird'),
    debug = require('debug')('tripsuppliesplanner:services:items'),
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
    ).catch(function (error) {
        return Promise.reject({
            error: error,
            message: "sequelize_error",
            location: "items.getAllItems sequelize findall",
            showMessage: error.showMessage || "Error trying to find all items",
            status: error.status || 500
        });
    }).then(function (allItemsResult) {
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
    }).catch(function (error) {
        return Promise.reject({
            error: error,
            message: "sequelize_error",
            location: "items.getItem sequelize find",
            showMessage: error.showMessage || "Error trying to find item id: " + id,
            status: error.status || 500
        });
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
    return itemsTable.create(item)
        .catch(function (error) {
            return Promise.reject({
                error: error,
                message: "sequelize_error",
                location: "items.addItem sequelize create",
                showMessage: error.showMessage || "Error creating item",
                status: error.status || 500
            });
        })
        .then(function (createResult) {
            var returnValue = createResult.dataValues;
            returnValue.ages = [];
            return Promise.map(item.ages, (age) => {
                return addAgeToItem(createResult, age)
                    .then(function (result) {
                        returnValue.ages.push(result);
                    });
            }).then(function () {
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
    }).catch(function (error) {
        return Promise.reject({
            error: error,
            message: "sequelize_error",
            location: "items.updateItem sequelize update",
            showMessage: error.showMessage || "Error trying to update item: " + id,
            status: error.status || 500
        });
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

function addAgeToItem(item, age) {
    return agesTable.find({
        where: {
            name: age.name
        }
    }).catch(function (error) {
        return Promise.reject({
            error: error,
            message: "sequelize_error",
            location: "itemsaddItem sequelize find age",
            showMessage: error.showMessage || "Error trying to find age: " + age.name,
            status: error.status || 500
        });
    }).then(function (ageResult) {
        if (!ageResult) {
            return Promise.reject({
                message: ITEM_NOT_FOUND,
                location: "items.addItem findAge empty",
                showMessage: "The requested age (" + age.name + ") was not found",
                status: 400
            });
        }
        return item.addAges(ageResult, age.items_per_age)
            .catch(function (error) {
                return Promise.reject({
                    error: error,
                    message: "sequelize_error",
                    location: "addAgeToItem sequelize addAges",
                    showMessage: error.showMessage || "Error trying to add Age to Item",
                    status: error.status || 500
                });
            });
    });
}