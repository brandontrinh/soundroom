define ['./module'], (controllers) ->
	controllers.controller 'HomeCtrl', ['$scope', '$firebase', '$location', ($scope, $firebase, $location) ->
		# Theme switcher
		$scope.themes = [
			name: 'amelia'
			title: 'Amelia*'
		,
			name: 'bootstrap'
			title: 'Bootstrap Default'
		,
			name: 'cerulean'
			title: 'Cerulean*'
		,
			name: 'cosmo'
			title: 'Cosmo*'
		,
			name: 'cyborg'
			title: 'Cyborg*'
		,
			name: 'flatly'
			title: 'Flatly*'
		,
			name: 'kickstrap'
			title: 'Kickstrap Default'
		,
			name: 'journal'
			title: 'Journal*'
		,
			name: 'readable'
			title: 'Readable*'
		,
			name: 'simplex'
			title: 'Simplex*'
		,
			name: 'slate'
			title: 'Slate*'
		,
			name: 'spacelab'
			title: 'Spacelab*'
		,
			name: 'united'
			title: 'United*'
		,
			name: 'yeti'
			title: 'Yeti*'
		]
		$scope.themePreviewUrl = ''
		$scope.setTheme = (name) ->
			$scope.themePreviewUrl = './themes/' + name + '.css'
			$scope.themePreviewUrl = './css/bootstrap.css' if name == 'bootstrap'
			k$.demoStylesheet()
		$scope.setPong = () ->
			jspm.import 'ks:pong', () ->
	]