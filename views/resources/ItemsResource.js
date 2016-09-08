var ApiResource = require('./../resources/ApiResource');

var ItemsResource = {};

ItemsResource.getAllItems = () => ApiResource.call('/list');

ItemsResource.addItem = (item) => ApiResource.call('/list', 'PUT', {}, {value: item});

ItemsResource.removeItem = (item) => ApiResource.call('/list/' + item._id, 'DELETE', {}, {});

ItemsResource.updateItem = (item) => ApiResource.call('/list/' + item._id, 'PUT', {}, {item: item});

module.exports = ItemsResource;