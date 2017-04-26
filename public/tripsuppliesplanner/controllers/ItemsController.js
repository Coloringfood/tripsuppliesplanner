powerdialerApp.controller('ItemsPageController',
    [
        '$scope',
        'TripSuppliesPlannerService',
        'Notification',
        '$uibModal',
        '$q',
        '$window',
        function ($scope, TripSuppliesPlannerService, NotificationProvider, $uibModal, $q, $window) {
            'use strict';

            let vm = this;
            vm.name = "Items";
            vm.itemsList = [];
            vm.factors = [];
            vm.factorSettings = {
                object: false
            };

            function updateList() {
                let itemsPromise = TripSuppliesPlannerService.getAllItems().then(function (items) {
                    vm.itemsList = items;
                }).catch(function (error) {
                    console.log("Getting Items Error: ", error);
                    NotificationProvider.error({
                        message: "Error Getting All Items"
                    });
                });
                let factorsPromise = TripSuppliesPlannerService.getAllFactors().then(function (factors) {
                    vm.factors = factors;
                });
                return $q.all([itemsPromise, factorsPromise]);
            }

            updateList();

            function openEditModal(item) {
                let modalInstance = $uibModal.open({
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
                    // NotificationProvider.info(reason);
                });
            }

            vm.createItem = () => {
                openEditModal({factors: [], required:true});
            };

            vm.editItem = (item) => {
                openEditModal(item);
            };

            vm.deleteItem = (item) => {
                return TripSuppliesPlannerService.deleteItem(item.id)
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
