powerdialerApp.controller('EditVacationModalController',
    [
        '$scope',
        '$uibModalInstance',
        'vacation',
        'DialerListApiService',
        'Notification',
        function ($scope, $uibModalInstance, vacation, DialerListApiService, NotificationProvider) {
            'use strict';
            var vm = this,
                markedFactors = {};

            vm.newVacation = angular.copy(vacation); // jshint ignore:line
            if (!vm.newVacation.required) {
                vm.newVacation.required = false;
            }

            vm.datePickerFormat = 'dd-MMMM-yyyy';
            vm.dateOptions = {
                formatYear: 'yy',
                maxDate: new Date(2020, 5, 22),
                minDate: new Date(),
                startingDay: 1
            };
            vm.startDate = {
                opened: false
            };
            vm.endDate = {
                opened: false
            };
            vm.openStart = () => {
                vm.startDate.opened = true;
            };
            vm.openEnd = () => {
                vm.endDate.opened = true;
            };

            // START FACTOR STUFF
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
            // END FACTOR STUFF

            vm.ok = () => {
                vm.newVacation.start_date = vm.newVacation.start_date.toJSON();
                vm.newVacation.end_date = vm.newVacation.end_date.toJSON();
                if (vacation.id) {
                    DialerListApiService.saveVacation(vm.newVacation, vacation.id)
                        .then(function (result) {
                            $uibModalInstance.close({
                                message: "Successfully saved " + result.name,
                                success: true
                            });
                        })
                        .catch(function () {
                            return {
                                message: "Error Saving Vacation",
                                success: false
                            };
                        });
                }
                else {
                    DialerListApiService.createVacation(vm.newVacation)
                        .then(function (result) {
                            $uibModalInstance.close({
                                message: "Successfully created " + result.name,
                                success: true
                            });
                        })
                        .catch(function () {
                            return {
                                message: "Error Creating Vacation",
                                success: false
                            };
                        });
                }
            };

            vm.cancel = () => {
                vm.newVacation.start_date = vm.newVacation.start_date.toJSON();
                vm.newVacation.end_date = vm.newVacation.end_date.toJSON();
                console.log("vm.newVacation: ", vm.newVacation);
                $uibModalInstance.dismiss("clicked cancel button");
            };
        }
    ]
);