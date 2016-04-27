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
