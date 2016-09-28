powerdialerApp.controller('ItemsPageController',
    [
        '$scope',
        'DialerListApiService',
        'Notification',
        '$uibModal',
        '$q',
        '$window',
        function ($scope, DialerListApiService, NotificationProvider, $uibModal, $q, $window) {
            'use strict';

            var vm = this;
            vm.name = "Items";
            vm.itemsList = [];
            vm.newItem = {};
            vm.factors = [];

            function updateList() {
                var itemsPromise = DialerListApiService.getAllItems().then(function (items) {
                    vm.itemsList = items;
                }).catch(function (error) {
                    console.log("Getting Items Error: ", error);
                    NotificationProvider.error({
                        message: "Error Getting All Items"
                    });
                });
                var factorsPromise = DialerListApiService.getAllFactors().then(function (factors) {
                    vm.factors = factors;
                });
                return $q.all([itemsPromise, factorsPromise]);
            }

            updateList();

            function openEditModal(item) {
                var modalInstance = $uibModal.open({
                    templateUrl: '/public/tripsuppliesplanner/views/edit_item_modal.html',
                    controller: 'EditItemModalController',
                    controllerAs: 'vm',
                    size: "lg",
                    resolve: {
                        item: function () {
                            return item;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    if (result.success) {
                        NotificationProvider.success(result.message);
                    }
                    else {
                        NotificationProvider.error(result.message);
                    }
                    $window.location.reload();

                }).catch(function (reason) {
                    NotificationProvider.info(reason);
                });
            }

            vm.createItem = () => {
                openEditModal({factors: []});
            };

            vm.editItem = (item) => {
                openEditModal(item);
            };

            vm.deleteItem = (item) => {
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
