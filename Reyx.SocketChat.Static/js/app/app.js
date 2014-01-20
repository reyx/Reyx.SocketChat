'use strict';

var App = angular.module('App', ['ngRoute', 'ngAnimate', 'ngResource', 'ngSanitize', 'HashBangURLs', 'XSockets', 'pascalprecht.translate']);

angular.module('HashBangURLs', []).config(['$locationProvider', function ($locationProvider) {
    $locationProvider.hashPrefix('!');
}]);

App.run(['$rootScope', '$location', 'appLoading', function($rootScope, $location, appLoading) {
        $rootScope.now = new Date();

        $rootScope.$on('$routeChangeStart', function () {
            appLoading.loading();
        });

        $rootScope.$on('$routeChangeSuccess', function () {
            appLoading.ready();
        });
    }])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/', { templateUrl: 'templates/index.html', controller: 'IndexCtrl' });
        $routeProvider.when('/chat/:user?', { templateUrl: 'templates/index.html', controller: 'IndexCtrl' });
        $routeProvider.otherwise({ redirectTo: '/' });
    }]);