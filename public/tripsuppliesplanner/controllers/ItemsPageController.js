powerdialerApp.controller('ItemsPageController',
    [
        '$scope',
        '$window',
        'DialerListApiService',
        function ($scope, $window, DialerListApiService) {
            'use strict';

            var vm = this;
            vm.name = "Trip Supplies Planner";
            vm.itemsList = [];

            DialerListApiService.getAllItems().then(function (Items) {
                vm.itemsList = Items;
            });

            vm.editItem = function (item) {
                console.log(item);
            }
        }
    ]
);
