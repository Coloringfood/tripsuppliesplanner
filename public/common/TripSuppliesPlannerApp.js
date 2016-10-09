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
            .when('/register', {
                templateUrl: '/static/tripsuppliesplanner/views/register.html',
                controller: 'RegisterController as vm'
            })
            .when('/logout', {
                template: "<h1>Logging Out</h1>",
                controller: 'LogoutController'
            })
            .when('/settings', {
                templateUrl: "/static/tripsuppliesplanner/views/settings.html",
                controller: 'SettingsController as vm',
                authorize: true
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

powerdialerApp.run(['$rootScope', '$location', 'injectCSS', 'authService',
    function ($rootScope, $location, injectCSS, authService) {
        'use strict'; // jshint ignore:line

        $rootScope.$on("$routeChangeStart", function (evt, to, from) {
            to.resolve = to.resolve || {};
            authService.checkToken();

            if (authService.authenticated) {
                var userCssUrl = authService.authenticated.tokenData.user.settings.cssTheme;
                if (userCssUrl) {
                    to.resolve.cssResolver = () => injectCSS.set('users-css', userCssUrl);
                }
            }

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
powerdialerApp.service("authService", function ($q, $timeout, jwtHelper, ENV, $window) {
    var self = this;
    this.authenticated = false;

    this.authorize = () => {
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
    this.signedIn = (token, reload) => {
        var decodedToken = jwtHelper.decodeToken(token);
        this.authenticated = {
            tokenData: decodedToken,
            token: token
        };

        localStorage.token = token;

        if (reload) {
            $timeout(()=> {
                $window.location.reload();
            }, 1000);
        }
    };
    this.getInfo = () => {
        return $timeout(function () {
            return self;
        }, 1);
    };
    this.clearCredentials = () => {
        self.authenticated = false;
        delete localStorage.token;

        $timeout(()=> {
            $window.location.reload();
        }, 300);
    };


    this.checkToken = () => {
        if (localStorage.token) {
            if (jwtHelper.isTokenExpired(localStorage.token)) {
                console.log("EXPIRED TOKEN");
                this.clearCredentials();
            }
            else {
                this.signedIn(localStorage.token);
            }
        }
    };
    this.checkToken();
});

// Custom error type
function AuthorizationError(description) {
    this.message = "Forbidden";
    this.description = description || "User authentication required.";
}

AuthorizationError.prototype = Object.create(Error.prototype);
AuthorizationError.prototype.constructor = AuthorizationError;