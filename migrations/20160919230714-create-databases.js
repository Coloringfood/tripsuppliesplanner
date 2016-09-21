module.exports = {
    up: function (queryInterface, Sequelize) {
        'use strict';
        return queryInterface.sequelize.query(
            `-- --------------------------------------------------------
            -- Host:                         localhost
            -- Server version:               5.7.15-log - MySQL Community Server (GPL)
            -- Server OS:                    Win64
            -- HeidiSQL Version:             9.3.0.4984
            -- --------------------------------------------------------
            
            /*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
            /*!40101 SET NAMES utf8mb4 */;
            /*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
            /*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
            
            -- Dumping structure for table tripsuppliesplanner.ages
            CREATE TABLE IF NOT EXISTS \`ages\` (
              \`id\` int(10) unsigned NOT NULL AUTO_INCREMENT,
              \`name\` varchar(30) NOT NULL,
              \`created_at\` datetime NOT NULL,
              \`updated_at\` datetime NOT NULL,
              \`deleted_at\` datetime DEFAULT NULL,
              PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
            
            -- Dumping data for table tripsuppliesplanner.ages: ~0 rows (approximately)
            /*!40000 ALTER TABLE \`ages\` DISABLE KEYS */;
            INSERT IGNORE INTO \`ages\` (\`id\`, \`name\`, \`created_at\`, \`updated_at\`, \`deleted_at\`) VALUES
                (1, 'Baby', '2016-09-21 13:02:32', '2016-09-21 13:02:33', NULL),
                (2, 'Toddler', '2016-09-21 13:03:26', '2016-09-21 13:03:27', NULL),
                (3, 'Kid', '2016-09-21 13:03:36', '2016-09-21 13:03:37', NULL),
                (4, 'Adult', '2016-09-21 13:03:55', '2016-09-21 13:03:55', NULL);
            /*!40000 ALTER TABLE \`ages\` ENABLE KEYS */;
            
            
            -- Dumping structure for table tripsuppliesplanner.factors
            CREATE TABLE IF NOT EXISTS \`factors\` (
              \`id\` int(10) unsigned NOT NULL AUTO_INCREMENT,
              \`name\` varchar(30) NOT NULL,
              \`type\` enum('Vacation Type','Activities','Other') NOT NULL,
              \`created_by\` varchar(255) NOT NULL,
              \`created_at\` datetime NOT NULL,
              \`updated_at\` datetime NOT NULL,
              \`deleted_at\` datetime DEFAULT NULL,
              PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
            
            -- Dumping data for table tripsuppliesplanner.factors: ~0 rows (approximately)
            /*!40000 ALTER TABLE \`factors\` DISABLE KEYS */;
            /*!40000 ALTER TABLE \`factors\` ENABLE KEYS */;
            
            
            -- Dumping structure for table tripsuppliesplanner.families
            CREATE TABLE IF NOT EXISTS \`families\` (
              \`id\` int(10) unsigned NOT NULL AUTO_INCREMENT,
              \`name\` varchar(30) NOT NULL,
              \`mother_id\` int(10) unsigned DEFAULT NULL,
              \`father_id\` int(10) unsigned DEFAULT NULL,
              \`created_at\` datetime NOT NULL,
              \`updated_at\` datetime NOT NULL,
              \`deleted_at\` datetime DEFAULT NULL,
              PRIMARY KEY (\`id\`),
              KEY \`families_ibfk_1\` (\`mother_id\`),
              KEY \`families_ibfk_2\` (\`father_id\`),
              CONSTRAINT \`families_ibfk_1\` FOREIGN KEY (\`mother_id\`) REFERENCES \`users\` (\`id\`) ON DELETE SET NULL ON UPDATE CASCADE,
              CONSTRAINT \`families_ibfk_2\` FOREIGN KEY (\`father_id\`) REFERENCES \`users\` (\`id\`) ON DELETE SET NULL ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
            
            -- Dumping data for table tripsuppliesplanner.families: ~0 rows (approximately)
            /*!40000 ALTER TABLE \`families\` DISABLE KEYS */;
            /*!40000 ALTER TABLE \`families\` ENABLE KEYS */;
            
            
            -- Dumping structure for table tripsuppliesplanner.items
            CREATE TABLE IF NOT EXISTS \`items\` (
              \`id\` int(10) unsigned NOT NULL AUTO_INCREMENT,
              \`name\` varchar(30) NOT NULL,
              \`personal\` tinyint(1) DEFAULT NULL,
              \`required\` tinyint(1) DEFAULT NULL,
              \`always_needed\` tinyint(1) DEFAULT NULL,
              \`created_by_id\` int(10) unsigned DEFAULT NULL,
              \`created_at\` datetime NOT NULL,
              \`updated_at\` datetime NOT NULL,
              \`deleted_at\` datetime DEFAULT NULL,
              PRIMARY KEY (\`id\`),
              KEY \`created_by_id\` (\`created_by_id\`),
              CONSTRAINT \`items_ibfk_1\` FOREIGN KEY (\`created_by_id\`) REFERENCES \`users\` (\`id\`) ON DELETE NO ACTION ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
            
            -- Dumping data for table tripsuppliesplanner.items: ~0 rows (approximately)
            /*!40000 ALTER TABLE \`items\` DISABLE KEYS */;
            /*!40000 ALTER TABLE \`items\` ENABLE KEYS */;
            
            
            -- Dumping structure for table tripsuppliesplanner.items_per_age
            CREATE TABLE IF NOT EXISTS \`items_per_age\` (
              \`days\` int(10) unsigned DEFAULT NULL,
              \`items\` varchar(255) DEFAULT NULL,
              \`created_at\` datetime NOT NULL,
              \`updated_at\` datetime NOT NULL,
              \`deleted_at\` datetime DEFAULT NULL,
              \`item_id\` int(10) unsigned NOT NULL,
              \`age_id\` int(10) unsigned NOT NULL,
              PRIMARY KEY (\`item_id\`,\`age_id\`),
              KEY \`age_id\` (\`age_id\`),
              CONSTRAINT \`items_per_age_ibfk_1\` FOREIGN KEY (\`item_id\`) REFERENCES \`items\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE,
              CONSTRAINT \`items_per_age_ibfk_2\` FOREIGN KEY (\`age_id\`) REFERENCES \`ages\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
            
            -- Dumping data for table tripsuppliesplanner.items_per_age: ~0 rows (approximately)
            /*!40000 ALTER TABLE \`items_per_age\` DISABLE KEYS */;
            /*!40000 ALTER TABLE \`items_per_age\` ENABLE KEYS */;
            
            
            -- Dumping structure for table tripsuppliesplanner.item_factors
            CREATE TABLE IF NOT EXISTS \`item_factors\` (
              \`created_at\` datetime NOT NULL,
              \`updated_at\` datetime NOT NULL,
              \`item_id\` int(10) unsigned NOT NULL,
              \`factor_id\` int(10) unsigned NOT NULL,
              PRIMARY KEY (\`item_id\`,\`factor_id\`),
              KEY \`factor_id\` (\`factor_id\`),
              CONSTRAINT \`item_factors_ibfk_1\` FOREIGN KEY (\`item_id\`) REFERENCES \`items\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE,
              CONSTRAINT \`item_factors_ibfk_2\` FOREIGN KEY (\`factor_id\`) REFERENCES \`factors\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
            
            -- Dumping data for table tripsuppliesplanner.item_factors: ~0 rows (approximately)
            /*!40000 ALTER TABLE \`item_factors\` DISABLE KEYS */;
            /*!40000 ALTER TABLE \`item_factors\` ENABLE KEYS */;
            
            
            -- Dumping structure for table tripsuppliesplanner.users
            CREATE TABLE IF NOT EXISTS \`users\` (
              \`id\` int(10) unsigned NOT NULL AUTO_INCREMENT,
              \`name\` varchar(30) NOT NULL,
              \`age_id\` int(10) unsigned NOT NULL,
              \`family_id\` int(10) unsigned DEFAULT NULL,
              \`email\` varchar(100) DEFAULT NULL,
              \`created_at\` datetime NOT NULL,
              \`updated_at\` datetime NOT NULL,
              \`deleted_at\` datetime DEFAULT NULL,
              PRIMARY KEY (\`id\`),
              KEY \`age_id\` (\`age_id\`),
              KEY \`family_id\` (\`family_id\`),
              CONSTRAINT \`users_ibfk_1\` FOREIGN KEY (\`age_id\`) REFERENCES \`ages\` (\`id\`) ON DELETE NO ACTION ON UPDATE CASCADE,
              CONSTRAINT \`users_ibfk_2\` FOREIGN KEY (\`family_id\`) REFERENCES \`families\` (\`id\`) ON DELETE NO ACTION ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
            
            -- Dumping data for table tripsuppliesplanner.users: ~0 rows (approximately)
            /*!40000 ALTER TABLE \`users\` DISABLE KEYS */;
            /*!40000 ALTER TABLE \`users\` ENABLE KEYS */;
            
            
            -- Dumping structure for table tripsuppliesplanner.vacations
            CREATE TABLE IF NOT EXISTS \`vacations\` (
              \`id\` int(10) unsigned NOT NULL AUTO_INCREMENT,
              \`name\` varchar(30) NOT NULL,
              \`start_date\` datetime NOT NULL,
              \`end_date\` datetime NOT NULL,
              \`created_by_id\` int(11) unsigned NOT NULL,
              \`created_at\` datetime NOT NULL,
              \`updated_at\` datetime NOT NULL,
              \`deleted_at\` datetime DEFAULT NULL,
              PRIMARY KEY (\`id\`),
              KEY \`vacations_ibfk_1\` (\`created_by_id\`),
              CONSTRAINT \`vacations_ibfk_1\` FOREIGN KEY (\`created_by_id\`) REFERENCES \`users\` (\`id\`) ON DELETE SET NULL ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
            
            -- Dumping data for table tripsuppliesplanner.vacations: ~0 rows (approximately)
            /*!40000 ALTER TABLE \`vacations\` DISABLE KEYS */;
            /*!40000 ALTER TABLE \`vacations\` ENABLE KEYS */;
            
            
            -- Dumping structure for table tripsuppliesplanner.vacations_factors
            CREATE TABLE IF NOT EXISTS \`vacations_factors\` (
              \`days\` int(10) unsigned DEFAULT NULL,
              \`created_at\` datetime NOT NULL,
              \`updated_at\` datetime NOT NULL,
              \`deleted_at\` datetime DEFAULT NULL,
              \`vacation_id\` int(10) unsigned NOT NULL,
              \`factor_id\` int(10) unsigned NOT NULL,
              PRIMARY KEY (\`vacation_id\`,\`factor_id\`),
              KEY \`factor_id\` (\`factor_id\`),
              CONSTRAINT \`vacations_factors_ibfk_1\` FOREIGN KEY (\`vacation_id\`) REFERENCES \`vacations\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE,
              CONSTRAINT \`vacations_factors_ibfk_2\` FOREIGN KEY (\`factor_id\`) REFERENCES \`factors\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
            
            -- Dumping data for table tripsuppliesplanner.vacations_factors: ~0 rows (approximately)
            /*!40000 ALTER TABLE \`vacations_factors\` DISABLE KEYS */;
            /*!40000 ALTER TABLE \`vacations_factors\` ENABLE KEYS */;
            
            
            -- Dumping structure for table tripsuppliesplanner.vacations_participants
            CREATE TABLE IF NOT EXISTS \`vacations_participants\` (
              \`created_at\` datetime NOT NULL,
              \`updated_at\` datetime NOT NULL,
              \`deleted_at\` datetime DEFAULT NULL,
              \`vacation_id\` int(10) unsigned NOT NULL,
              \`user_id\` int(10) unsigned NOT NULL,
              PRIMARY KEY (\`vacation_id\`,\`user_id\`),
              KEY \`user_id\` (\`user_id\`),
              CONSTRAINT \`vacations_participants_ibfk_1\` FOREIGN KEY (\`vacation_id\`) REFERENCES \`vacations\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE,
              CONSTRAINT \`vacations_participants_ibfk_2\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
            
            -- Dumping data for table tripsuppliesplanner.vacations_participants: ~0 rows (approximately)
            /*!40000 ALTER TABLE \`vacations_participants\` DISABLE KEYS */;
            /*!40000 ALTER TABLE \`vacations_participants\` ENABLE KEYS */;
            /*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
            /*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
            /*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
            `);
    },

    down: function (queryInterface, Sequelize) {
        'use strict';
        return queryInterface.dropAllTables();
    }
};
