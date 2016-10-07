powerdialerApp.controller("LoginController",
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

            var whereTo = $location.search().returnTo;
            vm.login = () => {
                vm.dataLoading = true;

                DialerListApiService.authenticate(vm.username, vm.password)
                    .then(function (result) {
                        authService.authenticated = {
                            userId: result.id,
                            token: result.token
                        };
                        NotificationProvider.success("Successfully Logged In");
                        localStorage.token = result.token;

                        $timeout(function () {
                            $window.location.reload();
                        }, 5);
                        $location.path(whereTo && whereTo || "/");
                    })
                    .catch(function (error) {
                        vm.dataLoading = false;
                        console.log(error);
                        NotificationProvider.error("Username or password is incorrect.");
                    });
            };

            vm.register = () => {
                $location.path("/register").search("returnTo", whereTo);
            };
        }
    ]
);
