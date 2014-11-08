(function() {
  define(['angular', 'angularFire', 'angular-route', 'firebaseSimpleLogin', 'ngProgress'], function(angular) {
    return angular.module('app', ['app.controllers', 'app.directives', 'app.filters', 'firebase', 'ngRoute', 'ngProgress']).config([
      '$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
        var page, _i, _len, _ref, _results;
        _ref = k$.settings.angular.pages;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          page = _ref[_i];
          _results.push($routeProvider.when('/' + page, {
            templateUrl: '/partials/' + page + '.html'
          }));
        }
        return _results;
      }
    ]);
  });

}).call(this);
