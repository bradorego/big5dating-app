/// Dash.tabs.js

var DashCtrl = [
  '$scope',
  'Survey',
  'User',
  function ($scope, Survey, User) {
    'use strict';
    var vm = this;
    Survey.init($scope);
    $scope.Survey = Survey;
    console.log(User.cache());
    vm.friends = User.cache().friends;
    vm.showSurvey = function (friend) {
      vm.friend = friend;
      Survey.show();
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
