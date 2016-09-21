var db = require('./database');
var families = require('./families'),
    ages = require('./ages');

var usersSchema = {
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
    age: {
        type: db.INTEGER.UNSIGNED,
        allowNull: false
    },
    family_id: { // jshint ignore:line
        type: db.INTEGER.UNSIGNED,
        required: true
    },
    email: {
        type: db.STRING(100)
    }
};

var users = db.connection.define('users', usersSchema, {
    freezeTableName: true,
    timestamps: true,
    paranoid: true,
    underscored: true
});

users.belongsTo(families, {foreignKey: 'family_id', as:'family'});
users.belongsTo(ages, {foreignKey: 'age', as:'age'});

module.exports = users;
