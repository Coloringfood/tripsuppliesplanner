powerdialerApp.directive('editFactors',
    [
        'ENV',
        function (ENV) {
            return {
                restrict: 'AE',
                scope: {
                    'factors': '=factors',
                    'selected': '=selected'
                },
                templateUrl: '/public/common/templates/edit_factors_template.html',
                link: function (scope, element, attrs) {
                    scope.types = [
                        'Vacation Type',
                        'Activities',
                        'Other'
                    ];
                    scope.view = scope.types[0];
                    scope.switchView = function (newView) {
                        scope.view = newView;
                    };
                    scope.factorSelected = function (factorId) {
                        var index = scope.selected.indexOf(factorId);
                        return index > -1;
                    };
                    scope.selectFactor = function (factorId) {
                        var index = scope.selected.indexOf(factorId);
                        if (index > -1) {
                            scope.selected.splice(index, 1);
                        } else {
                            scope.selected.push(factorId);
                        }
                    };
                }
            };
        }
    ]
);