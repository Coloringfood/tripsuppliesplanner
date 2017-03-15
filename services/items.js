let items = module.exports = {};
let Promise = require('bluebird'),
    Sequelize = require('sequelize'),
    debug = require('debug')('tripsuppliesplanner:services:items'),
    agesTable = require('./../models/ages'),
    itemsTable = require('./../models/items'),
    factorsTable = require('./../models/factors'),
    categoriesTable = require('./../models/categories');

let ITEM_NOT_FOUND = "item_not_found";
let ITEM_INCLUDE = [
    {
        model: agesTable,
        attributes: [
            "id",
            "name"
        ],
        through: {
            attributes: [
                "days",
                "items"
            ]
        }
    },
    {
        model: factorsTable,
        attributes: [
            "id"
        ],
        through: {
            attributes: []
        }
    },
    {
        model: categoriesTable,
        as: 'category'
    }
];
let ITEM_ATTRIBUTES = [
    "id",
    "name",
    "personal",
    "required",
    "always_needed",
    "created_by_id"
];

function convertItemForUI(item) {
    let itemData = item.dataValues;
    let convertedSelected = [];
    let selectedLength = itemData.factors.length;
    for (let i = 0; i < selectedLength; i++) {
        let factor = itemData.factors[i];
        convertedSelected.push(factor.id);
    }
    itemData.factors = convertedSelected;
    return itemData;
}

items.getAllItems = (userId) => {
    debug("getAllItems");
    return itemsTable.findAll(
        {
            where: {
                $or: [
                    {
                        personal: 0
                    },
                    {
                        personal: 1,
                        created_by_id: userId
                    }
                ]
            },
            order: [
                ["name", "ASC"]
            ],
            attributes: ITEM_ATTRIBUTES,
            include: ITEM_INCLUDE
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
                return results;
            });
    });
};

items.getItem = (id, userId) => {
    debug("getItem");
    return itemsTable.find({
        attributes: ITEM_ATTRIBUTES,
        where: {
            id: id,
            $or: [
                {
                    personal: 0
                },
                {
                    personal: 1,
                    created_by_id: userId
                }
            ]
        },
        include: ITEM_INCLUDE
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
    item.category_id = item.category_id || item.category.id || 4;
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
            let returnValue = createResult.dataValues;
            returnValue.ages = [];
            let agesPromise = Promise.map(item.ages, (age) => {
                return addAgeToItem(createResult, age)
                    .then((result) => {
                        returnValue.ages.push(result);
                    });
            });

            let factorsPromise = Promise.map(item.factors, (factor) => {
                return addFactorToItem(createResult, factor)
                    .then((result) => {
                        returnValue.ages.push(result);
                    });
            });

            return Promise.all([agesPromise, factorsPromise]).then(function () {
                return createResult;
            });
        });
};

items.updateItem = (id, item, userId) => {
    debug("updateItem");
    if (item.personal == true) {
        console.log("item.created_by_id: ", item.created_by_id);
        console.log("userId: ", userId);
        if (item.created_by_id != userId) {
            return Promise.reject({
                showMessage: "You can not mark this item private, it was not created by you",
                status: 400
            })
        }
    }
    item.category_id = item.category_id || item.category.id || 4;
    return itemsTable.update(item, {
        where: {
            id: id,
            $or: [
                {
                    personal: 0
                },
                {
                    personal: 1,
                    created_by_id: userId
                }
            ]
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
        return items.getItem(id, userId).then(function (itemResult) {
            let returnValue = itemResult.dataValues;


            let agesPromise = updateItemAges(itemResult, item.ages)
                .then(function (newFactors) {
                    returnValue.factors = newFactors;
                });

            let factorsPromise = updateItemFactors(itemResult, item.factors)
                .then(function (newFactors) {
                    returnValue.factors = newFactors;
                });
            return Promise.all([agesPromise, factorsPromise]).then(function () {
                return returnValue;
            });
        });
    });
};

items.deleteItem = (id, userId) => {
    debug("deleteItem");
    return itemsTable.destroy({
        where: {
            id: id,
            $or: [
                {
                    personal: 0
                },
                {
                    personal: 1,
                    created_by_id: userId
                }
            ]
        }
    }).then(function (destroyResults) {
        if (destroyResults === 0) {
            return Promise.reject({
                errors: ITEM_NOT_FOUND,
                location: "items.deleteItem",
                showMessage: "Item ID: " + id + " not found",
                status: 404
            });
        }
        return destroyResults;
    });
};

function updateItemAges(item, ages) {
    debug("updateItemAges");
    let agesNames = [];

    let agesLength = ages.length;
    for (let i = 0; i < agesLength; i++) {
        let age = ages[i];
        agesNames.push(age.name);
    }

    let updatedAges = [];
    return agesTable.findAll({
        include: [{
            model: itemsTable,
            where: {id: item.id},
            attributes: ["id"],
            through: {
                attributes: []
            }
        }]
    }).then(function (foundAges) {
        return Promise.map(foundAges, (age) => {
            let index = agesNames.indexOf(age.name);
            if (index === -1) {
                debug("removing age %o from item", age.name);
                return item.removeAges(age);
            } else {
                debug("updating age %o relationship with item", age.name);
                let updateAgeInfo = ages[index].items_per_age;
                if (!updateAgeInfo.days) {
                    updateAgeInfo.days = null;
                }
                if (!updateAgeInfo.items) {
                    updateAgeInfo.items = null;
                }
            }
        });
    }).then(function () {
        return Promise.map(ages, (age)=> {
            debug("adding age id %o to item", age.id);
            return addAgeToItem(item, age)
                .then((result) => {
                    updatedAges.push(result);
                });
        });
    }).then(function () {
        return updatedAges;
    });
}

function addAgeToItem(item, age) {
    debug('addAgeToItem');
    return agesTable.find({
        where: Sequelize.or(
            {
                name: age.name
            },
            {
                id: age.id
            }
        )
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
        debug('adding age: %o to item: %o', age.name, item.name);
        return item.addAges(ageResult, age.items_per_age)
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
    let updatedFactors = [];
    return factorsTable.findAll({
        attributes: ["id"],
        include: [{
            model: itemsTable,
            where: {id: item.id},
            attributes: ["id"],
            through: {
                attributes: []
            }
        }]
    }).then(function (foundFactors) {
        return Promise.map(foundFactors, (factor) => {
            let index = factors.indexOf(factor.id);
            if (index === -1) {
                debug("removing factor id %o from item", factor.id);
                return item.removeFactors(factor);
            } else {
                debug("keeping factor id %o on item", factor.id);
                updatedFactors.push(factor.id);
                return factors.splice(index, 1);
            }
        });
    }).then(function () {
        return Promise.map(factors, (factorId)=> {
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
                message: "factor_not_found",
                location: "items.addFactor findFactor empty",
                showMessage: "The requested Factor (" + factorId + ") was not found",
                status: 400
            });
        }

        return item.addFactors(factorResult)
            .catch((error) => {
                return Promise.reject({
                    error: error,
                    message: "sequelize_error",
                    location: "addFactorToItem sequelize addFactor",
                    showMessage: error.showMessage || "Error trying to add Factor to Item",
                    status: error.status || 500
                });
            });
    });
}