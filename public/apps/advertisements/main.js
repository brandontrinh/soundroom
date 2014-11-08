(function() {
  define(['./markup.txt!text', 'jquery', './responsive.css!'], function(markup, $) {
    return $('#ads').html('<br>' + markup);
  });

}).call(this);
