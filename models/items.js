var db = require('./database');
var categories = require('./categories');

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
    created_by: {
        type: db.STRING,
        allowNull: false
    }
};

var items = db.connection.define('items', itemsSchema, {
    freezeTableName: true,
    timestamps: true,
    paranoid: true,
    underscored: true
});

items.belongsToMany(categories, {through: 'item_categories'});
categories.belongsToMany(items, {through: 'item_categories'});

// Was used to generate the SQL statements
//db.connection.sync();

module.exports = items;
