powerdialerApp.controller("SettingsController",
    [
        '$scope',
        '$location',
        'authService',
        'Notification',
        'DialerListApiService',
        '$window',
        function ($scope, $location, authService, NotificationProvider, DialerListApiService, $window) {
            'use strict';
            var vm = this;
            vm.user = authService.authenticated.tokenData.user;

            var index = vm.user.name.indexOf(" ");
            vm.user.firstName = vm.user.name.substring(0, index).trim();
            vm.user.lastName = vm.user.name.substring(index).trim();
            delete vm.user.password;

            vm.ages = [
                {
                    range: "0-2",
                    name: "Baby"
                },
                {
                    range: "2-5",
                    name: "Toddler"
                },
                {
                    range: "5-13",
                    name: "Kid"
                },
                {
                    range: "13+",
                    name: "Adult"
                },
            ];

            vm.save = () => {
                vm.dataLoading = true;
                vm.user.name = vm.user.firstName + " " + vm.user.lastName;

                DialerListApiService.updateUser(vm.user)
                    .then(function (result) {
                        authService.signedIn(result.token, true);
                        NotificationProvider.success("Successfully Updated Settings. Please wait while we reload the app");
                        vm.dataLoading = false;
                    })
                    .catch((err) => {
                        NotificationProvider.error(err.data.message);
                        vm.dataLoading = false;
                    });
            };
        }
    ]
);
