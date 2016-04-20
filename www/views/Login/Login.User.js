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
