var db = require('./database');
var user = require('./users'),
    ages = require('./ages');

var itemsSchema = {
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
    personal: {
        type: db.BOOLEAN,
        default: false
    },
    required: {
        type: db.BOOLEAN,
        default: true
    },
    always_needed: { // jshint ignore:line
        type: db.BOOLEAN,
        default: false
    },
    created_by_id: { // jshint ignore:line
        type: db.INTEGER.UNSIGNED
    }
};

var items = db.connection.define('items', itemsSchema, {
    freezeTableName: true,
    timestamps: true,
    paranoid: true,
    underscored: true
});

items.hasOne(user, {foreignKey: 'created_by_id'});

var itemsPerAgeSchema = {
        days: {
            type: db.INTEGER.UNSIGNED
        },
        items: {
            type: db.STRING
        }
    },
    itemsPerAge = db.connection.define('items_per_age', itemsPerAgeSchema, {
        freezeTableName: true,
        timestamps: true,
        paranoid: true,
        underscored: true
    });
items.belongsToMany(ages, {through: itemsPerAge});
ages.belongsToMany(items, {through: itemsPerAge});

module.exports = items;
