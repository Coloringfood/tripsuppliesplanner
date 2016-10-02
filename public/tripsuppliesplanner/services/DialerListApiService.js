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

            function convertFactorForApi(factorData) {
                return factorData;
            }

            function appendUserInfo(data) {
                data.user_id = 1; // jshint ignore:line
                return data;
            }

            DialerListApiService.getAllItems = () => {
                return restangularFactory.one('items').get().then(function (returnedData) {
                    if (debugging) {
                        console.log("getAllItems: ", returnedData);
                    }
                    return returnedData;
                });
            };

            DialerListApiService.saveItem = (itemData, itemId) => {
                var convertedItem = convertItemForApi(itemData);
                convertedItem = appendUserInfo(convertedItem);
                return restangularFactory.allUrl('.').customPUT(convertedItem, "items/" + itemId).then(function (returnedData) {
                    if (debugging) {
                        console.log("saveItem: ", returnedData);
                    }
                    return returnedData;
                });
            };

            DialerListApiService.createItem = (itemData) => {
                var convertedItem = convertItemForApi(itemData);
                convertedItem = appendUserInfo(convertedItem);
                return restangularFactory.all('items').post(convertedItem).then(function (returnedData) {
                    if (debugging) {
                        console.log("createItem: ", returnedData);
                    }
                    return returnedData;
                });
            };

            DialerListApiService.deleteItem = (itemId) => {
                return restangularFactory.one('items').all(itemId).remove().then(function (returnedData) {
                    if (debugging) {
                        console.log("deleteItem: ", returnedData);
                    }
                    return returnedData;
                });
            };

            DialerListApiService.getAllFactors = () => {
                return restangularFactory.one('factors').get().then(function (returnedData) {
                    if (debugging) {
                        console.log("getAllFactors: ", returnedData);
                    }
                    return returnedData;
                });
            };

            DialerListApiService.createFactor = (factorData) => {
                var convertedFactor = convertFactorForApi(factorData);
                convertedFactor = appendUserInfo(convertedFactor);
                return restangularFactory.all('factors').post([convertedFactor]).then(function (returnedData) {
                    if (debugging) {
                        console.log("createFactor: ", returnedData);
                    }
                    return returnedData;
                });
            };

            DialerListApiService.getAllVacations = () => {
                return restangularFactory.one('vacations').get().then(function (returnedData) {
                    if (debugging) {
                        console.log("getAllVacations: ", returnedData);
                    }
                    return returnedData;
                });
            };

            DialerListApiService.deleteVacation = (vacationId) => {
                return restangularFactory.one('vacations').all(vacationId).remove().then(function (returnedData) {
                    if (debugging) {
                        console.log("deleteVacation: ", returnedData);
                    }
                    return returnedData;
                });
            };

            return DialerListApiService;
        }
    ]
);