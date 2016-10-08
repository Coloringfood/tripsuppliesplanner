powerdialerApp.controller("LoginController",
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

            var whereTo = $location.search().returnTo;
            vm.login = () => {
                vm.dataLoading = true;

                DialerListApiService.authenticate(vm.username, vm.password)
                    .then(function (result) {
                        authService.signedIn(result.token);

                        NotificationProvider.success("Successfully Logged In");
                        localStorage.token = result.token;

                        $window.location.reload();
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
