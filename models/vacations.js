var db = require('./database');
var factors = require('./factors'),
    participants = require('./users');

var vacationsSchema = {
    id: {
        type: db.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: db.STRING(30),
        allowNull: false
    },
    start_date: {
        type: db.DATE,
        allowNull: false
    },
    end_date: {
        type: db.DATE,
        allowNull: false
    },
    created_by_id: {
        type: db.INTEGER.UNSIGNED,
        allowNull: false
    }
};

var vacations = db.connection.define('vacations', vacationsSchema, {
    freezeTableName: true,
    timestamps: true,
    paranoid: true,
    underscored: true
});


// Set-up relationships
var vacationsFactorsSchema = {
        days: {
            type: db.INTEGER.UNSIGNED
        }
    },
    vacationsFactors = db.connection.define('vacations_factors', vacationsFactorsSchema, {
        freezeTableName: true,
        timestamps: false,
        paranoid: false,
        underscored: true
    });
vacations.belongsToMany(factors, {through: vacationsFactors});
factors.belongsToMany(vacations, {through: vacationsFactors});

var vacationsParticipantsSchema = {},
    vacationsParticipants = db.connection.define('vacations_participants', vacationsParticipantsSchema, {
        freezeTableName: true,
        timestamps: false,
        paranoid: false,
        underscored: true
    });
vacations.belongsToMany(participants, {through: vacationsParticipants, as: "participants"});
participants.belongsToMany(vacations, {through: vacationsParticipants});

vacations.belongsTo(participants, {foreignKey: "created_by_id", as: "creator"});


module.exports = vacations;
