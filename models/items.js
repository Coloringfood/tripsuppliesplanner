var db = require('./database');
var user = require('./users'),
    ages = require('./ages'),
    categories = require('./categories');

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
    always_needed: {
        type: db.BOOLEAN,
        default: false
    },
    category_id: {
        type: db.INTEGER.UNSIGNED,
        defaultValue: 4
    },
    created_by_id: {
        type: db.INTEGER.UNSIGNED
    }
};

var items = db.connection.define('items', itemsSchema, {
    freezeTableName: true,
    timestamps: true,
    paranoid: true,
    underscored: true
});

items.belongsTo(user, {foreignKey: 'created_by_id'});
items.belongsTo(categories, {foreignKey: 'category_id', as: "category"});

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
        paranoid: false,
        underscored: true
    });
items.belongsToMany(ages, {through: itemsPerAge});
ages.belongsToMany(items, {through: itemsPerAge});

items.itemsPerAgeTable = itemsPerAge;

module.exports = items;
