var api = require('./../resources/ApiResource');

var ItemsResource = {};

ItemsResource.getAllItems = () => {
    return api.call('/list');
};

module.exports = ItemsResource;