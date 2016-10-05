/**
 * this is the main entry to the survey application
 * @module survey
 */
var powerdialerApp = angular.module('tripsuppliesplannerApp',
    [
        'constants',
        'ngSanitize',
        'ngRoute',
        'ngAnimate',
        'ngTouch',
        'ngStorage',
        'restangular',
        'ui-notification',
        'ui.bootstrap'
    ]);

powerdialerApp.config(['$compileProvider', '$httpProvider', '$locationProvider', '$routeProvider', 'RestangularProvider', 'NotificationProvider',
    function ($compileProvider, $httpProvider, $locationProvider, $routeProvider, RestangularProvider, NotificationProvider) {
        'use strict';

        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|data|blob):/);

        RestangularProvider.setBaseUrl('/');

        // var userCssUrl = "/public/assets/css/bootstrap-darkly.css";
        // var userCssUrl = "/public/assets/css/bootstrap-flatly.css";
        // var userCssUrl = "/public/assets/css/bootstrap-sandstone.css";
        var userCssUrl = "/public/assets/css/bootstrap-slate.css";
        // var userCssUrl = "/public/assets/css/bootstrap-superhero.css";

        $routeProvider

            // routes
            .when('/itemspage', {
                templateUrl: '/static/tripsuppliesplanner/views/items_page.html',
                controller: 'ItemsPageController as vm',
                // resolve: {
                //     loadCss: ['injectCSS', function(injectCSS) {
                //         return injectCSS.set('users-css', userCssUrl);
                //     }]
                // }
            })
            .when('/vacationspage', {
                templateUrl: '/static/tripsuppliesplanner/views/vacations_page.html',
                controller: 'VacationsPageController as vm',
                // resolve: {
                //     loadCss: ['injectCSS', function(injectCSS) {
                //         return injectCSS.set('users-css', userCssUrl);
                //     }]
                // }
            })
            .otherwise({
                templateUrl: '/static/tripsuppliesplanner/views/home.html',
                controller: 'HomeController as vm',
                resolve: {
                    loadCss: ['injectCSS', function(injectCSS) {
                        return injectCSS.set('users-css', userCssUrl);
                    }]
                }
            });

        $locationProvider.html5Mode(true).hashPrefix('!');

        NotificationProvider.setOptions({
            delay: 10000,
            startTop: 20,
            startRight: 20,
            verticalSpacing: 20,
            horizontalSpacing: 20,
            positionX: 'right',
            positionY: 'top'
        });
    }
]);

powerdialerApp.run(['$rootScope', '$window',
    function ($rootScope, $window) {
        'use strict';

    }
]);