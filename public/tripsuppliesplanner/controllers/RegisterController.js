powerdialerApp.controller("RegisterController",
    [
        '$scope',
        '$location',
        'authService',
        'Notification',
        'DialerListApiService',
        '$timeout',
        '$windiw',
        function ($scope, $location, authService, NotificationProvider, DialerListApiService, $timeout, $window) {
            'use strict';
            var vm = this;

            vm.register = () => {
                vm.dataLoading = true;
                // vm.user
                DialerListApiService.register(vm.user)
                    .then(function (result){
                        authService.authenticated = {
                            userId: result.id,
                            token: result.token
                        };
                        NotificationProvider.success("Successfully Logged In");

                        $timeout(function () {
                            $window.location.reload();
                        }, 500);
                        var whereTo = $location.search().returnTo;
                        $location.path(whereTo && whereTo || "/");
                    });
            };
        }
    ]
);
