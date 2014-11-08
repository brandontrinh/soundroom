(function() {
  define(['./module'], function(directives) {
    return directives.directive('ksEnter', [
      function() {
        return function(scope, element, attrs) {
          return element.bind("keydown keypress", function(event) {
            if (event.which === 13) {
              scope.$apply(function() {
                return scope.$eval(attrs.ksEnter);
              });
              return event.preventDefault();
            }
          });
        };
      }
    ]);
  });

}).call(this);
