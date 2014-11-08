define [
	'angular'
	'angularFire'
	'angular-route'
	'firebaseSimpleLogin'
	'ngProgress'
], (angular) ->
	angular.module('app', [
		'app.controllers'
		'app.directives'
		'app.filters'
		'firebase'
		'ngRoute'
		'ngProgress'
	]).config ['$routeProvider', '$locationProvider', ($routeProvider, $locationProvider) ->
		for page in k$.settings.angular.pages
			$routeProvider.when '/' + page, 
				templateUrl: '/partials/' + page + '.html'
	]