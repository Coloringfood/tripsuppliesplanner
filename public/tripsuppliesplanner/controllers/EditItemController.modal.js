powerdialerApp.controller('EditItemModalController',
    [
        '$scope',
        '$uibModalInstance',
        'item',
        'DialerListApiService',
        'Notification',
        function ($scope, $uibModalInstance, item, DialerListApiService, NotificationProvider) {
            'use strict';
            var vm = this,
                markedFactors = {};

            vm.newItem = angular.copy(item); // jshint ignore:line
            console.log("vm.newItem: ", vm.newItem);
            if (!vm.newItem.required) {
                vm.newItem.required = false;
            }
            if (!vm.newItem.ages) {
                vm.newItem.ages = [];
            }
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
            vm.show = {
                Baby: false,
                Toddler: false,
                Kid: false,
                Adult: false
            };


            var agesLength = vm.newItem.ages.length;
            for (var i = 0; i < agesLength; i++) {
                var age = vm.newItem.ages[i];
                vm.show[age.name] = true;
            }

            vm.updateAges = (selectedAge) => {
                if (vm.show[selectedAge]) {
                    vm.newItem.ages.push({
                        name: selectedAge,
                        items_per_age: {} // jshint ignore:line
                    });
                }
                else {
                    var itemsLength = vm.newItem.ages.length;
                    for (var i = 0; i < itemsLength; i++) {
                        var age = vm.newItem.ages[i];
                        if (age.name == selectedAge) { // jshint ignore:line
                            vm.newItem.ages.splice(i, 1);
                            break;
                        }
                    }
                }
            };
            vm.updateAges();

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
                            factor.selected = markedFactors[factor.name];
                            vm.factors[factor.type].push(factor);
                        }
                        markedFactors = {};
                    });
            }

            updateFactors();

            vm.setFactorType = (type) => {
                vm.newFactor.type = type;
            };
            vm.createFactor = () => {
                if (vm.showNewFactor) {
                    if (vm.newFactor.name && vm.newFactor.type) {
                        // Loop current factors and save which ones are selected
                        markedFactors = {};
                        var factorsTypeLength = vm.types.length;
                        for (var i = 0; i < factorsTypeLength; i++) {
                            var factorType = vm.types[i];
                            var factorsLength = vm.factors[factorType].length;
                            for (var j = 0; j < factorsLength; j++) {
                                var factor = vm.factors[factorType][j];
                                if (factor.selected) {
                                    markedFactors[factor.name] = true;
                                }
                            }
                        }

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
            };

            vm.ok = () => {
                if (item.id) {
                    DialerListApiService.saveItem(vm.newItem, item.id)
                        .then(function (result) {
                            $uibModalInstance.close({
                                message: "Successfully saved " + result.name,
                                success: true
                            });
                        })
                        .catch(function () {
                            return {
                                message: "Error Saving Item",
                                success: false
                            };
                        });
                }
                else {
                    DialerListApiService.createItem(vm.newItem)
                        .then(function (result) {
                            $uibModalInstance.close({
                                message: "Successfully created " + result.name,
                                success: true
                            });
                        })
                        .catch(function () {
                            return {
                                message: "Error Creating Item",
                                success: false
                            };
                        });
                }
            };

            vm.cancel = () => {
                console.log("vm.newItem: ", vm.newItem);
                $uibModalInstance.dismiss("clicked cancel button");
            };
        }
    ]
);