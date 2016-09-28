powerdialerApp.controller('ItemsPageController',
    [
        '$scope',
        'DialerListApiService',
        'Notification',
        '$uibModal',
        function ($scope, DialerListApiService, NotificationProvider, $uibModal) {
            'use strict';

            var vm = this;
            vm.name = "Trip Supplies Planner";
            vm.itemsList = [];
            vm.newItem = {};

            function updateList() {
                return DialerListApiService.getAllItems().then(function (Items) {
                    vm.itemsList = Items;
                }).catch(function (error) {
                    console.log("Getting Items Error: ", error);
                    NotificationProvider.error({
                        message: "Error Getting All Items"
                    });
                });
            }

            updateList();

            vm.createItem = function () {
                return DialerListApiService.createItem(vm.newItem)
                    .then(function (result) {
                        updateList().then(function (){
                            NotificationProvider.success({
                                message: "Successfully created " + result.name
                            });
                            vm.newItem = "";
                        });
                    })
                    .catch(function (error) {
                        console.log("Save Error: ", error);
                        NotificationProvider.error({
                            title: "Error Saving Item"
                        });
                    });
            };

            vm.editItem = function (item) {
                var modalInstance = $uibModal.open({
                    templateUrl: '/public/tripsuppliesplanner/views/edit_item_modal.html',
                    controller: 'EditItemModalController',
                    controllerAs: 'vm',
                    resolve: {
                        item: function () {
                            return item;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    NotificationProvider.success(result);
                    updateList();
                }).catch(function (reason) {
                    NotificationProvider.info(reason);
                });
            };

            vm.deleteItem = function (item) {
                return DialerListApiService.deleteItem(item.id)
                    .then(function () {
                        NotificationProvider.success({
                            message: "Successfully removed " + item.name
                        });
                        updateList();
                    })
                    .catch(function (error) {
                        console.log("Delete Error: ", error);
                        NotificationProvider.error({
                            title: "Error Deleting Item"
                        });
                    });
            };
        }
    ]
);
