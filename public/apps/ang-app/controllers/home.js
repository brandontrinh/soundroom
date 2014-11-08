(function() {
  define(['./module'], function(controllers) {
    return controllers.controller('HomeCtrl', [
      '$scope', '$firebase', '$location', function($scope, $firebase, $location) {
        $scope.themes = [
          {
            name: 'amelia',
            title: 'Amelia*'
          }, {
            name: 'bootstrap',
            title: 'Bootstrap Default'
          }, {
            name: 'cerulean',
            title: 'Cerulean*'
          }, {
            name: 'cosmo',
            title: 'Cosmo*'
          }, {
            name: 'cyborg',
            title: 'Cyborg*'
          }, {
            name: 'flatly',
            title: 'Flatly*'
          }, {
            name: 'kickstrap',
            title: 'Kickstrap Default'
          }, {
            name: 'journal',
            title: 'Journal*'
          }, {
            name: 'readable',
            title: 'Readable*'
          }, {
            name: 'simplex',
            title: 'Simplex*'
          }, {
            name: 'slate',
            title: 'Slate*'
          }, {
            name: 'spacelab',
            title: 'Spacelab*'
          }, {
            name: 'united',
            title: 'United*'
          }, {
            name: 'yeti',
            title: 'Yeti*'
          }
        ];
        $scope.themePreviewUrl = '';
        $scope.setTheme = function(name) {
          $scope.themePreviewUrl = './themes/' + name + '.css';
          if (name === 'bootstrap') {
            $scope.themePreviewUrl = './css/bootstrap.css';
          }
          return k$.demoStylesheet();
        };
        return $scope.setPong = function() {
          return jspm["import"]('ks:pong', function() {});
        };
      }
    ]);
  });

}).call(this);
