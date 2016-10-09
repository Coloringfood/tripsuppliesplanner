'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        // Adding Custom options for Users
        return queryInterface.addColumn(
            'users',
            'settings',
            {
                type: Sequelize.STRING,
                allowNull: true
            }
        );
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.removeColumn('users', 'settings');
    }
};
