powerdialerApp.controller('ItemsPageController',
    [
        '$scope',
        'DialerListApiService',
        'Notification',
        '$uibModal',
        function ($scope, DialerListApiService, NotificationProvider, $uibModal) {
            'use strict';

            var vm = this;
            vm.name = "Items";
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

            function openEditModal(item) {
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
                    console.log("MODAL RESULT: ", result);
                    if (result.success) {
                        NotificationProvider.success(result.message);
                    }
                    else {
                        NotificationProvider.error(result.message);
                    }
                    updateList();
                }).catch(function (reason) {
                    NotificationProvider.info(reason);
                });
            }

            vm.createItem = function () {
                openEditModal({});
            };

            vm.editItem = function (item) {
                openEditModal(item);
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
