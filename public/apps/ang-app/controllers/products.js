(function() {
  define(['./module'], function(controllers) {
    return controllers.controller('ProductsCtrl', [
      '$scope', '$firebase', 'ngProgress', function($scope, $firebase, ngProgress) {
        $scope.featuredProducts = [];
        ngProgress.start();
        $scope.products = $scope.genericItems = $firebase(new Firebase("https://" + k$.settings.firebaseName + ".firebaseio.com/" + k$.settings.firebaseNameVersion + "/products/"));
        return $scope.products.$on('loaded', function() {
          ngProgress.complete();
          $scope.currentPage = 0;
          $scope.pageSize = 10;
          $scope.numPages = function() {
            return Math.ceil(($scope.genericItems.$getIndex().length - 3) / $scope.pageSize);
          };
          $scope.startFrom = function() {
            $('.product-img').popover();
            return $scope.currentPage * $scope.pageSize + 3;
          };
          $scope.increment = function() {
            return $scope.currentPage++;
          };
          $scope.deincrement = function() {
            return $scope.currentPage--;
          };
          $scope.setCurrentPage = function(number) {
            return $scope.currentPage = number;
          };
          $scope.lastRemoved = null;
          $scope.purchases = [
            {
              id: 'a49a78f944bf1f73f3f7ff9672463bb1abd4a402',
              product: $scope.products.$child('-JBfLmlGwW9B3zNv-XH9'),
              quantity: 2
            }, {
              id: 'c9066be544fb0fa01a9c4a12dbe9bc1b1a8a3ac3',
              product: $scope.products.$child('-JBfNWBiOqEuMdcYkgBG'),
              quantity: 4
            }, {
              id: 'c9904d5ab9931e0f29f721aa0754effc77b66196',
              product: $scope.products.$child('-JBfPahaB9FomJej6cyu'),
              quantity: 1
            }
          ];
          $scope.deletePurchase = function(id) {
            var purchaseIndex;
            purchaseIndex = 0;
            $.grep($scope.purchases, function(e, i) {
              if (e.id === id) {
                return purchaseIndex = i;
              }
            });
            $scope.lastRemoved = $scope.purchases[purchaseIndex];
            return $scope.purchases.splice(purchaseIndex, 1);
          };
          $scope.restorePurchase = function(purchase) {
            $scope.purchases.push(purchase);
            return $scope.lastRemoved = null;
          };
          return $scope.total = function() {
            return $scope.purchases.reduce(function(a, b) {
              return {
                quantity: a.quantity + (b.quantity * b.product.price)
              };
            }, {
              quantity: 0
            }).quantity;
          };
        });
      }
    ]);
  });

}).call(this);
