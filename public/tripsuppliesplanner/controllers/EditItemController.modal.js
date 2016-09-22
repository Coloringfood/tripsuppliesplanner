powerdialerApp.controller('EditItemModalController',
    [
        '$scope',
        '$uibModalInstance',
        'item',
        'DialerListApiService',
        function ($scope, $uibModalInstance, item, DialerListApiService) {
            'use strict';
            var vm = this;

            vm.item = item;
            vm.newItem = angular.copy(item);
            console.log("vm.newItem: ", vm.newItem);

            vm.ok = function () {
                var returnPromise;
                if (vm.item.id) {
                    returnPromise = DialerListApiService.saveItem(vm.newItem, vm.item.id)
                        .then(function (result) {
                            return {
                                message: "Successfully saved " + result.name,
                                success: true
                            };
                        })
                        .catch(function (error) {
                            return {
                                message: "Error Saving Item",
                                success: false
                            };
                        });
                }
                else {
                    returnPromise = DialerListApiService.createItem(vm.newItem)
                        .then(function (result) {
                            return {
                                message: "Successfully created " + result.name,
                                success: true
                            };
                        })
                        .catch(function (error) {
                            return {
                                message: "Error Creating Item",
                                success: false
                            };
                        });
                }
                returnPromise.then(function (resultMessage) {
                    $uibModalInstance.close(resultMessage);
                });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss("clicked cancel button");
            };
        }
    ]
);