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
    start_date: { // jshint ignore:line
        type: db.DATETIME,
        allowNull: false
    },
    end_date: { // jshint ignore:line
        type: db.DATETIME,
        allowNull: false
    },
    created_by_id: { // jshint ignore:line
        type: db.INTEGER,
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
        timestamps: true,
        paranoid: true,
        underscored: true
    });
vacations.belongsToMany(factors, {through: vacationsFactors});
factors.belongsToMany(vacations, {through: vacationsFactors});

var vacationsParticipantsSchema = {},
    vacationsParticipants = db.connection.define('vacations_participants', vacationsParticipantsSchema, {
        freezeTableName: true,
        timestamps: true,
        paranoid: true,
        underscored: true
    });
vacations.belongsToMany(participants, {through: vacationsParticipants});
participants.belongsToMany(vacations, {through: vacationsParticipants, as: "participants"});

participants.hasMany(vacations, {through: "created_by_id", as: "creator"});


// Was used to generate the SQL statements
db.connection.sync();

module.exports = vacations;
