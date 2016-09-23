powerdialerApp.controller('EditItemModalController',
    [
        '$scope',
        '$uibModalInstance',
        'item',
        'DialerListApiService',
        function ($scope, $uibModalInstance, item, DialerListApiService) {
            'use strict';
            var vm = this;

            vm.newItem = angular.copy(item);
            console.log("newItem: ", vm.newItem);
            vm.view = "Vacation Type";
            vm.types = [
                'Vacation Type',
                'Activities',
                'Other'
            ];
            vm.factors = {
                'Vacation Type': [],
                'Activities': [],
                'Other': []
            };
            vm.switchView = (newView, age) => {
                age.view = newView;
            };

            DialerListApiService.getAllFactors()
                .then(function (factors) {
                    var factorsLength = factors.length;
                    for (var i = 0; i < factorsLength; i++) {
                        var factor = factors[i];
                        vm.factors[factor.type].push(factor);
                    }
                });

            vm.createFactor = () => {
                vm.showNewFactor = !vm.showNewFactor;
                console.log("clicked");
            };

            vm.ok = () => {
                var returnPromise;
                if (item.id) {
                    returnPromise = DialerListApiService.saveItem(vm.newItem, item.id)
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

            vm.cancel = () => {
                console.log("vm.newItem: ", vm.newItem);
                $uibModalInstance.dismiss("clicked cancel button");
            };
        }
    ]
);