// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

(function () {
  'use strict';
  var appRun = [
    '$ionicPlatform',
    '$rootScope',
    '$timeout',
    '$ionicLoading',
    '$http',
    function ($ionicPlatform, $rootScope, $timeout, $ionicLoading, $http) {
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
    appResolve = {
      Auth: [
        'User',
        '$state',
        function (User, $state) {
          'use strict';
          return User.login()
            .then(function (user) {
              return user;
            }, function (err) {
              console.log(err);
              return $state.go('login');
            });
        }]
    },
    appConfig = [
      '$stateProvider',
      '$urlRouterProvider',
      '$httpProvider',
      'FacebookProvider',
      function ($stateProvider, $urlRouterProvider, $httpProvider, FacebookProvider) {
        FacebookProvider.init('271117706557587');
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
    appCtrl = [
      '$state',
      function ($state) {
        'use strict';
        var appVM = this;
        appVM.signOut = function () {
          $state.go('login');
        };
      }];

  angular.module('Tabs', []);
  angular.module('User', ['ngStorage']);
  angular.module('starter', ['ionic', 'facebook', 'User', 'Tabs'])
    .controller('appController', appCtrl)
    .run(appRun)
    .config(appConfig)
    .value("API_ROOT", "http://localhost:8000/api/v1");
}());

(function () {
  'use strict';

  var chatsFactory = function () {
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

  angular.module('User')
    .factory('Chats', chatsFactory);
}());

/// Survey.user.js
(function () {
  'use strict';
  var surveyFactory = [
    '$ionicModal',
    '$http',
    'API_ROOT',
    'User',
    function ($ionicModal, $http, API_ROOT, User) {
      var Survey = {},
        modalRef = {},
        localScope = {}; /// needed when user cancels
      Survey.init = function (scope) {
        localScope = scope;
        Survey.questions = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
        $ionicModal.fromTemplateUrl('views/Survey/Survey.user.html', {
          scope: scope,
          animation: 'slide-in-up'
        }).then(function (modal) {
          modalRef = modal;
        });
      };
      Survey.show = function () {
        modalRef.show();
      };
      Survey.hide = function () {
        modalRef.hide();
        Survey.init(localScope);
      };
      Survey.submit = function (friend) {
        if (!Survey.questions.every(function (el) {return el > 0; })) { /// if they aren't all filled in, reject
          return false;
        }
        $http.post(API_ROOT + '/users/survey', {
          from: User.cache().email,
          for: friend.email,
          questions: Survey.questions
        }).then(function (resp) {
          console.log(resp);
          if (resp.status === 200) {
            localScope.$broadcast('surveySubmitted', friend);
            Survey.hide();
          }
        }, function (err) {
          console.log(err);
        });
      };
      return Survey;
    }];

  angular.module('User')
    .service('Survey', surveyFactory);
}());

/// User.user.js
(function () {
  'use strict';

  var userFactory = [
    '$http',
    'API_ROOT',
    '$localStorage',
    '$q',
    'Facebook',
    function ($http, API_ROOT, $localStorage, $q, Facebook) {
      var User = {},
        cached = {};
      User.fbLogin = function () {
        var d = $q.defer();
        Facebook.login(function(response) {
          console.log(response);
          d.resolve(response);
        }, {
          scope: 'public_profile,user_friends,user_photos,user_birthday'
        });
        return d.promise;
      };
      User.fbMe = function () {
        var d = $q.defer();
        Facebook.api('/me', function (response) {
          console.log(response);
          d.resolve(response);
        }, {fields: 'picture.width(800),name,birthday,gender'});
        return d.promise;
      };
      User.fbFriends = function (token) {
        var d = $q.defer();
        Facebook.api('/me/friends', function (response) {
          console.log(response);
          d.resolve(response);
        }, {token: token});
        return d.promise;
      };
      User.create = function (obj) {
        var d = $q.defer();
        $http.post(API_ROOT + "/users", {
          email: obj.email,
          password: obj.password
        }).then(function (resp) {
          $localStorage.auth = window.btoa(obj.email + ":big5:" + obj.password);
          cached = resp.data;
          d.resolve(resp.data);
        }, function (err) {
          d.reject(err);
        });
        return d.promise;
      };
      User.login = function (obj) {
        var d = $q.defer(),
          creds = [];
        if (!obj && $localStorage.auth) {
          creds = window.atob($localStorage.auth).split(":big5:");
          obj = {
            email: creds[0],
            password: creds[1]
          };
        }
        $http.put(API_ROOT + "/users", {
          email: obj.email,
          password: obj.password
        }).then(function (resp) {
          $localStorage.auth = window.btoa(obj.email + ":big5:" + obj.password);
          cached = resp.data;
          d.resolve(resp.data);
        }, function (err) {
          d.reject(err);
        });
        return d.promise;
      };
      User.refresh = function () {
        var d = $q.defer();
        $http.get(API_ROOT + "/users", {
          email: window.atob($localStorage.auth).split(":big5:")[0]
        }).then(function (resp) {
          cached = resp.data;
          d.resolve(resp.data);
        }, function (err) {
          d.reject(err);
        });
        return d.promise;
      };
      User.getFriends = function (obj) {
        var d = $q.defer();
        if (!obj) {
          obj.email = cached.email;
        }
        $http.get(API_ROOT + "/users/friends", {
          email: obj.email
        }).then(function (resp) {
          d.resolve(resp.data);
        }, function (err) {
          d.reject(err);
        });
        return d.promise;
      };
      User.cache = function () {
        return cached;
      };
      User.isLoggedIn = function () {
        return $localStorage.auth;
      };
      User.logout = function () {
        delete $localStorage.auth;
        return true;
      };
      return User;
    }];

  angular.module('User')
    .service('User', userFactory);
}());

/// Login.User.js
(function () {
  'use strict';

  var loginCtrl = [
    'User',
    '$state',
    '$scope',
    function (User, $state, $scope) {
      var vm = this;
      $scope.$on('$ionicView.enter', function () {
        User.logout();
      });
      vm.signIn = function () {
        User.login({email: vm.email, password: vm.password})
          .then(function () { ///resp) {
            $state.go('app.dash');
          }, function (err) {
            if (err.status === 404) { /// user not found - let's make one!
              User.create({email: vm.email, password: vm.password})
                .then(function () {
                  $state.go('app.dash');
                }, function (err) {
                  console.warn(err);
                });
            }
            console.warn(err);
          });
      };
    }],
    loginConfig = [
      '$stateProvider',
      function ($stateProvider) {
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
}());

/// Account.tabs.js
(function () {
  'use strict';
  var accountCtrl = [
    function () {
      'use strict';
      var vm = this;
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
}());

/// Chats.tabs.js
var chatsCtrl = [
  '$scope',
  function ($scope) {
    'use strict';
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});
  }];


angular.module('Tabs')
  .controller('ChatsCtrl', chatsCtrl);

/// Dash.tabs.js
(function () {
  'use strict';
  var DashCtrl = [
    '$scope',
    'Survey',
    'User',
    function ($scope, Survey, User) {
      var vm = this;
      Survey.init($scope);
      $scope.Survey = Survey;
      console.log(User.cache());
      vm.friends = User.cache().friends;
      vm.showSurvey = function (friend) {
        vm.friend = friend;
        Survey.show();
      };
      vm.fbLogin = function () {
        User.fbLogin().then(function (resp) {
          vm.fbUser = resp;
          User.fbFriends(resp.authResponse.accessToken);
        });
      };
      vm.fbMe = function () {
        User.fbMe().then(function (resp) {
          vm.FBMe = resp;
        });
      };
      $scope.$on('surveySubmitted', function (event, friend) {
        var i = 0;
        for (i = 0; i < vm.friends.length; i++) {
          if (vm.friends[i].email === friend.email) {
            vm.friends.splice(i, 1);
            break;
          }
        }
      });
      vm.selected = {};
    }],
    dashResolve = {},
    dashConfig = [
      '$stateProvider',
      function ($stateProvider) {
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
}());
