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

            vm.factorSettings = {
                object: true,
                showDays: true
            };

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
                if(!vm.newVacation.start_date){
                    NotificationProvider.error("You must have a start date");
                    return;
                }
                if(!vm.newVacation.end_date){
                    NotificationProvider.error("You must have an end date");
                    return;
                }
                if (vacation.id) {
                    DialerListApiService.saveVacation(vm.newVacation, vacation.id)
                        .then(function (result) {
                            $uibModalInstance.close({
                                message: "Successfully saved " + vm.newVacation.name,
                                success: true
                            });
                        })
                        .catch(function () {
                            NotificationProvider.error({
                                message: "Error Saving Vacation",
                                success: false
                            });
                        });
                }
                else {
                    DialerListApiService.createVacation(vm.newVacation)
                        .then(function (result) {
                            $uibModalInstance.close({
                                message: "Successfully created " + vm.newVacation.name,
                                success: true
                            });
                        })
                        .catch(function () {
                            NotificationProvider.error({
                                message: "Error Creating Vacation",
                                success: false
                            });
                        });
                }
            };

            vm.cancel = () => {
                console.log("vm.newVacation: ", vm.newVacation);
                $uibModalInstance.dismiss("clicked cancel button");
            };
        }
    ]
);