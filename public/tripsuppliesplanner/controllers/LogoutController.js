powerdialerApp.controller("LogoutController",
    [
        '$location',
        'authService',
        'Notification',
        '$window',
        function ($location, authService, NotificationProvider, $window) {
            'use strict';

            authService.clearCredentials();
            NotificationProvider.success("Successfully Logged Out. Please wait while we reload the app");
            $location.path("/");
        }
    ]
);
