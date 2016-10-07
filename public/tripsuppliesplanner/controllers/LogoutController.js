powerdialerApp.controller("LogoutController",
    [
        '$location',
        'authService',
        'Notification',
        '$timeout',
        '$window',
        function ($location, authService, NotificationProvider, $timeout, $window) {
            'use strict';

            authService.clearCredentials();
            NotificationProvider.success("Successfully Logged Out");
            // To refresh the page
            $timeout(function () {
                $window.location.reload();
            }, 5);
            $location.path("/");
        }
    ]
);
