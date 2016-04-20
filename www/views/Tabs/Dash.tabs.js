/// Dash.tabs.js

var DashCtrl = [
  '$scope',
  'Survey',
  function ($scope, Survey) {
    'use strict';
    var vm = this;
    Survey.init($scope);
    $scope.Survey = Survey;
    vm.enableFriends = true;
    vm.showSurvey = function () {
      vm.friend = {
        name: "Brad Orego",
        email: "me@bradorego.com"
      };
      Survey.show();
    };
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
