'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.changeColumn(
            'items_per_age',
            'days',
            {
                type: Sequelize.DOUBLE.UNSIGNED
            }
        ).then(()=> {
            return queryInterface.changeColumn(
                'users',
                'username',
                {
                    type: Sequelize.STRING(30),
                    allowNull: true,
                    unique: true
                }
            );
        });
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.changeColumn(
            'items_per_age',
            'days',
            {
                type: Sequelize.INTEGER.UNSIGNED
            }
        ).then(() => {
            return queryInterface.chanegColumn(
                'users',
                'UniqueUsername',
                {
                    type: Sequelize.STRING(30),
                    allowNull: true
                }
                );
        });
    }
};
