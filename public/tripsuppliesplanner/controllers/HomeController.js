powerdialerApp.controller('HomeController',
    [
        '$scope',
        '$window',
        'TripSuppliesPlannerService',
        'authService',
        'Notification',
        function ($scope, $window, TripSuppliesPlannerService, authService, NotificationProvider) {
            'use strict';

            let vm = this;

            vm.authenticated = !!authService.authenticated;

            if (vm.authenticated) {
                TripSuppliesPlannerService.getAllVacations().then(function (vacations) {
                    vm.vacationsList = vacations;
                }).catch(function (error) {
                    console.log("Getting Vacations Error: ", error);
                    NotificationProvider.error({
                        message: "Error Getting All Vacations"
                    });
                });
            }
        }
    ]
);
