module.exports = {
    up: function (queryInterface, Sequelize) {
        'use strict';
        return queryInterface.sequelize.query(
            "CREATE TABLE `items` (" +
            "`id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT, " +
            "`name` VARCHAR(30) NOT NULL, " +
            "`created_by` VARCHAR(255) NOT NULL, " +
            "`created_at` DATETIME NOT NULL, " +
            "`updated_at` DATETIME NOT NULL, " +
            "`deleted_at` DATETIME NULL DEFAULT NULL, " +
            "PRIMARY KEY (`id`) " +
            ")" +
            "COLLATE = 'utf8_general_ci'" +
            "ENGINE = InnoDB" +
            ";")
            .then(function () {
                return queryInterface.sequelize.query(
                    "CREATE TABLE `categories` (" +
                    "`id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT, " +
                    "`name` VARCHAR(30) NOT NULL, " +
                    "`created_by` VARCHAR(255) NOT NULL, " +
                    "`created_at` DATETIME NOT NULL, " +
                    "`updated_at` DATETIME NOT NULL, " +
                    "`deleted_at` DATETIME NULL DEFAULT NULL, " +
                    "PRIMARY KEY (`id`) " +
                    ")" +
                    "COLLATE = 'utf8_general_ci'" +
                    "ENGINE = InnoDB" +
                    ";");
            })
            .then(function () {
                return queryInterface.sequelize.query(
                    "CREATE TABLE `item_categories` ( " +
                    "`created_at` DATETIME NOT NULL, " +
                    "`updated_at` DATETIME NOT NULL, " +
                    "`item_id` INT(10) UNSIGNED NOT NULL, " +
                    "`category_id` INT(10) UNSIGNED NOT NULL, " +
                    "PRIMARY KEY (`item_id`, `category_id`), " +
                    "INDEX `category_id` (`category_id`), " +
                    "CONSTRAINT `item_categories_ibfk_1` FOREIGN KEY (`item_id`) REFERENCES `items` (`id`) ON UPDATE CASCADE ON DELETE CASCADE, " +
                    "CONSTRAINT `item_categories_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON UPDATE CASCADE ON DELETE CASCADE " +
                    ")" +
                    "COLLATE='utf8_general_ci'" +
                    "ENGINE=InnoDB" +
                    ";"
                );
            });
    },

    down: function (queryInterface, Sequelize) {
        'use strict';
        return queryInterface.dropAllTables();
    }
};
