powerdialerApp.directive('editFactors',
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

                    function preSelectFactors(factors) {
                        var selectedLength = factors.length;
                        for (var i = 0; i < selectedLength; i++) {
                            var factor = factors[i];
                            if (scope.selected.indexOf(factor.id) > -1 || findFactorId(factor.id) > -1) {
                                factor.selected = true;
                            }
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

                    var typesLength = scope.types.length;
                    for (var i = 0; i < typesLength; i++) {
                        var type = scope.types[i];
                        preSelectFactors(scope.factors[type]);
                    }

                    scope.selectFactor = function (factor) {
                        var index = scope.settings.object ? findFactorId(factor.id) : scope.selected.indexOf(factor.id);
                        if (index > -1) {
                            scope.selected.splice(index, 1);
                            factor.selected = false;
                        } else {
                            var addedObject = scope.settings.object ? factor : factor.id;
                            scope.selected.push(addedObject);
                            factor.selected = true;
                        }
                    };
                }
            };
        }
    ]
);