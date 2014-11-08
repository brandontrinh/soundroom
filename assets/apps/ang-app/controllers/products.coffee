define ['./module'], (controllers) ->
	controllers.controller 'ProductsCtrl', ['$scope', '$firebase', 'ngProgress', ($scope, $firebase, ngProgress) ->
		$scope.featuredProducts = []

		ngProgress.start()

		# Assigning also to genericItems allows for loosely-coupled use in pagination include
		$scope.products = $scope.genericItems = $firebase new Firebase "https://#{k$.settings.firebaseName}.firebaseio.com/#{k$.settings.firebaseNameVersion}/products/"
		$scope.products.$on 'loaded', ->
			ngProgress.complete()

			# Pagination

			$scope.currentPage = 0
			$scope.pageSize = 10
			$scope.numPages = () ->
				Math.ceil ($scope.genericItems.$getIndex().length - 3)/$scope.pageSize
			$scope.startFrom = () ->
				$('.product-img').popover()
				$scope.currentPage * $scope.pageSize + 3 # We used up the first three in the sub-featured items
			$scope.increment = () -> $scope.currentPage++
			$scope.deincrement = () -> $scope.currentPage--
			$scope.setCurrentPage = (number) ->
				$scope.currentPage = number

			# Shopping Cart

			$scope.lastRemoved = null
			$scope.purchases = [
				id: 'a49a78f944bf1f73f3f7ff9672463bb1abd4a402'
				product: $scope.products.$child '-JBfLmlGwW9B3zNv-XH9'
				quantity: 2
			,	
				id: 'c9066be544fb0fa01a9c4a12dbe9bc1b1a8a3ac3'
				product: $scope.products.$child '-JBfNWBiOqEuMdcYkgBG'
				quantity: 4
			,
				id: 'c9904d5ab9931e0f29f721aa0754effc77b66196'
				product: $scope.products.$child '-JBfPahaB9FomJej6cyu'
				quantity: 1
			]
			$scope.deletePurchase = (id) ->
				purchaseIndex = 0
				$.grep($scope.purchases, (e, i) -> purchaseIndex = i if e.id == id)
				$scope.lastRemoved = $scope.purchases[purchaseIndex]
				$scope.purchases.splice(purchaseIndex, 1)
			$scope.restorePurchase = (purchase) ->
				$scope.purchases.push(purchase)
				$scope.lastRemoved = null
			$scope.total = () ->
				return $scope.purchases.reduce(
					(a, b) ->
						return { quantity: a.quantity + (b.quantity * b.product.price)}
				, {quantity: 0}).quantity

	]