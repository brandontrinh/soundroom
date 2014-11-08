(function() {
  window.k$ = {
    apps: ['ks:sample-app', 'ks:tinygrowl', 'ks:ang-app', 'ks:kickstrap-logo'],
    angular: {
      controllers: ['messages', 'products', 'docs', 'home', 'login'],
      directives: ['enter', 'visible', 'repeat'],
      filters: ['startFrom'],
      pages: ['first-steps', 'apps', 'api', 'coffeescript', 'jade', 'pages', 'partials', 'roots', 'stylus', 'templates', 'acknowledgments', 'optimizations', 'social-login', 'growls']
    },
    firebaseNameVersion: 'v2-0',
    core: ['jquery', 'bootstrap', 'angular', 'fontawesome']
  };

  System.map = {
    'jquery': 'github:components/jquery@2.0',
    'bootstrap': 'github:twbs/bootstrap@3.0/js/bootstrap',
    'angular': 'github:angular/bower-angular@1.2.1',
    'angularFire': 'github:firebase/angularFire@0.5',
    'ang-app': 'ks:ang-app',
    'angular-route': 'ks:ang-app/resources/angular-route',
    'gatedScope': 'ks:ang-app/resources/gatedScope',
    'fontawesome': 'github:FortAwesome/Font-Awesome@4.0.3/css/font-awesome.min.css!',
    'ngProgress': 'ks:ang-app/resources/ngprogress',
    'firebaseSimpleLogin': 'ks:ang-app/resources/firebaseSimpleLogin',
    'css': 'github:jspm/plugin-css/css'
  };

  System.shim = {
    'github:angular/bower-angular@1.2.1/angular.min': {
      exports: 'angular'
    },
    'ks:ang-app/resources/angular-route': ['angular'],
    'ks:ang-app/resources/ngprogress': ['angular'],
    'ks:ang-app/resources/gatedScope': ['angular']
  };

}).call(this);

(function() {
  window.extend = function(objA, objB) {
    var p;
    for (p in objB) {
      if (typeof objA[p] === "object") {
        extend(objA[p], objB[p]);
      } else {
        objA[p] = objB[p];
      }
    }
    return objA;
  };

}).call(this);

(function() {
  try {
    console.log('%cKickstrap', 'font-style:italic;font-family: helvetica neue, helvetica, sans-serif;font-size:20px;color:#FDD726;text-shadow:0 1px 0 #D1B43B,0 2px 0 #D1B43B,0 3px 0 #D1B43B,0 4px 0 #D1B43B,0 5px 0 #D1B43B,0 6px 1px rgba(30,28,23,.1),0 0 5px rgba(30,28,23,.1),0 1px 3px rgba(30,28,23,.3),0 3px 5px rgba(30,28,23,.2),0 5px 10px rgba(30,28,23,.25),0 10px 10px rgba(30,28,23,.2),0 20px 20px rgba(30,28,23,.15);');
  } catch (_error) {
    return;
  }

}).call(this);

(function() {
  var ctrl, dctv, filter, jspmResources, k$, k$settings, systemNormalize, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;

  k$settings = extend({
    mode: 'dev',
    firebaseName: 'kickstrap-demo',
    version: '2.0.0 alpha'
  }, window.k$ || {});

  k$ = window.k$ = function() {};

  k$.settings = k$settings;

  k$["import"] = function(app) {
    return jspm["import"](app);
  };

  k$.app = function(name, options) {
    var htmlElement;
    htmlElement = document.body.childNodes[document.body.childNodes.length - 3];
    return jspm["import"](name, function(app) {
      return app.attach(htmlElement, options);
    });
  };

  k$.readyFxs = [];

  k$.ready = function(fx) {
    return k$.readyFxs.push(fx);
  };

  jspmResources = k$.settings.core;

  if (k$.settings.mode === 'dev') {
    System.urlArgs = '?bust=' + new Date().getTime();
  }

  System.paths['ks:*'] = 'apps/*.js';

  systemNormalize = System.normalize;

  System.normalize = function(name, parentName, parentAddress) {
    return Promise.resolve(systemNormalize.call(this, name, parentName, parentAddress).then(function(normalized) {
      if (normalized.substr(0, 3) === 'ks:' && normalized.split('/').length === 1) {
        normalized += '/main';
      }
      return normalized;
    }));
  };

  window.jspm = {
    "import": function(names, callback, errback) {
      if (typeof names === 'string') {
        names = [names];
      }
      return (Promise.all(names.map(function(n) {
        return System["import"](n);
      }))).then(function(modules) {
        return callback.apply(null, modules);
      })["catch"](errback);
    }
  };

  k$.appCore = [];

  _ref = k$.settings.angular.controllers;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    ctrl = _ref[_i];
    k$.appCore.push('ks:ang-app/controllers/' + ctrl);
  }

  _ref1 = k$.settings.angular.directives;
  for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
    dctv = _ref1[_j];
    k$.appCore.push('ks:ang-app/directives/' + dctv);
  }

  _ref2 = k$.settings.angular.filters;
  for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
    filter = _ref2[_k];
    k$.appCore.push('ks:ang-app/filters/' + filter);
  }

  jspmResources = jspmResources.concat(k$settings.apps);

  jspmResources = jspmResources.concat(k$.appCore);

  jspm["import"](jspmResources, function($, app, angular) {
    return $(document).ready(function() {
      var i;
      document.body.className += 'loaded';
      angular.bootstrap(document, ['app']);
      i = 0;
      while (i < k$.readyFxs.length) {
        k$.readyFxs[i]();
        i++;
      }
      return k$.ready = function(fx) {
        return fx();
      };
    });
  })["catch"](function(e) {
    return setTimeout(function() {
      throw e;
    }, 1000);
  });

}).call(this);
