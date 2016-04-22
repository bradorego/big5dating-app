/// User.user.js

var userFactory = [
  '$http',
  'API_ROOT',
  '$localStorage',
  '$q',
  function ($http, API_ROOT, $localStorage, $q) {
    'use strict';
    var User = {},
      cached = {};
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
