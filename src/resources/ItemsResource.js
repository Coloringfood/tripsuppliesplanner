var ApiResource = require('./../resources/ApiResource');

var ItemsResource = {};
var itemsBaseUrl = '/list/';

ItemsResource.getAllItems = () => ApiResource.call(itemsBaseUrl);

ItemsResource.addItem = (item) => ApiResource.call(itemsBaseUrl, 'POST', {}, {value: item});

ItemsResource.removeItem = (item) => ApiResource.call(itemsBaseUrl + item._id, 'DELETE', {}, {});

ItemsResource.updateItem = (item) => ApiResource.call(itemsBaseUrl + item._id, 'PUT', {}, {item: item});

module.exports = ItemsResource;