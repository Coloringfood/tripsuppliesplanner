powerdialerApp.controller('VacationsPageController',
    [
        '$scope',
        'DialerListApiService',
        'Notification',
        '$uibModal',
        '$q',
        '$window',
        function ($scope, DialerListApiService, NotificationProvider, $uibModal, $q, $window) {
            'use strict';

            var vm = this;
            vm.name = "Vacations";
            vm.vacationsList = [];
            vm.factors = [];
            vm.factorSettings = {
                object: true
            };

            function updateList() {
                var vacationsPromise = DialerListApiService.getAllVacations().then(function (vacations) {
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
                    $window.location.reload();

                }).catch(function (reason) {
                    NotificationProvider.info(reason);
                });
            }

            vm.createVacation = () => {
                openEditModal({factors: []});
            };

            vm.editVacation = (vacation) => {
                openEditModal(vacation);
            };

            vm.deleteVacation = (vacation) => {
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
            };
        }
    ]
);
