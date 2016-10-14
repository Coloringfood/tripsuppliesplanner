'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable(
            'categories',
            {
                id: {
                    type: Sequelize.INTEGER.UNSIGNED,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false
                },
                name: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                description: {
                    type: Sequelize.STRING,
                    allowNull: false
                }
            },
            {
                charset: 'utf8',
                collate: 'utf8_unicode_ci',
                comment: 'Filters applied to rules to select prospects'
            }
        ).then(() => {
            // Add Default Categories
            return queryInterface.sequelize.query(
                "INSERT IGNORE INTO \`categories\` (\`id\`, \`name\`, \`description\`) VALUES" +
                "(1,  'Clothing & Accessories',  'Sleepware, jewerly, scarf, hats')," +
                "(2,  'Personal Items & Hygine', 'Toiletries, makeup, Glasses')," +
                "(3,  'Health',                  'Medicine, epipen, first-aid-kit')," +
                "(4,  'Misc',                    'Cooler, pen and paper, swiss-army knife')," +
                "(5,  'Electronics',             'Chargers, Phones, GPS, Camera')," +
                "(6,  'Important Necessities',   'Passport, credit card, cache')," +
                "(7,  'Outdoor Supplies',        'Beach, camping, hiking supplies')," +
                "(8,  'Kids',                    'Baby food, car seat, stuffed animal')," +
                "(9,  'Travel',                  'travel blanket, earplug, travel-guide')," +
                "(10, 'Entertainment',           'Board games, movies, Books');"
            );

        }).then(() => {
            return queryInterface.addColumn('items', 'category_id', {
                type: Sequelize.INTEGER.UNSIGNED,
                references: {
                    model: 'categories',
                    key: 'id'
                },
                onUpdate: 'cascade',
                onDelete: 'no action',
                defaultValue: 4
            });
        }).then(() => {
            return queryInterface.sequelize.query(
                "ALTER TABLE `items`" +
                "CHANGE COLUMN `category_id` `category_id` INT(10) UNSIGNED NULL DEFAULT '4' AFTER `always_needed`;"
            );
        });
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.removeColumn('items', 'category_id')
            .then(() => {
                return queryInterface.dropTable('categories');
            });
    }
};
