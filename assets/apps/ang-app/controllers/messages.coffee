define ['./module'], (controllers) ->
	controllers.controller 'MessagesCtrl', ['$scope', '$firebase', 'ngProgress', ($scope, $firebase, ngProgress) ->
		$scope.threads = $firebase new Firebase "https://#{k$.settings.firebaseName}.firebaseio.com/#{k$.settings.firebaseNameVersion}/threads/"
		$scope.contacts = $firebase new Firebase "https://#{k$.settings.firebaseName}.firebaseio.com/#{k$.settings.firebaseNameVersion}/contacts/"
		$scope.contacts.$on 'loaded', ->
		ngProgress.start()
		$scope.threads.$on 'loaded', ->
			ngProgress.complete()
			$scope.contactForId = (id) ->
				$scope.contacts[id]
			$scope.selectedThread = $scope.threads[0]
			$scope.setSelectedThread = (thread) ->
				$scope.selectedThread = thread
	]