var mongo = require('mongodb-bluebird'),
    config = require("./../config/config.json"),
    debug = require('debug')('tripsuppliesplanner:db:itemsModel');

// Connection URL
var url = 'mongodb://' + config.database.host + ':' + config.database.port + '/' + config.database.database;

var database = {};

database.getDb = function () {
    debug("Making connection to: " + url);
    return mongo.connect(url);
};


module.exports = database;