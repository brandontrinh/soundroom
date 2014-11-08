(function() {
  define(['./markup.txt!text'], function(markup) {
    return $('#disqus').html(markup);
  });

}).call(this);
