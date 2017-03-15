let vacations = module.exports = {};
let Promise = require('bluebird'),
    debug = require('debug')('tripsuppliesplanner:services:vacations'),
    factorsTable = require('./../models/factors'),
    usersTable = require('./../models/users'),
    vacationsTable = require('./../models/vacations'),
    itemsTable = require('./../models/items'),
    agesTable = require('./../models/ages'),
    categoriesTable = require('./../models/categories');

let VACATION_NOT_FOUND = "vacation_not_found";
let VACATION_INCLUDE = [
    {
        model: usersTable,
        attributes: [
            "id",
            "name"
        ],
        as: "participants",
        through: {
            attributes: []
        }
    },
    {
        model: factorsTable,
        attributes: [
            "id",
            "name"
        ],
        through: {
            attributes: [
                "days"
            ]
        }
    }
];
let VACATION_ATTRIBUTES = [
    "id",
    "name",
    "start_date",
    "end_date",
    "created_by_id"
];

vacations.getAllVacations = (userId) => {
    debug('getAllVacations');
    return vacationsTable.findAll({
        where: {
            created_by_id: userId
        },
        attributes: VACATION_ATTRIBUTES,
        include: VACATION_INCLUDE
    })
        .then(function (allVacationsResult) {
            return allVacationsResult;
        });
};

vacations.addVacation = (vacation) => {
    debug("addVacation");
    return vacationsTable.create(vacation)
        .then(function (createVacationResult) {
            let returnValue = createVacationResult.dataValues;
            let participantsPromise = createVacationResult.addParticipants(vacation.created_by_id);
            let factorsPromise = updateVacationFactors(createVacationResult, vacation.factors);

            return Promise.all([participantsPromise, factorsPromise]).then(function (result) {
                returnValue.factors = result[1];
                return returnValue;
            });
        });
};

vacations.getVacation = (vacationId) => {
    debug("getVacation");
    return vacationsTable.find({
        attributes: VACATION_ATTRIBUTES,
        where: {
            id: vacationId
        },
        include: VACATION_INCLUDE
    })
        .then(function (vacationFindResult) {
            return vacationFindResult;
        });
};

vacations.updateVacation = (id, vacationData) => {
    return vacationsTable.update(vacationData, {
        where: {
            id: id
        }
    }).catch(function (error) {
        return Promise.reject({
            error: error,
            message: "sequelize_error",
            location: "vacations.updateVacation sequelize update",
            showMessage: error.showMessage || "Error trying to update vacation: " + id,
            status: error.status || 500
        });
    }).then(function (updateResult) {
        if (updateResult[0] === 0) {
            return Promise.reject({
                errors: VACATION_NOT_FOUND,
                location: "vacations.updateVacation",
                showMessage: "vacation ID: " + id + " not found",
                status: 404
            });
        }
        return vacations.getVacation(id).then(function (vacationResult) {
            let returnValue = vacationResult.dataValues;

            return updateVacationFactors(vacationResult, vacationData.factors).then(function (result) {
                returnValue.factors = result;
                return returnValue;
            });
        });
    });
};

vacations.deleteVacation = (id) => {
    return vacationsTable.destroy({
        where: {
            id: id
        }
    }).then(function (destroyResults) {
        if (destroyResults === 0) {
            return Promise.reject({
                errors: VACATION_NOT_FOUND,
                location: "vacations.deleteVacation",
                showMessage: "Vacation ID: " + id + " not found",
                status: 404
            });
        }
        return destroyResults;
    });
};

vacations.packingListForVacation = (vacationId, userId) => {
    return usersTable.find({
        where: {
            id: userId
        },
        attributes: [
            "id",
            "name"
        ],
        include: [
            {
                model: agesTable,
                as: 'age',
                attributes: [
                    "id",
                    "name"
                ]
            }
        ]
    })
        .then((userResult) => {
            let ageId = userResult.dataValues.age.id;
            let publicItemsPromise = getAllItemsForVacation(vacationId, ageId);
            let privateItemsPromise = getAllItemsForVacation(vacationId, ageId, userId);

            return Promise.all([publicItemsPromise, privateItemsPromise]).then(function (allResults) {
                let publicItems = allResults[0];
                let privateItems = allResults[1];
                return publicItems.concat(privateItems);
            });
        });
};

vacations.packingForAnonymous = (vacationData, ageId) => {
    delete vacationData.id;
    vacationData.created_by_id = 1;
    return vacations.addVacation(vacationData)
        .then((createResult) => {
            vacationsTable.find({
                where: {
                    id: createResult.id
                }
            }).then((vacation) => {
                vacation.destroy({ force: true });
            });
            return getAllItemsForVacation(createResult.id, ageId);
        });
};

function updateVacationFactors(vacation, factors) {
    debug("updateVacationFactors");
    let factorIds = [];

    let factorsLength = factors.length;
    for (let i = 0; i < factorsLength; i++) {
        let factor = factors[i];
        factorIds.push(factor.id);
    }

    let updatedFactors = [];
    return factorsTable.findAll({
        include: [{
            model: vacationsTable,
            where: {id: vacation.id},
            attributes: ["id"],
            through: {
                attributes: []
            }
        }]
    }).then(function (foundfactors) {
        return Promise.map(foundfactors, (factor) => {
            let index = factorIds.indexOf(factor.id);
            if (index === -1) {
                debug("removing factor %o from item", factor.name);
                return vacation.removeFactors(factor);
            } else {
                debug("updating factor %o relationship with item", factor.name);
                let updateAgeInfo = factors[index].vacations_factors;
                if (!updateAgeInfo.days) {
                    updateAgeInfo.days = null;
                }
            }
        });
    }).then(function () {
        return Promise.map(factors, (factor)=> {
            debug("adding factor id %o to item", factor.id);
            return addFactorToVacation(vacation, factor)
                .then((result) => {
                    updatedFactors.push(result);
                });
        });
    }).then(function () {
        return updatedFactors;
    });
}

function addFactorToVacation(vacation, factorData) {
    return factorsTable.find({
        where: {
            id: factorData.id
        }
    }).then((factorResult)=> {
        if (!factorResult) {
            return Promise.reject({
                message: "factor_not_found",
                location: "addFactorToVacation findFactor empty",
                showMessage: "The requested Factor (" + factorData.id + ") was not found",
                status: 400
            });
        }

        return vacation.addFactors(factorResult, factorData.vacations_factors)
            .catch((error) => {
                return Promise.reject({
                    error: error,
                    message: "sequelize_error",
                    location: "addFactorToVacation sequelize addFactor",
                    showMessage: error.showMessage || "Error trying to add Factor to Vacation",
                    status: error.status || 500
                });
            });
    });
}

function getAllItemsForVacation(vacationId, ageId, userId) {
    let AGES_INCLUDE = {
            model: agesTable,
            attributes: [
                "id",
                "name"
            ],
            where: {
                id: ageId
            },
            through: {
                attributes: [
                    "days",
                    "items"
                ]
            }
        },
        CATEGORY_INCLUDE = {
            model: categoriesTable,
            as: 'category',
            required: true
        },
        PRIVATE_OR_PUBLIC = [
            {
                personal: 0
            }
        ];
    if (userId) {
        PRIVATE_OR_PUBLIC = [
            {
                personal: 1,
                created_by_id: userId
            }
        ];
    }

    // Get items that are not attached to any factors
    let alwaysNeededItemsPromise = itemsTable.findAll({
        attributes: [
            "name",
            "personal",
            "required",
            "always_needed",
        ],
        where: {
            always_needed: 1,
            $or: PRIVATE_OR_PUBLIC
        },
        include: [
            CATEGORY_INCLUDE,
            AGES_INCLUDE
        ]
    });

    // Get Items related to factors on this Vacation
    let relatedItemsPromise = itemsTable.findAll({
        attributes: [
            "name",
            "personal",
            "required",
            "always_needed",
        ],
        where: {
            $or: PRIVATE_OR_PUBLIC
        },
        include: [
            {
                model: factorsTable,
                attributes: [
                    "id",
                    "name"
                ],
                through: {
                    attributes: [
                        "days"
                    ]
                },
                include: [
                    {
                        model: vacationsTable,
                        attributes: ["name"],
                        where: {
                            id: vacationId
                        }
                    }
                ]
            },
            CATEGORY_INCLUDE,
            AGES_INCLUDE
        ]
    });

    return Promise.all([alwaysNeededItemsPromise, relatedItemsPromise]).then(function (allResults) {
        let alwaysNeededItems = allResults[0];
        let relatedItems = allResults[1];
        return alwaysNeededItems.concat(relatedItems);
    });
}