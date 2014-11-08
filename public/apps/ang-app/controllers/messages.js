(function() {
  define(['./module'], function(controllers) {
    return controllers.controller('MessagesCtrl', [
      '$scope', '$firebase', 'ngProgress', function($scope, $firebase, ngProgress) {
        $scope.threads = $firebase(new Firebase("https://" + k$.settings.firebaseName + ".firebaseio.com/" + k$.settings.firebaseNameVersion + "/threads/"));
        $scope.contacts = $firebase(new Firebase("https://" + k$.settings.firebaseName + ".firebaseio.com/" + k$.settings.firebaseNameVersion + "/contacts/"));
        $scope.contacts.$on('loaded', function() {});
        ngProgress.start();
        return $scope.threads.$on('loaded', function() {
          ngProgress.complete();
          $scope.contactForId = function(id) {
            return $scope.contacts[id];
          };
          $scope.selectedThread = $scope.threads[0];
          return $scope.setSelectedThread = function(thread) {
            return $scope.selectedThread = thread;
          };
        });
      }
    ]);
  });

}).call(this);
