var database = require('./database');
var Promise = require('bluebird');

var itemsModel = {
    insert: function (item) {
        var resolver, rejector,
            returnPromise = Promise(function (resolve, reject) {
                resolver = resolve;
                rejector = reject;
            });
        database.runQuery(function (collection, finished) {
            // Insert a document
            var insertPromise = collection.insert(item).then(function (err, result) {
                assert.equal(err, null);
                assert.equal(3, result.result.n);
                assert.equal(3, result.ops.length);
                console.log("Inserted 3 documents into the collection");

                finished();
                resolver();
            });
            resolver(insertPromise);
        });
        return returnPromise;
    }
};

module.exports = itemsModel;