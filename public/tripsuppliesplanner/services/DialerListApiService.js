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

            var DialerListApiService = {};

            function appendUserInfo(data) {
                // data.user_id = 1;
                // data.user_name = "Joe Tester";
                // data.owner_id = 1;
                // data.company_id = 1;
                return data;
            }

            DialerListApiService.saveItem = function (itemData) {
                var convertedItem = convertItemForApi(ruleData);
                convertedItem = appendUserInfo(convertedItem);
                return restangularFactory.allUrl('.').customPUT(convertedItem, "items/" + ruleData.id).then(function (returnedData) {
                    return returnedData;
                });
            };
            DialerListApiService.createRule = function (itemData, itemId) {
                var convertedItem = convertItemForApi(itemData);
                convertedItem = appendUserInfo(convertedItem);
                return restangularFactory.one('items').all(itemId).post(convertedItem).then(function (returnedData) {
                    return returnedData;
                });
            };

            return DialerListApiService;
        }
    ]
);