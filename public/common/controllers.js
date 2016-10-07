powerdialerApp.controller('HeaderController',
    [
        '$scope',
        '$location',
        'authService',
        function ($scope, $location, authService) {
            $scope.authenticated = authService.authenticated !== false;
            $scope.isActive = (viewLocation) => {
                return viewLocation === $location.path();
            };
            $scope.toggleMenu = () => {
                $scope.showMenu = !$scope.showMenu;
            };
        }
    ]
);