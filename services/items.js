module.exports = items = {};
var Promise = require('bluebird');

items.getAllItems = function () {
    return Promise.resolve([
        "test",
        "test2"
    ])
};

items.addItem = function (item) {
    return Promise.resolve(item)
};

items.updateItem = function (id, item) {
    return Promise.resolve(item);
};

items.deleteItem = function (id) {
    return Promise.resolve("removed id: " + id)
};