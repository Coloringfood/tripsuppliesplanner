powerdialerApp.directive('viewFactors',
    [
        'ENV',
        function (ENV) {
            return {
                restrict: 'AE',
                scope: {
                    'factors': '=factors',
                    'selected': '=selected',
                    'settings': '=settings'
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
                    if(!scope.settings){
                        scope.settings = {
                            object: false
                        };
                    }
                    var factorsLength = scope.factors.length;
                    for (var i = 0; i < factorsLength; i++) {
                        var factor = scope.factors[i];
                        var index = scope.settings.object ? findFactorId(factor.id) : scope.selected.indexOf(factor.id);
                        if (index > -1) {
                            var pushedItem = factor;
                            if(scope.settings.showDays){
                                pushedItem = scope.selected[index];
                            }
                            scope.filteredFactors[factor.type].push(pushedItem);
                        }
                    }
                    function findFactorId(id) {
                        if (!scope.settings.object) {
                            return -1;
                        }
                        var selectedLength = scope.selected.length;
                        for (var i = 0; i < selectedLength; i++) {
                            var selected = scope.selected[i];
                            if (selected.id === id) {
                                return i;
                            }
                        }
                        return -1;
                    }
                }
            };
        }
    ]
);