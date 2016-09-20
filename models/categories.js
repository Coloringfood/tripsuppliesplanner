var db = require('./database');

var categoriesSchema = { id: {
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

var categories = db.connection.define('categories', categoriesSchema, {
    freezeTableName: true,
    timestamps: true,
    paranoid: true,
    underscored: true
});

module.exports = categories;
