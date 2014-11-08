define ['./module'], (controllers) ->
	controllers.controller 'LoginCtrl', ['$scope', '$firebaseAuth', '$rootScope', ($scope, $firebaseAuth, $rootScope) ->
		ref = new Firebase "https://#{k$.settings.firebaseName}.firebaseio.com"
		$scope.auth = $firebaseAuth ref
		$rootScope.$on '$firebaseAuth:login', (e, user) ->
			$scope.auth.user.thumbnailImg = ''
			switch user.provider
				when 'twitter' then $scope.auth.user.thumbnailImg = user.profile_image_url
				when 'github' then $scope.auth.user.thumbnailImg = user.avatar_url
				when 'facebook' then $scope.auth.user.thumbnailImg = "http://graph.facebook.com/#{user.username}/picture?type=large"

	]