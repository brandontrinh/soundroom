(function() {
  var $;

  require("./sample-app.css!");

  $ = require("jquery");

  exports.attach = function(element, options) {
    return setTimeout((function() {
      return $(element).html("<p>Dynamic HTML changes</p>");
    }), options.timeout);
  };

}).call(this);
