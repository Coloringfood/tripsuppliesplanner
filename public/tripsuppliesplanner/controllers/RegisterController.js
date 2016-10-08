powerdialerApp.controller("RegisterController",
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
                        authService.signedIn(result.token);
                        NotificationProvider.success("Successfully Logged In");

                        $window.location.reload();

                        var whereTo = $location.search().returnTo;
                        $location.path(whereTo && whereTo || "/");
                    })
                    .catch((err) => {
                        NotificationProvider.error(err.data.message);
                        vm.dataLoading = false;
                    });
            };
        }
    ]
);
