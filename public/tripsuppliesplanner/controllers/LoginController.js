powerdialerApp.controller("LoginController",
    [
        '$scope',
        '$location',
        'authService',
        'Notification',
        'TripSuppliesPlannerService',
        function ($scope, $location, authService, NotificationProvider, TripSuppliesPlannerService) {
            'use strict';
            let vm = this;

            let whereTo = $location.search().returnTo;
            vm.login = () => {
                vm.dataLoading = true;

                TripSuppliesPlannerService.authenticate(vm.username, vm.password)
                    .then(function (result) {
                        authService.signedIn(result.token, true);

                        NotificationProvider.success("Successfully Logged In. Please wait while we reload the app");
                        localStorage.token = result.token;
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
