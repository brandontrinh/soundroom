define ['./module'], (filters) ->
	filters.filter 'startFrom', [->
		(input, start) ->
			start = +start #parse to int
			newArray = if Object::toString.call(input) is "[object Array]" then input.slice start else input
	]

# Thanks http://j.mp/HUcrJj