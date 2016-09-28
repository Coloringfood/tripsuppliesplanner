powerdialerApp.controller('HomeController',
    [
        '$scope',
        '$window',
        'DialerListApiService',
        function ($scope, $window, DialerListApiService) {
            'use strict';

            var vm = this;
            vm.name = "Trip Supplies Planner";
        }
    ]
);
