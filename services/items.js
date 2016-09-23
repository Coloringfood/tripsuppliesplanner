var items = module.exports = {};
var Promise = require('bluebird'),
    debug = require('debug')('tripsuppliesplanner:services:items'),
    agesTable = require('./../models/ages'),
    itemsTable = require('./../models/items'),
    factorsTable = require('./../models/factors');

var ITEM_NOT_FOUND = "item_not_found";
var ITEMS_INCLUDE = [
    {
        model: agesTable,
        attributes: [
            "id",
            "name"
        ]
    },
    {
        model: factorsTable,
        attributes: [
            "id"
        ],
        required: false
    }
];

function convertItemForUI(item) {
    var itemData = item.dataValues;
    var convertedSelected = [];
    var selectedLength = itemData.factors.length;
    for (var i = 0; i < selectedLength; i++) {
        var factor = itemData.factors[i];
        convertedSelected.push(factor.id);
    }
    itemData.factors = convertedSelected;
    return itemData;
}

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
        return Promise.map(allItemsResult, convertItemForUI)
            .then(function (results) {
                console.log(results);
                return results;
            });
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
            var itemsPromise = Promise.map(item.ages, (age) => {
                return addAgeToItem(createResult, age)
                    .then((result) => {
                        returnValue.ages.push(result);
                    });
            });

            var factorsPromise = updateItemFactors(createResult, item.factors)
                .then(function (newFactors) {
                    returnValue.factors = newFactors;
                });

            return Promise.all([itemsPromise, factorsPromise]).then(function () {
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
    }).catch((error) => {
        return Promise.reject({
            error: error,
            message: "sequelize_error",
            location: "itemsaddItem sequelize find age",
            showMessage: error.showMessage || "Error trying to find age: " + age.name,
            status: error.status || 500
        });
    }).then((ageResult) => {
        if (!ageResult) {
            return Promise.reject({
                message: ITEM_NOT_FOUND,
                location: "items.addItem findAge empty",
                showMessage: "The requested age (" + age.name + ") was not found",
                status: 400
            });
        }
        return item.addAges(ageResult, age.items_per_age) // jshint ignore:line
            .catch((error) => {
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

function updateItemFactors(item, factors) {
    debug("updateItemFactors");
    var updatedFactors = [];
    return factorsTable.findAll({
        attributes: ["id"],
        include: [{
            model: itemsTable,
            where: {id: item.id},
            attributes: ["id"],
            through: {
                attributes: ["updated_at"]
            }
        }]
    }).then(function (foundFactors) {
        console.log("foundFactors: ", foundFactors);
        return Promise.map(foundFactors, (factor) => {
            //TODO: TEST that this does work
            var index = factors.indexOf(factor.id);
            if (index === -1) {
                debug("removing factor id %o from item", factor.id);
                return item.removeFactor(factor);
            } else {
                debug("keeping factor id %o on item", factor.id);
                updatedFactors.push(factor.id);
                return factors.splice(index, 1);
            }
        });
    }).then(function () {
        return Promise.map(factors, (factorId)=> {
            debug("adding factor id %o to item", factorId);
            return addFactorToItem(item, factorId)
                .then((result) => {
                    updatedFactors.push(result);
                });
        });
    }).then(function () {
        return updatedFactors;
    });
}

function addFactorToItem(item, factorId) {
    return factorsTable.find({
        where: {
            id: factorId
        }
    }).then((factorResult)=> {
        if (!factorResult) {
            return Promise.reject({
                message: ITEM_NOT_FOUND,
                location: "items.addFeature findfeature empty",
                showMessage: "The requested feature (" + factorId + ") was not found",
                status: 400
            });
        }

        return item.addFactors(factorResult)
            .catch((error) => {
                return Promise.reject({
                    error: error,
                    message: "sequelize_error",
                    location: "addFeatureToItem sequelize addfeature",
                    showMessage: error.showMessage || "Error trying to add Feature to Item",
                    status: error.status || 500
                });
            });
    });
}