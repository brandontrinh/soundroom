(function() {
  define(['./module'], function(controllers) {
    return controllers.controller('DocsCtrl', [
      '$scope', '$firebase', '$location', 'ngProgress', function($scope, $firebase, $location, ngProgress) {
        $scope.sections = [
          {
            name: 'First Steps',
            path: 'first-steps'
          }, {
            name: 'Social Login',
            path: 'social-login'
          }, {
            name: 'Creating Pages',
            path: 'pages'
          }, {
            name: 'Creating Partials',
            path: 'partials'
          }, {
            name: 'Creating Apps',
            path: 'apps'
          }, {
            name: 'Creating Angular Templates',
            path: 'templates'
          }, {
            name: 'Compiling in Roots',
            path: 'roots'
          }, {
            name: 'Intro to CoffeeScript',
            path: 'coffeescript'
          }, {
            name: 'Intro to Stylus',
            path: 'stylus'
          }, {
            name: 'Intro to Jade',
            path: 'jade'
          }, {
            name: 'Acknowledgments',
            path: 'acknowledgments'
          }, {
            name: 'Optimizations',
            path: 'optimizations'
          }, {
            name: 'API',
            path: 'api'
          }, {
            name: 'Growls',
            path: 'growls'
          }
        ];
        $scope.setSelectedSection = function(section) {
          $scope.selectedSection = section;
          return $location.path(section.path);
        };
        return $scope.$on('$locationChangeSuccess', function() {
          var path, sectionIndex;
          path = $location.path();
          path = path.substr(1, path.length);
          sectionIndex = null;
          $.grep($scope.sections, function(e, i) {
            if (e.path === path) {
              return sectionIndex = i;
            }
          });
          return $scope.setSelectedSection($scope.sections[sectionIndex]);
        });
      }
    ]);
  });

}).call(this);
