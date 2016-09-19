powerdialerApp.controller('HomeController',
    [
        '$scope',
        '$window',
        'RestangularFactory',
        function ($scope, $window, RestangularFactory) {
            'use strict';

            var vm = this;
            vm.name = "Trip Supplies Planner";
        }
    ]
);
