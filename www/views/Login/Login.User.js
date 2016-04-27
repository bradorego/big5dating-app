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
