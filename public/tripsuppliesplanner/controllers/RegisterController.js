powerdialerApp.controller("RegisterController",
    [
        '$scope',
        '$location',
        'authService',
        'Notification',
        'DialerListApiService',
        function ($scope, $location, authService, NotificationProvider, DialerListApiService) {
            'use strict';
            let vm = this;

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

                        let whereTo = $location.search().returnTo;
                        $location.path(whereTo && whereTo || "/");
                    })
                    .catch((err) => {
                        let message = err.data.messsage;
                        try {
                            let firstError = err.data.error.errors[0].message;
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
