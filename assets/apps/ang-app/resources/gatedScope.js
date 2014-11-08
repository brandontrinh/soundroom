  /**
   * @fileoverview
   * Defines an extension to angular.Scope that allows for registering
   * 'gating functions' on a scope that will prevent all future watchers
   * registered on the scope from being evaluated unless the gating function
   * returns true.
   *
   * By depending on this module, the $rootScope instance and angular.Scope
   * class are automatically extended to implement this new capability.
   *
   * Warning, this implementation depends on protected/private variables
   * in the angular.Scope implementation and therefore can break in the
   * future due to changes in the angular.Scope implementation.  Use at
   * your own risk.
   */

  angular.module('gatedScope', [])
  .config(['$provide', function($provide) {

    /*
    @fileoverview
    Defines core functions used throughout the Scalyr javascript
    code base.  This file is included on every page.

    @author Steven Czerwinski <czerwin@scalyr.com>
    */

    /*
    @param {Object} value The value to check
    @returns {Boolean} True if value is an Array
    */

    k$.isArray = function(value) {
      return Object.prototype.toString.call(value) === "[object Array]";
    };

    /*
    @param {*} value The value to check
    @returns {Boolean} True if value is a Boolean
    */


    k$.isBoolean = function(value) {
      return typeof value === "boolean";
    };

    /*
    @param {Object} value The value to check
    @returns {Boolean} True if value is a Date object
    */


    k$.isDate = function(value) {
      return Object.prototype.toString.call(value) === "[object Date]";
    };

    /*
    @param {*} value The value to check
    @returns {Boolean} True if value is undefined
    */


    k$.isDefined = function(value) {
      return typeof value !== "undefined";
    };

    /*
    @param {*} value The value to check
    @returns {Boolean} True if value is a Function
    */


    k$.isFunction = function(value) {
      return typeof value === "function";
    };

    /*
    @param {*} value The value to check
    @returns {Boolean} True if value is null
    */


    k$.isNull = function(value) {
      return value === null;
    };

    /*
    @param {*} value The value to check
    @returns {Boolean} True if value is a Number
    */


    k$.isNumber = function(value) {
      return typeof value === "number";
    };

    /*
    @param {*} value The value to check
    @returns {Boolean} True if value is an Object, not including null
    */


    k$.isObject = function(value) {
      return value !== null && typeof value === "object";
    };

    /*
    @param {*} value The value to check
    @returns {Boolean} True if value is a string
    */


    k$.isString = function(value) {
      return typeof value === "string";
    };

    /*
    @param {*} value The value to check
    @returns {Boolean} True if value is undefined
    */


    k$.isUndefined = function(value) {
      return typeof value === "undefined";
    };

    /*
    Converts a String or Boolean value to a Boolean.

    @param {String|Boolean} value The value to convert
    @returns {Boolean} Returns true for any String that is not
    null, empty String, or 'false'.  If value is a Boolean,
    returns value
    */


    k$.convertToBoolean = function(value) {
      if (isBoolean(value)) {
        return value;
      }
      return value !== null && value !== "" && value !== "false";
    };

    /*
    Determines if obj has a property named prop.

    @param {Object} obj The object to check
    @returns {Boolean} Returns true if obj has a property named
    prop.  Only considers the object's own properties
    */


    k$.hasProperty = function(obj, prop) {
      return obj.hasOwnProperty(prop);
    };

    /*
    @param {*} value The value to check
    @returns {Boolean} Returns true if value is a String
    and has zero length, or if null or undefined
    */


    k$.isStringEmpty = function(value) {
      return isNull(value) || isUndefined(value) || (isString(value) && (value.length === 0));
    };

    /*
    @param {*} value The value to check
    @returns {Boolean} Returns true if value is a String
    and has non-zero length
    */


    k$.isStringNonempty = function(value) {
      return isString(value) && (value.length > 0);
    };

    /*
    Returns input with the first letter capitalized.
    The input may not be zero length.

    @param {String} input The String to capitalize.
    @returns {String} Returns input with the first letter
    capitalized.
    */


    k$.upperCaseFirstLetter = function(input) {
      return input.charAt(0).toUpperCase() + input.slice(1);
    };

    /*
    Returns true if obj1 and obj2 are equal.  This should
    only be used for Arrays, Objects, and value types.  This is a deep
    comparison, comparing each property and recursive property to
    be equal (not just ===).

    Two Objects or values are considered equivalent if at least one of the following is true:
    - Both objects or values pass `===` comparison.
    - Both objects or values are of the same type and all of their properties pass areEqual
    comparison.
    - Both values are NaN. (In JavasScript, NaN == NaN => false. But we consider two NaN as equal).

    Note, during property comparision, properties with function values are ignores as are property
    names beginning with '$'.

    See angular.equal for more details.

    @param {Object|Array|value} obj1 The first object
    @param {Object|Array|value} obj2 The second object
    @returns {Boolean} True if the two objects are equal using a deep
    comparison.
    */


    k$.areEqual = function(obj1, obj2) {
      return angular.equals(obj1, obj2);
    };

    /*
    @param {Number} a The first Number
    @param {Number} b The second Number
    @returns {Number} The minimum of a and b
    */


    k$.min = function(a, b) {
      if (a < b) {
        return a;
      } else {
        return b;
      }
    };

    /*
    @param {Number} a The first Number
    @param {Number} b The second Number
    @returns {Number} The maximum of a and b
    */


    k$.max = function(a, b) {
      if (a > b) {
        return a;
      } else {
        return b;
      }
    };

    /*
    Returns true if the specified String begins with prefix.

    @param {*} input The input to check
    @ @param {String} prefix The prefix
    @returns {Boolean} True if input is a string that begins with prefix
    */


    k$.beginsWith = function(input, prefix) {
      return isString(input) && input.lastIndexOf(prefix, 0) === 0;
    };

    /*
    Returns true if the specified String ends with prefix.

    @param {*} input The input to check
    @ @param {String} postfix The postfix
    @returns {Boolean} True if input is a string that ends with postfix
    */


    k$.endsWith = function(input, postfix) {
      return isString(input) && input.indexOf(postfix, input.length - postfix.length) !== -1;
    };

    /*
    Returns a deep copy of source, where source can be an Object or an Array.  If a destination is
    provided, all of its elements (for Array) or properties (for Objects) are deleted and then all
    elements/properties from the source are copied to it.   If source is not an Object or Array,
    source is returned.

    See angular.copy for more details.
    @param {Object|Array} source The source
    @param {Object|Array} destination Optional object to copy the elements to
    @returns {Object|Array} The deep copy of source
    */


    k$.copy = function(source, destination) {
      return angular.copy(source, destination);
    };

    /*
    Removes property from obj.

    @param {Object} obj The object
    @param {String} property The property name to delete
    */


    k$.removeProperty = function(obj, property) {
      return delete obj[property];
    };

    /*
    Removes all properties in the array from obj.

    @param {Object} obj The object
    @param {Array} properties The properties to remove
    */


    k$.removeProperties = function(obj, properties) {
      var i, _results;
      i = 0;
      _results = [];
      while (i < properties.length) {
        delete obj[properties[i]];
        _results.push(++i);
      }
      return _results;
    };

    /*
    Invokes the iterator function once for each item in obj collection, which can be either
    an Object or an Array. The iterator function is invoked with iterator(value, key),
    where value is the value of an object property or an array element and key is the
    object property key or array element index. Specifying a context for the function is
    optional.  If specified, it becomes 'this' when iterator function is invoked.

    See angular.forEach for more details.

    @param {Object|Array} The Object or Array over which to iterate
    @param {Function} iterator The iterator function to invoke
    @param {Object} context The value to set for 'this' when invoking the
    iterator function. This is optional
    */


    k$.forEach = function(obj, iterator, context) {
      return angular.forEach(obj, iterator, context);
    };
    
    // We use a decorator to override methods in $rootScope.
    $provide.decorator('$rootScope', ['$delegate', '$exceptionHandler', 
        function ($rootScope, $exceptionHandler) {

      // Make a copy of $rootScope's original methods so that we can access
      // them to invoke super methods in the ones we override.
      scopePrototype = {};
      for (var key in $rootScope) {
        if (k$.isFunction($rootScope[key]))
          scopePrototype[key] = $rootScope[key];
      }

      var Scope = $rootScope.constructor;

      // Hold all of our new methods.
      var methodsToAdd = {
      };

      // A constant value that the $digest loop implementation depends on.  We
      // grab it down below.
      var initWatchVal;

      /**
       * @param {Boolean} isolate Whether or not the new scope should be isolated.
       * @returns {Scope} A new child scope
       */
      methodsToAdd.$new = function(isolate) {
        // Because of how scope.$new works, the returned result
        // should already have our new methods.
        var result = scopePrototype.$new.call(this, isolate);
        
        // We just have to do the work that normally a child class's
        // constructor would perform -- initializing our instance vars.
        result.$$gatingFunction = this.$$gatingFunction;
        result.$$shouldGateFunction = this.$$shouldGateFunction;
        result.$$gatedWatchers = [];

        return result;
      };

      /**
       * Digests all of the gated watchers for the specified gating function.
       *
       * @param {Function} targetGatingFunction The gating function associated
       *   with the watchers that should be digested
       * @returns {Boolean} True if any of the watchers were dirty
       */
      methodsToAdd.$digestGated = function gatedScopeDigest(targetGatingFunction) {
        // Note, most of this code was stolen from angular's Scope.$digest method.
        var watch, value,
          watchers,
          length,
          next, current = this, target = this,
          dirty = false;

        do { // "traverse the scopes" loop
          if (watchers = current.$$gatedWatchers) {
            // process our watches
            length = watchers.length;
            while (length--) {
              try {
                watch = watchers[length];
                // Scalyr edit: We do not process a watch function if it is does not
                // have the same gating function for which $digestGated was invoked.
                if (watch.gatingFunction !== targetGatingFunction)
                  continue;

                // Most common watches are on primitives, in which case we can short
                // circuit it with === operator, only when === fails do we use .equals
                if (watch && (value = watch.get(current)) !== (last = watch.last) &&
                    !(watch.eq
                        ? k$.areEqual(value, last)
                        : (typeof value == 'number' && typeof last == 'number'
                          && isNaN(value) && isNaN(last)))) {
                  dirty = true;
                  watch.last = watch.eq ? k$.copy(value) : value;
                  watch.fn(value, ((last === initWatchVal) ? value : last), current);
                  // Scalyr edit:  Removed the logging code for when the ttl is reached
                  // here because we don't have access to the ttl in this method.
                }
              } catch (e) {
                $exceptionHandler(e);
              }
            }
          }

          // Insanity Warning: scope depth-first traversal
          // yes, this code is a bit crazy, but it works and we have tests to prove it!
          // Scalyr edit: This insanity warning was from angular.  We only modified this
          // code by checking the $$gatingFunction because it's a good optimization to only go
          // down a child of a parent that has the same gating function as what we are processing
          // (since if a parent already has a different gating function, there's no way any
          // of its children will have the right one).
          if (!(next = ((current.$$gatingFunction === targetGatingFunction && current.$$childHead)
                || (current !== target && current.$$nextSibling)))) {
            while(current !== target && !(next = current.$$nextSibling)) {
              current = current.$parent;
            }
          }
        } while ((current = next));

        return dirty;
      };

      /**
       * @inherited $watch
       * @param directiveName The fourth parameter is a new optional parameter that allows
       *   directives aware of this abstraction to pass in their own names to identify
       *   which directive is registering the watch.  This is then passed to the
       *   shouldGateFunction to help determine if the watcher should be gated by the current
       *   gatingFunction.
       */
      methodsToAdd.$watch = function gatedWatch(watchExpression, listener, objectEquality,
          directiveName) {
        // Determine if we should gate this watcher.
        if (!k$.isNull(this.$$gatingFunction) && (k$.isNull(this.$$shouldGateFunction) ||
            this.$$shouldGateFunction(watchExpression, listener, objectEquality, directiveName)))  {
          // We do a hack here to just switch out the watchers array with our own
          // gated list and then invoke the original watch function.
          var tmp = this.$$watchers;
          this.$$watchers = this.$$gatedWatchers;
          // Invoke original watch function.
          var result = scopePrototype.$watch.call(this, watchExpression, listener, objectEquality);
          this.$$watchers = tmp;
          this.$$gatedWatchers[0].gatingFunction = this.$$gatingFunction;

          // We know that the last field of the watcher object will be set to initWatchVal, so we
          // grab it here.
          initWatchVal = this.$$gatedWatchers[0].last;

          return result;
        } else {
          return scopePrototype.$watch.call(this, watchExpression, listener, objectEquality);
        }
      };
      
      /**
       * Modifies this scope so that all future watchers registered by $watch will
       * only be evaluated if gatingFunction returns true.  Optionally, you may specify
       * a function that will be evaluted on every new call to $watch with the arguments
       * passed to it, and that watcher will only be gated if the function returns true.
       *
       * @param {Function} gatingFunction The gating function which controls whether or not all future
       *   watchers registered on this scope and its children will be evaluated on a given
       *   digest cycle.  The function will be invoked (with no arguments) on every digest
       *   and if it returns a truthy result, will cause all gated watchers to be evaluated.
       * @param {Function} shouldGateFunction The function that controls whether or not
       *   a new watcher will be gated using gatingFunction.  It is evaluated with the
       *   arguments to $watch and should return true if the watcher created by those
       *   arguments should be gated
       */
      methodsToAdd.$addWatcherGate = function(gatingFunction, shouldGateFunction) {
        var changeCount = 0;
        var self = this;

        // Set a watcher that sees if our gating function is true, and if so, digests
        // all of our associated watchers.  Note, this.$watch could already have a
        // gating function associated with it, which means this watch won't be executed
        // unless all gating functions before us have evaluated to true.  We take special
        // care of this nested case below.

        // We handle nested gating function in a special way.  If we are a nested gating
        // function (meaning there is already one or more gating functions on this scope and
        // our parent scopes), then if those parent gating functions every all evaluate to
        // true (which we can tell if the watcher we register here is evaluated), then
        // we always evaluate our watcher until our gating function returns true.
        var hasNestedGates = !k$.isNull(this.$$gatingFunction);
        var promotedWatcher = null;

        this.$watch(function() {
          if (gatingFunction()) {
            if (self.$digestGated(gatingFunction))
              ++changeCount;
          } else if (hasNestedGates && k$.isNull(promotedWatcher)) {
            promotedWatcher = scopePrototype.$watch.call(self, function() {
              if (gatingFunction()) {
                promotedWatcher();
                promotedWatcher = null;
                if (self.$digestGated(gatingFunction))
                  ++changeCount;
              }
              return changeCount;
            });
          }
          return changeCount;
        });


        if (k$.isUndefined(shouldGateFunction))
          shouldGateFunction = null;
        this.$$gatingFunction = gatingFunction;
        this.$$shouldGateFunction = shouldGateFunction;
      };

      // Extend the original Scope object so that when
      // new instances are created, it has the new methods.
      angular.extend(Scope.prototype, methodsToAdd);

      // Also extend the $rootScope instance since it was created
      // before we got a chance to extend Scope.prototype.
      angular.extend($rootScope, methodsToAdd);

      $rootScope.$$gatingFunction = null;
      $rootScope.$$shouldGateFunction = null;
      $rootScope.$$gatedWatchers = [];

      return $rootScope;
    }]);
  }]);