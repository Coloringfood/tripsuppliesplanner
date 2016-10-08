powerdialerApp.controller('HeaderController',
    [
        '$scope',
        '$location',
        'authService',
        function ($scope, $location, authService) {
            $scope.authenticated = authService.authenticated !== false;
            console.log("authService.authenticated: ", authService.authenticated.tokenData);
            $scope.name = authService.authenticated.tokenData.user.name;
            console.log("$scope.name: ", $scope.name);
            $scope.isActive = (viewLocation) => {
                return viewLocation === $location.path();
            };
            $scope.toggleMenu = () => {
                $scope.showMenu = !$scope.showMenu;
            };
        }
    ]
);