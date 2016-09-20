powerdialerApp.controller('EditItemModalController',
    [
        '$scope',
        '$uibModalInstance',
        'item',
        function ($scope, $uibModalInstance, item) {
            'use strict';
            var vm = this;

            vm.item = item;

            vm.ok = function () {
                $uibModalInstance.close("Ok Clicked");
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss("Clicked Cancel");
            };
        }
    ]
);