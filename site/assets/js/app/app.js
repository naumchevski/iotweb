'use strict';

/* App Module */

var iotweb = angular.module('iotweb', [
  'ngRoute',
  'channelControllers'
]);

iotweb.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: '/assets/pages/start.html',
        controller: 'StartCtrl'
      }).
      when('/view/:channel', {
        templateUrl: '/assets/pages/view.html',
        controller: 'ViewCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);