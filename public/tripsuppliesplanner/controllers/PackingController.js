powerdialerApp.controller("PackingController",
    [
        '$scope',
        'Notification',
        'DialerListApiService',
        '$routeParams',
        '$q',
        function ($scope, NotificationProvider, DialerListApiService, $routeParams, $q) {
            'use strict';
            var vm = this;

            vm.sortedItems = {};
            $scope.status = {};
            // Get all packing items
            var packingListPromise = DialerListApiService.getAllPackingItems($routeParams.vacationId);
            var vacationPromise = DialerListApiService.getVacation($routeParams.vacationId);
            $q.all([packingListPromise, vacationPromise])
                .then(function (results) {
                    vm.vacation = results[1];
                    console.log("vm.vacation: ", vm.vacation);
                    createPackingList(results[0]);
                });

            function createPackingList(packingItems){
                // Loop thorugh packingItems and sort by category
                var itemsLength = packingItems.length;
                for (var i = 0; i < itemsLength; i++) {
                    var item = packingItems[i];
                    if (!vm.sortedItems[item.category.name]) {
                        vm.sortedItems[item.category.name] = {
                            required: [],
                            optional: []
                        };
                        $scope.status[item.category.name] = true;
                    }
                    var required = item.required ? "required" : "optional";
                    vm.sortedItems[item.category.name][required].push(formatItem(item));
                }
                console.log("vm.sortedItems: ", vm.sortedItems);
            }
            function formatItem (item){
                var newItem = {};
                newItem.name = item.name;
                return newItem;
            }
        }
    ]
);
