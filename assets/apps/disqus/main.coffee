define ['./markup.txt!text'], (markup) ->
	$('#disqus').html(markup)
	# Pace.stop()