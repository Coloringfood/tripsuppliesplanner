var db = require('./database');
var items = require('./items');

var factorsSchema = {
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
    type: {
        type: db.ENUM(["Vacation Type", "Activities", "Other"]),
        allowNull: false
    },
    created_by: { // jshint ignore:line
        type: db.STRING,
        allowNull: false
    }
};

var factors = db.connection.define('factors', factorsSchema, {
    freezeTableName: true,
    timestamps: true,
    paranoid: true,
    underscored: true
});

items.belongsToMany(factors, {through: 'item_factors'});
factors.belongsToMany(items, {through: 'item_factors'});


module.exports = factors;
