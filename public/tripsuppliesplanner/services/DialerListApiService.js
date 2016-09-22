powerdialerApp.factory(
    'DialerListApiService',
    [
        '$q',
        '$location',
        'RestangularFactory',
        'ENV',

        function ($q,
                  $location,
                  restangularFactory,
                  ENV) {
            'use strict';
            var debugging = false;

            var DialerListApiService = {};

            function convertItemForApi(itemData) {
                return itemData;
            }

            function appendUserInfo(data) {
                data.user_id = 0; // jshint ignore:line
                return data;
            }

            DialerListApiService.getAllItems = function () {
                return restangularFactory.one('items').get().then(function (returnedData) {
                    if (debugging) {
                        console.log("getAllItems: ", returnedData);
                    }
                    return returnedData;
                });
            };

            DialerListApiService.saveItem = function (itemData, itemId) {
                var convertedItem = convertItemForApi(itemData);
                convertedItem = appendUserInfo(convertedItem);
                return restangularFactory.allUrl('.').customPUT(convertedItem, "items/" + itemId).then(function (returnedData) {
                    if (debugging) {
                        console.log("saveItem: ", returnedData);
                    }
                    return returnedData;
                });
            };

            DialerListApiService.createItem = function (itemData) {
                var convertedItem = convertItemForApi(itemData);
                convertedItem = appendUserInfo(convertedItem);
                return restangularFactory.all('items').post(convertedItem).then(function (returnedData) {
                    if (debugging) {
                        console.log("createItem: ", returnedData);
                    }
                    return returnedData;
                });
            };

            DialerListApiService.deleteItem = function (itemId) {
                return restangularFactory.one('items').all(itemId).remove().then(function (returnedData) {
                    if (debugging) {
                        console.log("deleteItem: ", returnedData);
                    }
                    return returnedData;
                });
            };

            DialerListApiService.getAllFactors = function () {
                return restangularFactory.one('factors').get().then(function (returnedData) {
                    if (debugging) {
                        console.log("getAllFactors: ", returnedData);
                    }
                    return returnedData;
                });
            };

            return DialerListApiService;
        }
    ]
);