powerdialerApp.directive('editFactors',
    [
        'ENV',
        function (ENV) {
            console.log("****************************************");
            return {
                restrict: 'AE',
                scope: {
                    'factors': '=factors',
                    'age': '=age'
                },
                templateUrl: '/public/common/templates/edit_factors_template.html',
                link: function (scope, element, attrs) {
                    console.log("scope: ", scope);
                    scope.types = [
                        'Vacation Type',
                        'Activities',
                        'Other'
                    ];
                    scope.view = scope.types[0];
                    scope.switchView = function (newView) {
                        scope.view = newView;
                    };
                }
            };
        }
    ]
);