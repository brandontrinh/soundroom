define ['./markup.txt!text', 'jquery', './responsive.css!'], (markup, $) ->
	$('#ads').html '<br>' + markup

	# Create a responsive ad unit and enter
	# your Google AdSense code in markup.txt