/// Survey.user.js

var surveyFactory = [
  '$ionicModal',
  '$http',
  function ($ionicModal, $http) {
    'use strict';
    var Survey = {},
      modalRef = {},
      localScope = {}; /// needed when user cancels
    Survey.init = function (scope) {
      localScope = scope;
      Survey.questions = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
      $ionicModal.fromTemplateUrl('views/Survey/Survey.user.html', {
        scope: scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
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
    Survey.submit = function () {
      if (!Survey.questions.every(function (el) {return el > 0;})) { /// if they aren't all filled in, reject
        return false;
      }
      $http.post('http://localhost:8000/api/v1/users/survey', {
        from: 'test1@bradorego.com',
        for: 'me@bradorego.com',
        questions: Survey.questions
      }).then(function (resp) {
        Survey.hide();
      }, function (err) {
        console.log(err);
      });
    };
    return Survey;
  }];

angular.module('User')
  .service('Survey', surveyFactory);
