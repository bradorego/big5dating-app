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
