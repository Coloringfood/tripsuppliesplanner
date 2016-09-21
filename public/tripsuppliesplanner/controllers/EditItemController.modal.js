powerdialerApp.controller('EditItemModalController',
    [
        '$scope',
        '$uibModalInstance',
        'item',
        'DialerListApiService',
        function ($scope, $uibModalInstance, item, DialerListApiService) {
            'use strict';
            var vm = this;

            vm.item = item;
            vm.newItem = {
                name: item.name,
                categories: item.categories
            };

            vm.ok = function () {
                DialerListApiService.saveItem(vm.newItem, vm.item.id)
                    .then(function (result){
                        $uibModalInstance.close("Item Saved");
                    });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss("Clicked Cancel");
            };
        }
    ]
);