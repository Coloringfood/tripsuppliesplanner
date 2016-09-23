powerdialerApp.directive('viewFactors',
    [
        'ENV',
        function (ENV) {
            return {
                restrict: 'AE',
                scope: {
                    'factors': '=factors',
                    'selected': '=selected'
                },
                templateUrl: '/public/common/templates/view_factors_template.html',
                link: function (scope, element, attrs) {
                    scope.types = [
                        'Vacation Type',
                        'Activities',
                        'Other'
                    ];
                    scope.filteredFactors = {
                        'Vacation Type': [],
                        'Activities': [],
                        'Other': []
                    };
                    var factorsLength = scope.factors.length;
                    for (i = 0; i < factorsLength; i++) {
                        var factor = scope.factors[i];
                        if (scope.selected.indexOf(factor.id) > -1) {
                            scope.filteredFactors[factor.type].push(factor.name);
                        }
                    }
                }
            };
        }
    ]
);