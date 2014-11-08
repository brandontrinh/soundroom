define ['./module'], (directives) ->
  directives.directive 'slyRepeat', ['$animate', '$parse', ($animate, $parse) ->


    ###
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
    ###

    ###
    Sets the scope contained in elementScope to gate all its
    watchers based on the isActiveForRepeat proprety.
    
    @param {Object} elementScope The object containing the
    scope and isActiveForRepeat properties.
    ###

    gateWatchersForScope = (elementScope) ->
      elementScope.scope.$addWatcherGate ->
        elementScope.isActiveForRepeat

    restrict: "A"
    scope: true
    transclude: "element"
    priority: 1000
    terminal: true
    compile: (element, attr, linker) ->
      
      # Most of the work is done in the post-link function.
      ($scope, $element, $attr) ->
        
        # This code is largely based on ngRepeat.
        
        # Parse the expression.  It should look like:
        # x in some-expression
        expression = $attr.slyRepeat
        match = expression.match(/^\s*(.+)\s+in\s+(.*?)$/)
        throw Error("Expected slyRepeat in form of '_item_ in _collection_' but got '" + expression + "'.")  unless match
        iterVar = match[1]
        collectionExpr = match[2]
        match = iterVar.match(/^(?:([\$\w]+))$/)
        throw Error("'item' in 'item in collection' should be identifier but got '" + lhs + "'.")  unless match
        
        # previousElements will store references to the already existing (DOM) elements
        # that were last used for the last rendering of this repeat and were visible.
        # We will re-use these elements when executing the next rendering of the repeat when
        # the iteration value changes.
        previousElements = []
        
        # previousElementsBuffer will store references to the already existing (DOM) elements
        # that are in the page but were not used for the last rendering of this repeat and were
        # therefore marked as inactive and not visible.  This happens if the length of the repeat
        # iteration goes down over time, since we do not remove the elements.  If the repeat length
        # was first 10, then 5, we will end up with the last 5 elements in the previousElementBuffer.
        # We keep this in case the length increases again.
        previousElementBuffer = []
        deregisterCallback = $scope.$watchCollection(collectionExpr, (collection) ->
          # throw Error("'collection' did not evaluate to an array.  expression was " + collectionExpr) unless k$.isArray(collection)
          originalPreviousElementsLength = previousElements.length
          
          # First, reconcile previousElements and collection with respect to the previousElementBuffer.
          # Basically, try to grow previousElements to collection.length if we can.
          if (previousElements.length < collection.length) and (previousElementBuffer.length > 0)
            limit = previousElements.length + previousElementBuffer.length
            limit = collection.length  if limit > collection.length
            previousElements = previousElements.concat(previousElementBuffer.splice(0, limit - previousElements.length))
          currentElements = null
          currentElementBuffer = []
          newElements = []
          if collection.length > previousElements.length
            
            # Add in enough elements to account for the larger collection.
            i = previousElements.length

            while i < collection.length
              
              # Need to add in an element for each new item in the collection.
              newElement =
                scope: $scope.$new()
                isActiveForRepeat: true

              gateWatchersForScope newElement
              newElement.scope.$index = i
              newElement.scope.$first = (i is 0)
              newElements.push newElement
              ++i
            currentElements = previousElements.concat(newElements)
            currentElementBuffer = previousElementBuffer
          else if collection.length < previousElements.length
            i = collection.length

            while i < previousElements.length
              previousElements[i].isActiveForRepeat = false
              ++i
            currentElementBuffer = previousElements.splice(collection.length, previousElements.length - collection.length).concat(previousElementBuffer)
            currentElements = previousElements
          else
            currentElements = previousElements
            currentElementBuffer = previousElementBuffer
          
          # We have to fix up the last and middle values in the scope for each element in
          # currentElements, since their roles may have changed with the new length.
          # We always have to fix the last element.
          if currentElements.length > 0
            firstIndexToFix = currentElements.length - 1
            lastIndexToFix = currentElements.length - 1
            
            # We also have to fix any new elements that were added.
            firstIndexToFix = originalPreviousElementsLength  if originalPreviousElementsLength < currentElements.length
            
            # And we usually have to fix the element before the first element we modified
            # in case it used to be last.
            firstIndexToFix = firstIndexToFix - 1  if firstIndexToFix > 0
            i = firstIndexToFix

            while i <= lastIndexToFix
              currentElements[i].scope.$last = (i is (currentElements.length - 1))
              currentElements[i].scope.$middle = ((i isnt 0) and (i isnt (currentElements.length - 1)))
              unless currentElements[i].isActiveForRepeat
                
                # If it is not marked as active, make it active.  This is also indicates that
                # the element is currently hidden, so we have to unhide it.
                currentElements[i].isActiveForRepeat = true
                currentElements[i].element.css "display", ""
              ++i
          
          # Hide all elements that have recently become inactive.
          i = 0

          while i < currentElementBuffer.length
            break  if currentElementBuffer[i].isActiveForRepeat
            currentElementBuffer[i].element.css "display", "none"
            ++i
          
          # Assign the new value for the iter variable for each scope.
          i = 0

          while i < currentElements.length
            currentElements[i].scope[iterVar] = collection[i]
            ++i
          
          # We have to go back now and clone the DOM element for any new elements we
          # added and link them in.  We clone the last DOM element we had created already
          # for this Repeat.
          prevElement = $element
          prevElement = previousElements[previousElements.length - 1].element  if previousElements.length > 0
          i = 0

          while i < newElements.length
            linker newElements[i].scope, (clone) ->
              $animate.enter clone, null, prevElement
              prevElement = clone
              newElements[i].element = clone

            ++i
          previousElements = currentElements
          previousElementBuffer = currentElementBuffer
        )
        $scope.$on "$destroy", ->
          deregisterCallback()
  ]