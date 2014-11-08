(function() {
  define(['./module'], function(filters) {
    return filters.filter('startFrom', [
      function() {
        return function(input, start) {
          var newArray;
          start = +start;
          return newArray = Object.prototype.toString.call(input) === "[object Array]" ? input.slice(start) : input;
        };
      }
    ]);
  });

}).call(this);
