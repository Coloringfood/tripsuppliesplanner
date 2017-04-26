powerdialerApp.controller('VacationsPageController',
    [
        '$scope',
        'TripSuppliesPlannerService',
        'Notification',
        '$uibModal',
        '$q',
        '$window',
        'authService',
        'ENV',
        function ($scope, TripSuppliesPlannerService, NotificationProvider, $uibModal, $q, $window, authService, ENV) {
            'use strict';

            let vm = this;
            let debugging = ENV.environment == 'dev';
            vm.name = "Vacations";
            vm.vacationsList = [];
            vm.factors = [];
            vm.factorSettings = {
                object: true,
                showDays: true
            };
            vm.authenticated = !!authService.authenticated;

            function updateList() {
                let vacationsPromise, factorsPromise;
                if (vm.authenticated) {
                    vacationsPromise = TripSuppliesPlannerService.getAllVacations();
                }
                else {
                    try {
                        vacationsPromise = $q.all(JSON.parse(localStorage.vacations).map((vacation) => {
                            return TripSuppliesPlannerService.convertVacationForUi(vacation);
                        }));
                    }
                    catch (e) {
                        vacationsPromise = $q.resolve();
                    }
                }
                vacationsPromise = vacationsPromise.then(function (vacations) {
                    vm.vacationsList = vacations;
                    return vacations;
                }).catch(function (error) {
                    console.log("Getting Vacations Error: ", error);
                    NotificationProvider.error({
                        message: "Error Getting All Vacations"
                    });
                });
                factorsPromise = TripSuppliesPlannerService.getAllFactors().then(function (factors) {
                    vm.factors = factors;
                    return factors;
                });
                return $q.all([vacationsPromise, factorsPromise]);
            }

            updateList();

            function openEditModal(vacation) {
                let modalInstance = $uibModal.open({
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
                    if (debugging) {
                        console.log("error: ", reason);
                    }
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
                    return TripSuppliesPlannerService.deleteVacation(vacation.id)
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
                    let vacations = [];
                    try {
                        vacations = JSON.parse(localStorage.vacations);
                    } catch (e) {
                    }
                    vacations.splice(vacation.id, 1);
                    let vacationsLength = vacations.length;
                    for (let i = 0; i < vacationsLength; i++) {
                        let vacation = vacations[i];
                        vacation.id = i;
                    }
                    localStorage.vacations = JSON.stringify(vacations);
                    updateList();
                }
            };
        }
    ]
);
