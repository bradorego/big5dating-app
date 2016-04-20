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
