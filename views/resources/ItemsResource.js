var ApiResource = require('./../resources/ApiResource');

var ItemsResource = {};

ItemsResource.getAllItems = () => ApiResource.call('/list');

ItemsResource.addItem = (item) => ApiResource.call('/list', 'PUT', {}, {value: item});

module.exports = ItemsResource;