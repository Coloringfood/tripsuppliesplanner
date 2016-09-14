var db = require('./mappingDatabase');
var customDataTypes = require('../../custom_data_types/sequelize-mysql-timestamp');
var categories = require('./categories');

var itemsSchema = {
    country_code: {
        type: db.STRING(30),
        allowNull: false
    },
    area_code: {
        type: db.STRING(30),
        allowNull: false
    },
    time_zone: {
        type: db.STRING(12)
    },
    categories_id: {
        type: db.INTEGER.UNSIGNED
    },
    date_created: {
        type: customDataTypes.TIMESTAMP,
        allowNull: false,
        defaultValue: db.NOW
    }
};

var items = db.connection.define('phone_number_area_code_map', itemsSchema, {
    freezeTableName: true,
    timestamps: false
});

items.belongsToMany(categories, {through: 'item_categories'});
categories.belongsToMany(items, {through: 'item_categories'});

module.exports = items;
