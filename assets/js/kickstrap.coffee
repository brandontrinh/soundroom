#= require "_settings"
#= require "_extend"
#= require "_badge"

# Future-proofing
# window.System = window.jspm

# Set defaults and extend with user's customizations
k$settings = extend(
	mode: 'dev'
	firebaseName: 'kickstrap-demo'
	version: '2.0.0 alpha'
, window.k$ or {})

# Create global k$ object
k$ = window.k$ = () ->
k$.settings = k$settings

# Reassignment of JSPM one-off app-loading
k$.import = (app) -> jspm.import app

k$.app = (name, options) ->
	htmlElement = document.body.childNodes[document.body.childNodes.length - 3]

	jspm.import name, (app) ->
		app.attach htmlElement, options

k$.readyFxs = []
k$.ready = (fx) ->
	k$.readyFxs.push(fx)

jspmResources = k$.settings.core

System.urlArgs = '?bust=' + new Date().getTime() if k$.settings.mode == 'dev'

# Add the "ks:" namespace
System.paths['ks:*'] = 'apps/*.js'

# auto main entry point to 'main'
systemNormalize = System.normalize;
System.normalize = (name, parentName, parentAddress) ->
  Promise.resolve systemNormalize.call(this, name, parentName, parentAddress)
  .then (normalized) ->
    if (normalized.substr(0, 3) == 'ks:' && normalized.split('/').length == 1)
      normalized += '/main';
    normalized;

# compatibility layer
# supports old jspm.import function
window.jspm =
	import: (names, callback, errback) ->
		if typeof names == 'string'
			names = [names];
		
		(Promise.all names.map (n) -> System.import(n))
		.then (modules) ->
			callback.apply null, modules
		.catch errback


# Build angular app core
k$.appCore = []
k$.appCore.push 'ks:ang-app/controllers/' + ctrl for ctrl in k$.settings.angular.controllers
k$.appCore.push 'ks:ang-app/directives/' + dctv for dctv in k$.settings.angular.directives
k$.appCore.push 'ks:ang-app/filters/' + filter for filter in k$.settings.angular.filters

jspmResources = jspmResources.concat k$settings.apps
jspmResources = jspmResources.concat k$.appCore

# this can be changed to Promise.all in due course
jspm.import jspmResources, ($, app, angular) ->
	$(document).ready ->
		document.body.className += 'loaded'
		angular.bootstrap document, ['app']
		i = 0
		while i < k$.readyFxs.length
			k$.readyFxs[i]()
			i++
		k$.ready = (fx) ->
			fx()
.catch (e) ->
	setTimeout () -> 
	  throw e
	, 1000