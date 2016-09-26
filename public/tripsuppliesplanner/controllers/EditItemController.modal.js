powerdialerApp.controller('EditItemModalController',
    [
        '$scope',
        '$uibModalInstance',
        'item',
        'DialerListApiService',
        'Notification',
        function ($scope, $uibModalInstance, item, DialerListApiService, NotificationProvider) {
            'use strict';
            var vm = this;

            vm.newItem = angular.copy(item);
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

            function updateFactors() {
                return DialerListApiService.getAllFactors()
                    .then(function (factors) {
                        vm.factors = {
                            'Vacation Type': [],
                            'Activities': [],
                            'Other': []
                        };
                        var factorsLength = factors.length;
                        for (var i = 0; i < factorsLength; i++) {
                            var factor = factors[i];
                            vm.factors[factor.type].push(factor);
                        }
                    });
            }

            updateFactors();

            vm.setFactorType = (type) => {
                vm.newFactor.type = type;
            };
            vm.createFactor = () => {
                if (vm.showNewFactor) {
                    console.log("vm.newFactor: ", vm.newFactor);
                    if (vm.newFactor.name && vm.newFactor.type) {
                        console.log("Saving Factor");
                        DialerListApiService.createFactor(vm.newFactor).then(function () {
                            vm.showNewFactor = false;
                            updateFactors().then(function () {
                                NotificationProvider.success("Factor created");
                            });
                        }).catch(() => {
                            NotificationProvider.error("Error trying to save factor");
                        });
                    } else {
                        NotificationProvider.error("Please fill out all the factor information");
                    }
                } else {
                    vm.newFactor = {};
                    vm.showNewFactor = true;
                }
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