powerdialerApp.controller("RegisterController",
    [
        '$scope',
        '$location',
        'authService',
        'Notification',
        'DialerListApiService',
        '$timeout',
        '$window',
        function ($scope, $location, authService, NotificationProvider, DialerListApiService, $timeout, $window) {
            'use strict';
            var vm = this;

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

            vm.register = () => {
                vm.dataLoading = true;
                console.log(vm.user);
                vm.user.name = vm.user.firstName + " " + vm.user.lastName;

                DialerListApiService.register(vm.user)
                    .then(function (result) {
                        authService.authenticated = {
                            userId: result.id,
                            token: result.token
                        };
                        NotificationProvider.success("Successfully Logged In");

                        $timeout(function () {
                            $window.location.reload();
                        }, 5);
                        var whereTo = $location.search().returnTo;
                        $location.path(whereTo && whereTo || "/");
                    });
            };
        }
    ]
);
