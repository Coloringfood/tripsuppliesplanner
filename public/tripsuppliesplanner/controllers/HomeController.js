powerdialerApp.controller('HomeController',
    [
        '$scope',
        '$window',
        'DialerListApiService',
        'authService',
        function ($scope, $window, DialerListApiService, authService) {
            'use strict';

            var vm = this;

            vm.authenticated = authService.authenticated ? true : false;

            if (vm.authenticated) {
                DialerListApiService.getAllVacations().then(function (vacations) {
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
