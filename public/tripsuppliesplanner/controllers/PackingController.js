powerdialerApp.controller("PackingController",
    [
        '$scope',
        'Notification',
        'DialerListApiService',
        '$routeParams',
        '$q',
        'authService',
        function ($scope, NotificationProvider, DialerListApiService, $routeParams, $q, authService) {
            'use strict';
            var vm = this;
            vm.authenticated = authService.authenticated ? true : false;

            vm.sortedItems = {};
            vm.dateFormat = "longDate";
            vm.ageId = 4;
            $scope.status = {};
            // Get all packing items
            var packingListPromise,
                vacationPromise;
            if (vm.authenticated) {
                packingListPromise = DialerListApiService.getAllPackingItems($routeParams.vacationId);
                vacationPromise = DialerListApiService.getVacation($routeParams.vacationId);
            }else{
                var vacation = JSON.parse(localStorage.vacations)[$routeParams.vacationId];
                packingListPromise = DialerListApiService.generatePackingList(vacation, vm.ageId);
                vacationPromise = $q.resolve(DialerListApiService.convertVacationForUi(vacation));
            }
            $q.all([packingListPromise, vacationPromise])
                .then(function (results) {
                    vm.vacation = results[1];
                    var oneDay = 24 * 60 * 60 * 1000;	// hours*minutes*seconds*milliseconds
                    var diffDays = Math.abs((vm.vacation.start_date.getTime() - vm.vacation.end_date.getTime()) / (oneDay));
                    vm.vacation.totalDays = diffDays;
                    createPackingList(results[0]);
                });

            function createPackingList(packingItems) {
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
            }

            function formatItem(item) {
                var newItem = {};
                newItem.name = item.name;
                //Calculate Quantity
                var days = item.ages[0].items_per_age.days;
                var items = item.ages[0].items_per_age.items;
                if (days && days !== null) {
                    var rate = (vm.vacation.totalDays / parseFloat(days));

                    newItem.packingAmount = multiplyNumbersInString(items, rate);
                } else {
                    // Default to just the item, or the number 1
                    newItem.packingAmount = items || 1;
                }
                return newItem;
            }

            function multiplyNumbersInString(stringToCheck, rate) {
                //Regex matches an int or float, but no negatives
                var matchingInfo = stringToCheck.match(/\d+(\.\d+)?/);
                if (!matchingInfo) {
                    return stringToCheck;
                }

                var itemAmount = matchingInfo[0],
                    index = matchingInfo.index,
                    length = itemAmount.length,
                    postText = stringToCheck.substr(length + index),
                    preText = "";

                if (index !== 0 && typeof index != "undefined") {
                    preText = stringToCheck.substr(0, index);
                }
                if (postText.length) {
                    postText = multiplyNumbersInString(postText, rate);
                }

                var quantity = Math.ceil(parseInt(itemAmount) * rate);
                return preText + quantity + postText;
            }
        }
    ]
);
