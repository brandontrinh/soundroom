(function() {
  define(['./module'], function(directives) {
    return directives.directive('slyRepeat', [
      '$animate', '$parse', function($animate, $parse) {
        /*
        @fileoverview
        Module:  slyRepeat
        
        Contains the slyRepeat directive, which is is a modified version of the
        ngRepeat directive that is meant to be more efficient for creating and
        recreating large lists of bound elements.  In particular, it has an
        optimization that will prevent DOM elements from being constantly created
        and destroyed as the contents of the repeated elements change.  It does this
        by not destroying DOM elements when they are no longer needed, but instead,
        just hiding them. This might not work for all use cases, but for it does
        for the ones we do wish to heavily optimize.  For eample, through profiling,
        we found that destroying DOM elements when flipping through log view pages
        represented a large chunk of CPU time.
        
        Cavaets:  The collection expression must evaluate to an array.  Animators
        will not work.  Track By does not work.  Use at your own peril.
        
        @author Steven Czerwinski <czerwin@scalyr.com>, Adam Kochanowicz <ajkochanowicz@gmail.com>
        
        defineScalyrAngularModule("slyRepeat", ["gatedScope"]).directive "slyRepeat", ["$animate", "$parse", ($animate, $parse) ->
        */

        /*
        Sets the scope contained in elementScope to gate all its
        watchers based on the isActiveForRepeat proprety.
        
        @param {Object} elementScope The object containing the
        scope and isActiveForRepeat properties.
        */

        var gateWatchersForScope;
        gateWatchersForScope = function(elementScope) {
          return elementScope.scope.$addWatcherGate(function() {
            return elementScope.isActiveForRepeat;
          });
        };
        return {
          restrict: "A",
          scope: true,
          transclude: "element",
          priority: 1000,
          terminal: true,
          compile: function(element, attr, linker) {
            return function($scope, $element, $attr) {
              var collectionExpr, deregisterCallback, expression, iterVar, match, previousElementBuffer, previousElements;
              expression = $attr.slyRepeat;
              match = expression.match(/^\s*(.+)\s+in\s+(.*?)$/);
              if (!match) {
                throw Error("Expected slyRepeat in form of '_item_ in _collection_' but got '" + expression + "'.");
              }
              iterVar = match[1];
              collectionExpr = match[2];
              match = iterVar.match(/^(?:([\$\w]+))$/);
              if (!match) {
                throw Error("'item' in 'item in collection' should be identifier but got '" + lhs + "'.");
              }
              previousElements = [];
              previousElementBuffer = [];
              deregisterCallback = $scope.$watchCollection(collectionExpr, function(collection) {
                var currentElementBuffer, currentElements, firstIndexToFix, i, lastIndexToFix, limit, newElement, newElements, originalPreviousElementsLength, prevElement;
                originalPreviousElementsLength = previousElements.length;
                if ((previousElements.length < collection.length) && (previousElementBuffer.length > 0)) {
                  limit = previousElements.length + previousElementBuffer.length;
                  if (limit > collection.length) {
                    limit = collection.length;
                  }
                  previousElements = previousElements.concat(previousElementBuffer.splice(0, limit - previousElements.length));
                }
                currentElements = null;
                currentElementBuffer = [];
                newElements = [];
                if (collection.length > previousElements.length) {
                  i = previousElements.length;
                  while (i < collection.length) {
                    newElement = {
                      scope: $scope.$new(),
                      isActiveForRepeat: true
                    };
                    gateWatchersForScope(newElement);
                    newElement.scope.$index = i;
                    newElement.scope.$first = i === 0;
                    newElements.push(newElement);
                    ++i;
                  }
                  currentElements = previousElements.concat(newElements);
                  currentElementBuffer = previousElementBuffer;
                } else if (collection.length < previousElements.length) {
                  i = collection.length;
                  while (i < previousElements.length) {
                    previousElements[i].isActiveForRepeat = false;
                    ++i;
                  }
                  currentElementBuffer = previousElements.splice(collection.length, previousElements.length - collection.length).concat(previousElementBuffer);
                  currentElements = previousElements;
                } else {
                  currentElements = previousElements;
                  currentElementBuffer = previousElementBuffer;
                }
                if (currentElements.length > 0) {
                  firstIndexToFix = currentElements.length - 1;
                  lastIndexToFix = currentElements.length - 1;
                  if (originalPreviousElementsLength < currentElements.length) {
                    firstIndexToFix = originalPreviousElementsLength;
                  }
                  if (firstIndexToFix > 0) {
                    firstIndexToFix = firstIndexToFix - 1;
                  }
                  i = firstIndexToFix;
                  while (i <= lastIndexToFix) {
                    currentElements[i].scope.$last = i === (currentElements.length - 1);
                    currentElements[i].scope.$middle = (i !== 0) && (i !== (currentElements.length - 1));
                    if (!currentElements[i].isActiveForRepeat) {
                      currentElements[i].isActiveForRepeat = true;
                      currentElements[i].element.css("display", "");
                    }
                    ++i;
                  }
                }
                i = 0;
                while (i < currentElementBuffer.length) {
                  if (currentElementBuffer[i].isActiveForRepeat) {
                    break;
                  }
                  currentElementBuffer[i].element.css("display", "none");
                  ++i;
                }
                i = 0;
                while (i < currentElements.length) {
                  currentElements[i].scope[iterVar] = collection[i];
                  ++i;
                }
                prevElement = $element;
                if (previousElements.length > 0) {
                  prevElement = previousElements[previousElements.length - 1].element;
                }
                i = 0;
                while (i < newElements.length) {
                  linker(newElements[i].scope, function(clone) {
                    $animate.enter(clone, null, prevElement);
                    prevElement = clone;
                    return newElements[i].element = clone;
                  });
                  ++i;
                }
                previousElements = currentElements;
                return previousElementBuffer = currentElementBuffer;
              });
              return $scope.$on("$destroy", function() {
                return deregisterCallback();
              });
            };
          }
        };
      }
    ]);
  });

}).call(this);
