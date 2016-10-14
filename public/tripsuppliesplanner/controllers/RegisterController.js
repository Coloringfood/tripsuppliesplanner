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
                vm.user.name = vm.user.firstName + " " + vm.user.lastName;

                DialerListApiService.register(vm.user)
                    .then(function (result) {
                        authService.signedIn(result.token, true);
                        NotificationProvider.success("Successfully Logged In. Please wait while we reload the app");

                        var whereTo = $location.search().returnTo;
                        $location.path(whereTo && whereTo || "/");
                    })
                    .catch((err) => {
                        var message = err.data.messsage;
                        try {
                            var firstError = err.data.error.errors[0].message;
                            if(firstError == "username must be unique"){
                                message = "Username taken, please try a different username";
                            }
                        } catch (e) {
                        }

                        NotificationProvider.error(message);
                        vm.dataLoading = false;
                    });
            };
        }
    ]
);
