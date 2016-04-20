/// Survey.survey.js

var surveyCtrl = [function () {
    'use strict';
    angular.noop();
  }],
  surveyConfig = [
    '$stateProvider',
    function ($stateProvider) {
      'use strict';
      $stateProvider
        .state('survey', {
          url: '/survey',
          templateUrl: 'views/Survey/Survey.survey.html',
          controller: 'SurveyCtrl as vm'
        });
    }];


angular.module('User')
  .controller('SurveyCtrl', surveyCtrl)
  .config(surveyConfig);
