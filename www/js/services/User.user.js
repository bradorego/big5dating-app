/// User.user.js
(function () {
  'use strict';

  var userFactory = [
    '$http',
    'API_ROOT',
    '$localStorage',
    '$q',
    'Facebook',
    function ($http, API_ROOT, $localStorage, $q, Facebook) {
      var User = {},
        cached = {};
      User.fbLogin = function () {
        var d = $q.defer();
        Facebook.login(function(response) {
          console.log(response);
          d.resolve(response);
        }, {
          scope: 'public_profile,user_friends,user_photos,user_birthday'
        });
        return d.promise;
      };
      User.fbMe = function () {
        var d = $q.defer();
        Facebook.api('/me', function (response) {
          console.log(response);
          d.resolve(response);
        }, {fields: 'picture.width(800),name,birthday,gender'});
        return d.promise;
      };
      User.fbFriends = function (token) {
        var d = $q.defer();
        Facebook.api('/me/friends', function (response) {
          console.log(response);
          d.resolve(response);
        }, {token: token});
        return d.promise;
      };
      User.create = function (obj) {
        var d = $q.defer();
        $http.post(API_ROOT + "/users", {
          email: obj.email,
          password: obj.password
        }).then(function (resp) {
          $localStorage.auth = window.btoa(obj.email + ":big5:" + obj.password);
          cached = resp.data;
          d.resolve(resp.data);
        }, function (err) {
          d.reject(err);
        });
        return d.promise;
      };
      User.login = function (obj) {
        var d = $q.defer(),
          creds = [];
        if (!obj && $localStorage.auth) {
          creds = window.atob($localStorage.auth).split(":big5:");
          obj = {
            email: creds[0],
            password: creds[1]
          };
        }
        $http.put(API_ROOT + "/users", {
          email: obj.email,
          password: obj.password
        }).then(function (resp) {
          $localStorage.auth = window.btoa(obj.email + ":big5:" + obj.password);
          cached = resp.data;
          d.resolve(resp.data);
        }, function (err) {
          d.reject(err);
        });
        return d.promise;
      };
      User.refresh = function () {
        var d = $q.defer();
        $http.get(API_ROOT + "/users", {
          email: window.atob($localStorage.auth).split(":big5:")[0]
        }).then(function (resp) {
          cached = resp.data;
          d.resolve(resp.data);
        }, function (err) {
          d.reject(err);
        });
        return d.promise;
      };
      User.getFriends = function (obj) {
        var d = $q.defer();
        if (!obj) {
          obj.email = cached.email;
        }
        $http.get(API_ROOT + "/users/friends", {
          email: obj.email
        }).then(function (resp) {
          d.resolve(resp.data);
        }, function (err) {
          d.reject(err);
        });
        return d.promise;
      };
      User.cache = function () {
        return cached;
      };
      User.isLoggedIn = function () {
        return $localStorage.auth;
      };
      User.logout = function () {
        delete $localStorage.auth;
        return true;
      };
      return User;
    }];

  angular.module('User')
    .service('User', userFactory);
}());
