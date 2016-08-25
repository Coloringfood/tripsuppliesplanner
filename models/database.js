var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/tripsuppliesplanner';

var database = {};

database.runQuery = function (callback) {
    // Use connect method to connect to the server
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        var collection = db.collection("tripsuppliesplanner");

        callback(collection, function () {
            db.close();
        })
    });
};


module.exports = {};