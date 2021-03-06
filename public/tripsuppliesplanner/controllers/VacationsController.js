powerdialerApp.controller('VacationsPageController',
    [
        '$scope',
        'DialerListApiService',
        'Notification',
        '$uibModal',
        '$q',
        '$window',
        'authService',
        function ($scope, DialerListApiService, NotificationProvider, $uibModal, $q, $window, authService) {
            'use strict';

            var vm = this;
            vm.name = "Vacations";
            vm.vacationsList = [];
            vm.factors = [];
            vm.factorSettings = {
                object: true,
                showDays: true
            };
            vm.authenticated = authService.authenticated ? true : false;

            function updateList() {
                var vacationsPromise;
                if (vm.authenticated) {
                    vacationsPromise = DialerListApiService.getAllVacations();
                }
                else {
                    try {
                        vacationsPromise = $q.all(JSON.parse(localStorage.vacations).map((vacation) => {
                            return DialerListApiService.convertVacationForUi(vacation);
                        }));
                    }
                    catch (e) {
                        vacationsPromise = $q.resolve();
                    }
                }
                vacationsPromise = vacationsPromise.then(function (vacations) {
                    vm.vacationsList = vacations;
                }).catch(function (error) {
                    console.log("Getting Vacations Error: ", error);
                    NotificationProvider.error({
                        message: "Error Getting All Vacations"
                    });
                });
                var factorsPromise = DialerListApiService.getAllFactors().then(function (factors) {
                    vm.factors = factors;
                });
                return $q.all([vacationsPromise, factorsPromise]);
            }

            updateList();

            function openEditModal(vacation) {
                var modalInstance = $uibModal.open({
                    templateUrl: '/public/tripsuppliesplanner/views/edit_vacation_modal.html',
                    controller: 'EditVacationModalController',
                    controllerAs: 'vm',
                    size: "lg",
                    resolve: {
                        vacation: function () {
                            return vacation;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    if (result.success) {
                        NotificationProvider.success(result.message);
                    }
                    else {
                        NotificationProvider.error(result.message);
                    }
                    updateList();

                }).catch(function (reason) {
                    // NotificationProvider.info(reason);
                });
            }

            vm.createVacation = () => {
                openEditModal({factors: []});
            };

            vm.editVacation = (vacation) => {
                openEditModal(vacation);
            };

            vm.deleteVacation = (vacation) => {
                if (authService.authenticated) {
                    return DialerListApiService.deleteVacation(vacation.id)
                        .then(function () {
                            NotificationProvider.success({
                                message: "Successfully removed " + vacation.name
                            });
                            updateList();
                        })
                        .catch(function (error) {
                            console.log("Delete Error: ", error);
                            NotificationProvider.error({
                                title: "Error Deleting Vacation"
                            });
                        });
                }
                else {
                    var vacations = [];
                    try {
                        vacations = JSON.parse(localStorage.vacations);
                    } catch (e) {
                    }
                    vacations.splice(vacation.id, 1);
                    var vacationsLength = vacations.length;
                    for (var i = 0; i < vacationsLength; i++) {
                        var vacation = vacations[i];
                        vacation.id = i;
                    }
                    localStorage.vacations = JSON.stringify(vacations);
                    updateList();
                }
            };
        }
    ]
);
