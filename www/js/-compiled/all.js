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

    /*jslint unparam:true */
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, options) {
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
      // $httpProvider.interceptors.push([
      //   '$q',
      //   '$injector',
      //   function ($q, $injector) {
      //     return {
      //       request: function (config) {
      //         ///Add an http aborter
      //         var abort = $q.defer();
      //         config.abort = abort;
      //         config.timeout = abort.promise;
      //       }
      //     };
      //   }]);
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

angular.module('Chats', []);
angular.module('Tabs', ['Chats']);
angular.module('User', []);
angular.module('starter', ['ionic', 'User', 'Tabs', 'Chats'])
  .controller('appController', appCtrl)
  .run(appRun)
  .config(appConfig);

var chatsFactory = function () {
  'use strict';
  var Chats = {},
    chats = [{
      id: 0,
      name: 'Ben Sparrow',
      lastText: 'You on your way?',
      face: 'img/ben.png'
    }, {
      id: 1,
      name: 'Max Lynx',
      lastText: 'Hey, it\'s me',
      face: 'img/max.png'
    }, {
      id: 2,
      name: 'Adam Bradleyson',
      lastText: 'I should buy a boat',
      face: 'img/adam.jpg'
    }, {
      id: 3,
      name: 'Perry Governor',
      lastText: 'Look at my mukluks!',
      face: 'img/perry.png'
    }, {
      id: 4,
      name: 'Mike Harrington',
      lastText: 'This is wicked good ice cream.',
      face: 'img/mike.png'
    }];

  Chats.all = function () {
    return chats;
  };

  Chats.remove = function (chat) {
    chats.splice(chats.indexOf(chat), 1);
  };

  Chats.get = function (chatId) {
    var i = 0;
    for (i = 0; i < chats.length; i++) {
      if (chats[i].id === parseInt(chatId, 10)) {
        return chats[i];
      }
    }
    return null;
  };

  return Chats;
};

angular.module('Chats')
  .factory('Chats', chatsFactory);

/// Login.User.js

var loginCtrl = [function () {
    'use strict';
    angular.noop();
  }],
  loginConfig = [
    '$stateProvider',
    function ($stateProvider) {
      'use strict';
      $stateProvider
        .state('login', {
          url: '/login',
          templateUrl: 'views/Login/Login.user.html',
          controller: 'LoginCtrl as vm'
        });
    }];


angular.module('User')
  .controller('LoginCtrl', loginCtrl)
  .config(loginConfig);

/// Account.tabs.js


var accountCtrl = [
  function () {
    'use strict';
    var vm = this;

    vm.enableFriends = true;

    vm.selected = {};
  }],
  accountResolve = {},
  accountConfig = [
    '$stateProvider',
    function ($stateProvider) {
      'use strict';
      $stateProvider
        .state('app.settings', {
          url: '/settings',
          views: {
            'tabs': {
              templateUrl: 'views/Tabs/Account.tabs.html',
              controller: 'AccountCtrl as vm',
              resolve: accountResolve
            }
          }
        });
    }];

angular.module('Tabs')
  .config(accountConfig)
  .controller('AccountCtrl', accountCtrl);

/// Chats.tabs.js
var chatsCtrl = [
  'Chats',
  '$scope',
  function ($scope, Chats) {
    'use strict';
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.chats = Chats.all();
    $scope.remove = function (chat) {
      Chats.remove(chat);
    };
  }];


angular.module('Tabs')
  .controller('ChatsCtrl', chatsCtrl);

/// Dash.tabs.js

var DashCtrl = [
  function () {
    'use strict';
    angular.noop();
  }],
  dashResolve = {},
  dashConfig = [
    '$stateProvider',
    function ($stateProvider) {
      'use strict';
      $stateProvider
        .state('app.dash', {
          url: '/dash',
          views: {
            'tabs': {
              templateUrl: 'views/Tabs/Dash.tabs.html',
              controller: 'DashCtrl as vm',
              resolve: dashResolve
            }
          }
        });
    }];


angular.module('Tabs')
  .config(dashConfig)
  .controller('DashCtrl', DashCtrl);
