powerdialerApp.controller("LoginController",
    [
        '$location',
        'authService',
        'Notification',
        function ($location, authService, NotificationProvider) {
            this.login = () => {
                authService.authenticated = {
                    userId: 1,
                    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJTRUxGIiwidXNlcklkIjoxLCJpYXQiOjE0NzU3OTAxMjR9.Zb_KL2O5K-j8FD3wmrhOhonMfk0s727MvIKcmcHUdiE"
                };
                NotificationProvider.success("Added Authentication");
                var whereTo = $location.search().returnTo;
                $location.path(whereTo && whereTo || "/");
            };
            this.logout = () => {
                authService.authenticated = false;
                NotificationProvider.success("Remove Authentication");
                var whereTo = "/";
                $location.path(whereTo && whereTo || "/");
            };
        }
    ]
);
