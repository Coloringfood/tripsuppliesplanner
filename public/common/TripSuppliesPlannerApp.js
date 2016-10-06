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
        'ui.bootstrap',
        'angular-jwt'
    ]);

powerdialerApp.config(['$compileProvider', '$httpProvider', '$locationProvider', '$routeProvider', 'RestangularProvider', 'NotificationProvider', 'jwtOptionsProvider',
    function ($compileProvider, $httpProvider, $locationProvider, $routeProvider, RestangularProvider, NotificationProvider, jwtOptionsProvider) {
        'use strict';

        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|data|blob):/);

        RestangularProvider.setBaseUrl('/');

        $routeProvider

        // routes
            .when('/itemspage', {
                templateUrl: '/static/tripsuppliesplanner/views/items_page.html',
                controller: 'ItemsPageController as vm',
                authorize: true
            })
            .when('/vacationspage', {
                templateUrl: '/static/tripsuppliesplanner/views/vacations_page.html',
                controller: 'VacationsPageController as vm',
                authorize: true
            })
            .when('/login', {
                templateUrl: '/static/tripsuppliesplanner/views/login.html',
                controller: 'LoginController as vm'
            })
            .otherwise({
                templateUrl: '/static/tripsuppliesplanner/views/home.html',
                controller: 'HomeController as vm'
            });

        $locationProvider.html5Mode({
            enabled: false,
            requireBase: false
        });

        NotificationProvider.setOptions({
            delay: 10000,
            startTop: 20,
            startRight: 20,
            verticalSpacing: 20,
            horizontalSpacing: 20,
            positionX: 'right',
            positionY: 'top'
        });

        jwtOptionsProvider.config({
            tokenGetter: ['authService', 'options', 'ENV', function (authService, options, ENV) {
                // Only add authentication for any requests to my api
                if (options.url.indexOf(ENV.backend.host) != -1) {
                    return authService.getInfo().then(function (info) {
                        return info.authenticated.token;
                    });
                }
                else {
                    return null;
                }
            }]
        });

        $httpProvider.interceptors.push('jwtInterceptor');
    }
]);

powerdialerApp.run(['$rootScope', '$location', 'injectCSS',
    function ($rootScope, $location, injectCSS) {
        'use strict'; // jshint ignore:line

        // var userCssUrl = "/public/assets/css/bootstrap-darkly.css";
        // var userCssUrl = "/public/assets/css/bootstrap-flatly.css";
        // var userCssUrl = "/public/assets/css/bootstrap-sandstone.css";
        var userCssUrl = "/public/assets/css/bootstrap-slate.css";
        // var userCssUrl = "/public/assets/css/bootstrap-superhero.css";

        $rootScope.$on("$routeChangeStart", function (evt, to, from) {
            to.resolve = to.resolve || {};

            to.resolve.cssResolver = () => injectCSS.set('users-css', userCssUrl);

            if (to.authorize === true) {
                if (!to.resolve.authorizationResolver) {
                    to.resolve.authorizationResolver = function (authService) {
                        return authService.authorize();
                    };
                }
            }
        });

        $rootScope.$on("$routeChangeError", function (evt, to, from, error) {
            if (error instanceof AuthorizationError) {
                $location.path("/login").search("returnTo", to.originalPath);
            }
        });
    }
]);

// KEPT IN THIS FILE BECAUSE IT NEEDED ACCESS TO AuthorizationError
//http://erraticdev.blogspot.com/2015/10/angular-ngroute-routing-authorization.html
powerdialerApp.service("authService", function ($q, $timeout, jwtHelper, ENV) {
    var self = this;
    this.authenticated = false;
    this.authorize = function () {
        return this
            .getInfo()
            .then(function (info) {
                if (info.authenticated) {
                    var decodedToken = jwtHelper.decodeToken(info.authenticated.token);
                    if (decodedToken.iss === ENV.backend.iss) {
                        return true;
                    }
                }
                // anonymous
                throw new AuthorizationError();
            });
    };
    this.getInfo = function () {
        return $timeout(function () {
            return self;
        }, 1);
    };
});

// Custom error type
function AuthorizationError(description) {
    this.customType = "AuthorizationError";
    this.message = "Forbidden";
    this.description = description || "User authentication required.";
}

AuthorizationError.prototype = Object.create(Error.prototype);
AuthorizationError.prototype.constructor = AuthorizationError;