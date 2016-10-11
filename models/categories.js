var db = require('./database');

var agesSchema = {
    id: {
        type: db.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: db.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: db.STRING,
        allowNull: false
    }
};

var ages = db.connection.define('categories', agesSchema, {
    freezeTableName: true,
    timestamps: true,
    paranoid: true,
    underscored: true
});


module.exports = ages;
