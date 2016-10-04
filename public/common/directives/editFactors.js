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

                    function preSelectFactors(factors, type) {
                        var selectedLength = factors.length,
                            newFactors = [];
                        for (var i = 0; i < selectedLength; i++) {
                            var factor = factors[i];
                            factor.vacations_factors = {days:null}; // jshint ignore:line
                            var index = scope.settings.object ? findFactorId(factor.id) : scope.selected.indexOf(factor.id);
                            if (index > -1) {
                                if (scope.settings.object && scope.settings.showDays) {
                                    factor = scope.selected[index];
                                    console.log("factor: ", factor);
                                }
                                factor.selected = true;
                            }
                            newFactors.push(factor);
                        }
                        scope.factors[type] = newFactors;
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
                        preSelectFactors(scope.factors[type], type);
                    }

                    scope.selectFactor = function (factor) {
                        console.log("factor: ", factor);
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