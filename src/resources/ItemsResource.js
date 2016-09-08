var ApiResource = require('./../resources/ApiResource');

var ItemsResource = {};

ItemsResource.getAllItems = () => ApiResource.call('/list');

ItemsResource.addItem = (item) => ApiResource.call('/list', 'POST', {}, {value: item});

module.exports = ItemsResource;