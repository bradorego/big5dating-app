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
