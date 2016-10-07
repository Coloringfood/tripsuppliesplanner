powerdialerApp.controller("LogoutController",
    [
        '$location',
        'authService',
        'Notification',
        '$window',
        function ($location, authService, NotificationProvider, $window) {
            'use strict';

            authService.clearCredentials();
            NotificationProvider.success("Successfully Logged Out");
            // To refresh the page
            $window.location.reload();ö
            $location.path("/");
        }
    ]
);
