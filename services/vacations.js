var vacations = module.exports = {};
var Promise = require('bluebird'),
    debug = require('debug')('tripsuppliesplanner:services:vacations'),
    factorsTable = require('./../models/factors'),
    usersTable = require('./../models/users'),
    vacationsTable = require('./../models/vacations');

var VACATION_NOT_FOUND = "vacation_not_found";
var VACATION_INCLUDE = [
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
var VACATION_ATTRIBUTES = [
    "id",
    "name",
    "start_date",
    "end_date",
    "created_by_id"
];

vacations.getAllVacations = () => {
    debug('getAllVacations');
    return vacationsTable.findAll({
        attributes: VACATION_ATTRIBUTES,
        include: VACATION_INCLUDE
    })
        .then(function (allVacationsResult) {
            return allVacationsResult;
        });
};

vacations.addVacation = (vacation) => {
    debug("addVacation");
    vacation.created_by_id = vacation.user_id; // jshint ignore:line
    return vacationsTable.create(vacation)
        .then(function (createVacationResult) {
            var returnValue = createVacationResult.dataValues;
            var participantsPromise = createVacationResult.addParticipants(vacation.created_by_id); // jshint ignore:line
            var factorsPromise = updateVacationFactors(createVacationResult, vacation.factors)

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
            var returnValue = vacationResult.dataValues;

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
                showMessage: "Item ID: " + id + " not found",
                status: 404
            });
        }
        return destroyResults;
    });
};

function updateVacationFactors(vacation, factors) {
    debug("updateVacationFactors");
    var factorIds = [];

    var factorsLength = factors.length;
    for (var i = 0; i < factorsLength; i++) {
        var factor = factors[i];
        factorIds.push(factor.id);
    }

    var updatedFactors = [];
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
            var index = factorIds.indexOf(factor.id);
            if (index === -1) {
                debug("removing factor %o from item", factor.name);
                return vacation.removeFactors(factor);
            } else {
                debug("updating factor %o relationship with item", factor.name);
                var updateAgeInfo = factors[index].vacations_factors; // jshint ignore:line
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
                location: "items.addFactor findFactor empty",
                showMessage: "The requested Factor (" + factorData.id + ") was not found",
                status: 400
            });
        }

        return vacation.addFactors(factorResult, factorData.vacations_factors)
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