'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.addColumn(
            'users',
            'username',
            {
                type: Sequelize.STRING(30)
            }
        )
            .then(function () {
                return queryInterface.addColumn(
                    'users',
                    'password',
                    {
                        type: Sequelize.STRING()
                    }
                );
            });
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.removeColumn('users', 'username')
            .then(function () {
                return queryInterface.removeColumn('users', 'password');
            });
    }
};
