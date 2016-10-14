var db = require('./database');

var familiesSchema = {
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
    mother_id: {
        type: db.INTEGER.UNSIGNED
    },
    father_id: {
        type: db.INTEGER.UNSIGNED
    }
};

var families = db.connection.define('families', familiesSchema, {
    freezeTableName: true,
    timestamps: true,
    paranoid: true,
    underscored: true
});


module.exports = families;
