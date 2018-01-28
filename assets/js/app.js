'use strict';

var linkyApp = angular.module('linkyApp', ['ngRoute', 'ui.bootstrap']);
linkyApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.when('/', {
      template: JST['assets/templates/url.html'](),
      controller: 'UrlCtrl'
    }).when('/join', {
      template: JST['assets/templates/join.html'](),
      controller: 'UserCtrl'
    }).when('/donate', {
      template: JST['assets/templates/donate.html'](),
    }).when('/:id', {
      template: JST['assets/templates/urlaskpass.html'](),
      controller: 'UrlPassCtrl'
    }).otherwise({
      redirectTo: '/',
      caseInsensitiveMatch: true
    });
  }
]);

linkyApp.config(['$locationProvider',
  function($locationProvider) {
    $locationProvider.html5Mode(true);
  }
]);

linkyApp.factory('Page', function() {
   var title = 'Linky';
   return {
     title: function() { return title; },
     setTitle: function(newTitle) { title = newTitle }
   };
});

linkyApp.factory('User', ['UserService', function(UserService) {
  return {
    userLogged: function() {
      UserService.getUserLogged().then(function(res) {
        console.log(res)
        return res;
      });
    }
  };
}]);

linkyApp.controller('MainCtrl', ['$scope', 'Page', 'User', function($scope, Page, User) {
  $scope.Page = Page;
  $scope.User = User;
  var userLogged = User.userLogged();
}]);

linkyApp.controller('UrlCtrl', ['$scope', '$rootScope', 'UrlService', function($scope, $rootScope, UrlService) {
  $scope.formData = {};
  $scope.newUrlData = false;

  $scope.createUrl = function() {
    UrlService.createUrl($scope.formData).then(function(res) {
      $scope.newUrlData = res;
      $scope.newUrlData.url = 'http://linky.tk/' + $scope.newUrlData.id;
      if ($scope.newUrlData.telealerts == true) {
        $scope.newUrlData.telecommand = '/alert ' + $scope.newUrlData.id + ' ' + $scope.newUrlData.secretkey;
      };
      $scope.formData = {};
      console.log($scope.newUrlData);
    });
  }
}]);

linkyApp.controller('UrlPassCtrl', ['$scope', '$routeParams', '$window', 'UrlService', function($scope, $routeParams, $window, UrlService) {
  $scope.formData = {};
  $scope.formData.id = $routeParams.id;
  $scope.resData = false;

  $scope.sendPass = function() {
    UrlService.sendPass($scope.formData).then(function(res) {
      console.log(res)
      if (res.urlRedirectTarget) {
        $window.location.href = res.urlRedirectTarget;
      }
      $scope.resData = res;
    });
  }
}]);

linkyApp.controller('UserCtrl', ['$scope', '$location', 'UserService', function($scope, $location, UserService) {
  $scope.Page.setTitle('Sign Up - Linky');
  $scope.formData = {};
  $scope.resData = false;

  $scope.addUser = function() {
    UserService.addUser($scope.formData).then(function(res) {
      $scope.resData = res;
      console.log(res);
      if (res == 'OK') {
        $location.path("/");
      }
    });
  }
}]);
