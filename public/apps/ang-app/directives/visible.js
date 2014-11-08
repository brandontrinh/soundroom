(function() {
  define(['./module'], function(directives) {
    return directives.directive('ksVisible', [
      function() {
        return function(scope, element, attrs) {
          return scope.$watch(attrs.ksVisible, function(visible) {
            return element.css('visibility', visible ? 'visible' : 'hidden');
          });
        };
      }
    ]);
  });

}).call(this);
