(function() {
  define(['./module'], function(controllers) {
    return controllers.controller('LoginCtrl', [
      '$scope', '$firebaseAuth', '$rootScope', function($scope, $firebaseAuth, $rootScope) {
        var ref;
        ref = new Firebase("https://" + k$.settings.firebaseName + ".firebaseio.com");
        $scope.auth = $firebaseAuth(ref);
        return $rootScope.$on('$firebaseAuth:login', function(e, user) {
          $scope.auth.user.thumbnailImg = '';
          switch (user.provider) {
            case 'twitter':
              return $scope.auth.user.thumbnailImg = user.profile_image_url;
            case 'github':
              return $scope.auth.user.thumbnailImg = user.avatar_url;
            case 'facebook':
              return $scope.auth.user.thumbnailImg = "http://graph.facebook.com/" + user.username + "/picture?type=large";
          }
        });
      }
    ]);
  });

}).call(this);
