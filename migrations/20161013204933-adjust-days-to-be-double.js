'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.changeColumn(
            'items_per_age',
            'days',
            {
                type: Sequelize.DOUBLE.UNSIGNED
            }
        );
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.changeColumn(
            'items_per_age',
            'days',
            {
                type: Sequelize.INTEGER.UNSIGNED
            }
        );
    }
};
