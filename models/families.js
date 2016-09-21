var db = require('./database');
var people = require('./users');

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
    mother_id: { // jshint ignore:line
        type: db.INTEGER.UNSIGNED
    },
    father_id: { // jshint ignore:line
        type: db.INTEGER.UNSIGNED
    }
};

var families = db.connection.define('families', familiesSchema, {
    freezeTableName: true,
    timestamps: true,
    paranoid: true,
    underscored: true
});

families.belongsTo(people, {foreignKey: 'mother_id', as: "mother"});
families.belongsTo(people, {foreignKey: 'father_id', as: "father"});


module.exports = families;
