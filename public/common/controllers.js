powerdialerApp.controller('HeaderController',
    [
        '$scope',
        '$location',
        function ($scope, $location) {
            $scope.isActive = (viewLocation) => {
                return viewLocation === $location.path();
            };
            $scope.toggleMenu = () => {
                $scope.showMenu = !$scope.showMenu;
            };
        }
    ]
);