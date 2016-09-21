var db = require('./database');

var agesSchema = {
    id: {
        type: db.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: { // ["Baby", "Toddler", "Kid", "Adult"]
        type: db.STRING(30),
        allowNull: false
    }
};

var ages = db.connection.define('ages', agesSchema, {
    freezeTableName: true,
    timestamps: true,
    paranoid: true,
    underscored: true
});


module.exports = ages;
