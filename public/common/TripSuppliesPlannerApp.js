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
        'restangular'
    ]);

powerdialerApp.config(['$compileProvider', '$httpProvider', '$locationProvider', '$routeProvider', 'RestangularProvider',
    function ($compileProvider, $httpProvider, $locationProvider, $routeProvider, RestangularProvider) {
        'use strict';

        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|data|blob):/);

        RestangularProvider.setBaseUrl('/');

        $routeProvider

            // routes
            .when('/', {
                templateUrl: '/static/tripsuppliesplanner/home.html',
                controller: 'HomeController as vm'
            })
            .when('/dialerlist', {
                templateUrl: '/static/tripsuppliesplanner/dialer_lists.html',
                controller: 'DialerListsController as vm'
            })
            // .when('/editdialerlist', {
            //     templateUrl: '/static/tripsuppliesplanner/edit_dialer_list.html',
            //     controller: 'EditDialerListController as vm'
            // });

        $locationProvider.html5Mode(true).hashPrefix('!');
    }
]);

powerdialerApp.run(['$rootScope', '$window',
    function ($rootScope, $window) {
        'use strict';

    }
]);