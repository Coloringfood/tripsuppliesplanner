var MongoClient = require('mongodb').MongoClient
    , assert = require('assert'),
    config = require("./../config/config.json");

// Connection URL
var url = 'mongodb://' + config.database.host + ':' + config.database.port +'27017/tripsuppliesplanner';

var database = {};

database.runQuery = function (callback) {
    // Use connect method to connect to the server
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        var collection = db.collection(config.database.database);

        callback(collection, function () {
            db.close();
        })
    });
};


module.exports = {};