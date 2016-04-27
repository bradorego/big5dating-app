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
