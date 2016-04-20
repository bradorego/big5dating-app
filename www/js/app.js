// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

var appRun = [
  '$ionicPlatform',
  '$rootScope',
  '$timeout',
  '$ionicLoading',
  '$http',
  function ($ionicPlatform, $rootScope, $timeout, $ionicLoading, $http) {
    'use strict';
    var stateTimeout = {};
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        window.cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        window.StatusBar.styleDefault();
      }
    });
    /*jslint unparam: true*/
    $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
      console.log("stateChangeError", error);
      $ionicLoading.hide();
      $rootScope.cancelTimeout();
    });
    $rootScope.$on('$stateChangeStart', function () { ///event, toState, toParams, fromState, fromParams, options) {
      stateTimeout = $timeout(function () { //If transition takes longer than 30 seconds, timeout.
        $ionicLoading.hide();
        // $ionicPopup.alert({'title': 'Timed Out', 'template': 'Communication with the server timed out. Please check your connection and try again.'});
        angular.forEach($http.pendingRequests, function (req) {
          if (req.abort) {
            req.abort.resolve();
          }
        });
      }, 30000);
    });
    $rootScope.$on('$stateChangeSuccess', function () {
      $rootScope.cancelTimeout();
    });
    /*jslint unparam:false */


    $rootScope.cancelTimeout = function () {
      $timeout.cancel(stateTimeout);
    };
  }],
  appResolve = {},
  appConfig = [
    '$stateProvider',
    '$urlRouterProvider',
    '$httpProvider',
    function ($stateProvider, $urlRouterProvider, $httpProvider) {
      // $ionicConfigProvider.views.transition('android');
      'use strict';
      $httpProvider.interceptors.push([
        '$q',
        function ($q) {
          return {
            request: function (config) {
              ///Add an http aborter
              var abort = $q.defer();
              config.abort = abort;
              config.timeout = abort.promise;
              return config;
            }
          };
        }]);
      $stateProvider.state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'views/Tabs/Tabs.tabs.html',
        controller: 'appController as appVM',
        resolve: appResolve
      });
      $urlRouterProvider.otherwise('/login');
    }],
  appCtrl = [function () {
    'use strict';
    angular.noop();
  }];

angular.module('Tabs', []);
angular.module('User', []);
angular.module('starter', ['ionic', 'User', 'Tabs'])
  .controller('appController', appCtrl)
  .run(appRun)
  .config(appConfig);
