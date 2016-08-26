var database = require('./database');
var Promise = require('bluebird');
var debug = require('debug')('tripsuppliesplanner:db:itemsModel');

function getItemsCollection() {
    return database.getDb().then(function (db) {
        return {
            collection: db.collection('items'),
            db: db
        }
    })
}

var itemsModel = {
    find: (variables) => {
        debug("finding: %o", variables);
        return getItemsCollection()
            .then(function (dbResult) {
                debug("running query");
                // Insert a document
                return dbResult.collection.find(variables)
                    .then(function (result) {
                        debug("found " + result.length + " items using: %o", variables);
                        dbResult.db.close();
                        return result;
                    })
                    .catch(function (e) {
                        dbResult.db.close();
                        Promise.reject(e);
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
            .then(function (dbResult) {
                // Insert a document
                return dbResult.collection.insert(items)
                    .then(function (result) {
                        debug("Inserted result: %o", result);

                        dbResult.db.close();
                        return result.insertedIds.slice(1, result.insertedIds.length);
                    })
                    .catch(function (e) {
                        dbResult.db.close();
                        Promise.reject(e);
                    });
            });
    },
    removeId: (id) => {
        return getItemsCollection()
            .then(function (dbResult) {
                return dbResult.collection.removeById(id)
                    .then(function (result) {
                        debug("remove result: %o", result);

                        dbResult.db.close();
                        return result;
                    })
                    .catch(function (e) {
                        dbResult.db.close();
                        Promise.reject(e);
                    });
            })
    }
};

module.exports = itemsModel;