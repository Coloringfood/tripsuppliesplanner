module.exports = items = {};
var Promise = require('bluebird');

items.getAllItems = function () {
    return Promise.resolve([
        {
            id: 0,
            name: "First",
            categories: "1,2,3"
        },{
            id: 1,
            name: "second",
            categories: "2,4,6"
        }
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