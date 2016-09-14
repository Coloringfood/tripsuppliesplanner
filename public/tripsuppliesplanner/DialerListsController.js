powerdialerApp.controller('DialerListsController',
    [
        '$scope',
        '$window',
        'DialerListApiService',
        function ($scope, $window, dialerListApiService) {
            'use strict';
            
            var vm = this;
            vm.name = "Dialer Lists";

            vm.getDialerListData = function (queryData) {
                return dialerListApiService.getLists()
                    .then(function (data) {
                        var tableData = {};
                        tableData.data = data;
                        var totalSize = tableData.data.length;
                        var startRow = ((queryData.page.num - 1) * queryData.page.size);
                        var endRow = ((queryData.page.num) * queryData.page.size);
                        tableData.data = tableData.data.slice(startRow, endRow);
                        tableData.info = {
                            pageNum: queryData.page.num,
                            pageSize: queryData.page.size,
                            startRow: startRow,
                            endRow: endRow - 1,
                            totalRows: totalSize,
                            totalPages: Math.floor(totalSize / queryData.page.size)
                        };
                        return tableData;
                    });
            };

            // vm.deleteList = function (id) {
            //     $modal.open({
            //         size: 'sm',
            //         templateUrl: '/static/dialerlist/delete_list_confirmation_template.html',
            //         controller: 'DeleteListConfirmationsController as vm'
            //     }).result
            //         .then(function (result) {
            //             if (result) {
            //                 dialerListApiService.deleteList(id)
            //                     .then(function (result) {
            //                         if (result.deleted === true) {
            //                             vm.queryData.refresh = !vm.queryData.refresh; // any update to queryData will refresh the table
            //                             isMessages.addMessage(gettext('List Deleted'), isMessages.TYPE_MESSAGE, 3000);
            //                         } else {
            //                             isMessages.addMessage(
            //                                 gettext('Unable to Delete List'),
            //                                 isMessages.TYPE_ERROR,
            //                                 3000);
            //                         }
            //                     });
            //             } else {
            //                 isMessages.addMessage(gettext('Cannot Delete List'), isMessages.TYPE_ERROR, 3000);
            //             }
            //         });
            // };
        }
    ]
);
