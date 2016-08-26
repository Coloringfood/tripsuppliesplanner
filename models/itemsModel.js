var database = require('./database');
var debug = require('debug')('tripsuppliesplanner:db:itemsModel');

function getItemsCollection() {
    return database.getDb().then(function (db) {
        return db.collection('items');
    })
}

var itemsModel = {
    find: (variables) => {
        debug("finding: %o", variables);
        return getItemsCollection()
            .then(function (collection) {
                debug("running query");
                // Insert a document
                return collection.find({}).then(function (result) {
                    // debug("found " + result.length + " items using: %o", items);
                    debug("found: %o", result);

                    return result;
                });
            });
    },
    insert: (item) => {
        debug("insert: %o", item);
        var items = item;
        if (!Array.isArray(item)) {
            items = [item]
        }
        return getItemsCollection()
            .then(function (collection) {
                // Insert a document
                return collection.insert(items).then(function (result) {
                    debug("Inserted result: " + result);

                    return result
                });
            });
    }
};

module.exports = itemsModel;