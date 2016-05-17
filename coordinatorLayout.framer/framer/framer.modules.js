require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"coordinatorLayout":[function(require,module,exports){
exports.coordinatorLayout = null;

exports.scrollview = null;

exports.scrollDirection = {
  UP: 0,
  DOWN: 1
};

exports.make = function() {
  var coordinatorLayout, scrollview;
  coordinatorLayout = new Layer({
    width: Screen.width,
    height: Screen.height,
    backgroundColor: "transparent",
    name: "coordinatorLayout"
  });
  coordinatorLayout.scrollingChildren = [];
  scrollview = new ScrollComponent({
    width: Screen.width,
    height: Screen.height,
    scrollHorizontal: false,
    name: "scrollview",
    parent: coordinatorLayout
  });
  coordinatorLayout.scrollview = scrollview;
  scrollview.content.on("change:y", function() {
    var i, item, len, ref, results, scrollY;
    scrollY = Math.max(Math.min(scrollview.scrollY, scrollview.content.height - scrollview.height), 0);
    ref = coordinatorLayout.scrollingChildren;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      item = ref[i];
      if (item.scrollDirection === exports.scrollDirection.UP) {
        results.push(item.y = Math.max(-scrollY + item.startY, item.stickyPoint));
      } else {
        results.push(void 0);
      }
    }
    return results;
  });
  exports.coordinatorLayout = coordinatorLayout;
  return exports.scrollview = scrollview;
};

exports.addScrollingChild = function(item, direction, stickyPoint) {
  if (direction == null) {
    direction = exports.scrollDirection.UP;
  }
  if (stickyPoint == null) {
    stickyPoint = item.height * -1;
  }
  item.scrollDirection = direction;
  item.stickyPoint = stickyPoint;
  item.startY = item.y;
  exports.coordinatorLayout.scrollingChildren.push(item);
  return exports.coordinatorLayout.addChild(item);
};


},{}],"myModule":[function(require,module,exports){
exports.myVar = "myVariable";

exports.myFunction = function() {
  return print("myFunction is running");
};

exports.myArray = [1, 2, 3];


},{}]},{},[])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMveWFzaW4vU2l0ZXMvRnJhbWVyIE1vZHVsZXMvY29vcmRpbmF0b3JMYXlvdXQuZnJhbWVyL21vZHVsZXMvY29vcmRpbmF0b3JMYXlvdXQuY29mZmVlIiwiL1VzZXJzL3lhc2luL1NpdGVzL0ZyYW1lciBNb2R1bGVzL2Nvb3JkaW5hdG9yTGF5b3V0LmZyYW1lci9tb2R1bGVzL215TW9kdWxlLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ01BLE9BQU8sQ0FBQyxpQkFBUixHQUE0Qjs7QUFDNUIsT0FBTyxDQUFDLFVBQVIsR0FBcUI7O0FBRXJCLE9BQU8sQ0FBQyxlQUFSLEdBQ0M7RUFBQSxFQUFBLEVBQUksQ0FBSjtFQUNBLElBQUEsRUFBTSxDQUROOzs7QUFJRCxPQUFPLENBQUMsSUFBUixHQUFlLFNBQUE7QUFDZCxNQUFBO0VBQUEsaUJBQUEsR0FBd0IsSUFBQSxLQUFBLENBQ3ZCO0lBQUEsS0FBQSxFQUFPLE1BQU0sQ0FBQyxLQUFkO0lBQ0EsTUFBQSxFQUFRLE1BQU0sQ0FBQyxNQURmO0lBRUEsZUFBQSxFQUFpQixhQUZqQjtJQUdBLElBQUEsRUFBTSxtQkFITjtHQUR1QjtFQU14QixpQkFBaUIsQ0FBQyxpQkFBbEIsR0FBc0M7RUFFdEMsVUFBQSxHQUFpQixJQUFBLGVBQUEsQ0FDaEI7SUFBQSxLQUFBLEVBQU8sTUFBTSxDQUFDLEtBQWQ7SUFDQSxNQUFBLEVBQVEsTUFBTSxDQUFDLE1BRGY7SUFFQSxnQkFBQSxFQUFrQixLQUZsQjtJQUdBLElBQUEsRUFBTSxZQUhOO0lBSUEsTUFBQSxFQUFRLGlCQUpSO0dBRGdCO0VBT2pCLGlCQUFpQixDQUFDLFVBQWxCLEdBQStCO0VBRS9CLFVBQVUsQ0FBQyxPQUFPLENBQUMsRUFBbkIsQ0FBc0IsVUFBdEIsRUFBa0MsU0FBQTtBQUNqQyxRQUFBO0lBQUEsT0FBQSxHQUFVLElBQUksQ0FBQyxHQUFMLENBQVMsSUFBSSxDQUFDLEdBQUwsQ0FBUyxVQUFVLENBQUMsT0FBcEIsRUFBNkIsVUFBVSxDQUFDLE9BQU8sQ0FBQyxNQUFuQixHQUEwQixVQUFVLENBQUMsTUFBbEUsQ0FBVCxFQUFvRixDQUFwRjtBQUNWO0FBQUE7U0FBQSxxQ0FBQTs7TUFFQyxJQUFHLElBQUksQ0FBQyxlQUFMLEtBQXdCLE9BQU8sQ0FBQyxlQUFlLENBQUMsRUFBbkQ7cUJBQ0MsSUFBSSxDQUFDLENBQUwsR0FBUyxJQUFJLENBQUMsR0FBTCxDQUFTLENBQUMsT0FBRCxHQUFTLElBQUksQ0FBQyxNQUF2QixFQUErQixJQUFJLENBQUMsV0FBcEMsR0FEVjtPQUFBLE1BQUE7NkJBQUE7O0FBRkQ7O0VBRmlDLENBQWxDO0VBT0EsT0FBTyxDQUFDLGlCQUFSLEdBQTRCO1NBQzVCLE9BQU8sQ0FBQyxVQUFSLEdBQXFCO0FBMUJQOztBQTZCZixPQUFPLENBQUMsaUJBQVIsR0FBNEIsU0FBQyxJQUFELEVBQU8sU0FBUCxFQUFnRCxXQUFoRDs7SUFBTyxZQUFhLE9BQU8sQ0FBQyxlQUFlLENBQUM7OztJQUFJLGNBQWMsSUFBSSxDQUFDLE1BQUwsR0FBWSxDQUFDOztFQUN0RyxJQUFJLENBQUMsZUFBTCxHQUF1QjtFQUN2QixJQUFJLENBQUMsV0FBTCxHQUFtQjtFQUNuQixJQUFJLENBQUMsTUFBTCxHQUFjLElBQUksQ0FBQztFQUNuQixPQUFPLENBQUMsaUJBQWlCLENBQUMsaUJBQWlCLENBQUMsSUFBNUMsQ0FBaUQsSUFBakQ7U0FDQSxPQUFPLENBQUMsaUJBQWlCLENBQUMsUUFBMUIsQ0FBbUMsSUFBbkM7QUFMMkI7Ozs7QUN2QzVCLE9BQU8sQ0FBQyxLQUFSLEdBQWdCOztBQUVoQixPQUFPLENBQUMsVUFBUixHQUFxQixTQUFBO1NBQ3BCLEtBQUEsQ0FBTSx1QkFBTjtBQURvQjs7QUFHckIsT0FBTyxDQUFDLE9BQVIsR0FBa0IsQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVAiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiIyBBZGQgdGhlIGZvbGxvd2luZyBsaW5lIHRvIHlvdXIgcHJvamVjdCBpbiBGcmFtZXIgU3R1ZGlvLiBcbiMgbXlNb2R1bGUgPSByZXF1aXJlIFwibXlNb2R1bGVcIlxuIyBSZWZlcmVuY2UgdGhlIGNvbnRlbnRzIGJ5IG5hbWUsIGxpa2UgbXlNb2R1bGUubXlGdW5jdGlvbigpIG9yIG15TW9kdWxlLm15VmFyXG5cblxuXG5leHBvcnRzLmNvb3JkaW5hdG9yTGF5b3V0ID0gbnVsbFxuZXhwb3J0cy5zY3JvbGx2aWV3ID0gbnVsbFxuXG5leHBvcnRzLnNjcm9sbERpcmVjdGlvbiA9IFxuXHRVUDogMFxuXHRET1dOOiAxXG5cblxuZXhwb3J0cy5tYWtlID0gKCkgLT5cblx0Y29vcmRpbmF0b3JMYXlvdXQgPSBuZXcgTGF5ZXJcblx0XHR3aWR0aDogU2NyZWVuLndpZHRoXG5cdFx0aGVpZ2h0OiBTY3JlZW4uaGVpZ2h0XG5cdFx0YmFja2dyb3VuZENvbG9yOiBcInRyYW5zcGFyZW50XCJcblx0XHRuYW1lOiBcImNvb3JkaW5hdG9yTGF5b3V0XCJcblxuXHRjb29yZGluYXRvckxheW91dC5zY3JvbGxpbmdDaGlsZHJlbiA9IFtdXG5cblx0c2Nyb2xsdmlldyA9IG5ldyBTY3JvbGxDb21wb25lbnRcblx0XHR3aWR0aDogU2NyZWVuLndpZHRoXG5cdFx0aGVpZ2h0OiBTY3JlZW4uaGVpZ2h0XG5cdFx0c2Nyb2xsSG9yaXpvbnRhbDogZmFsc2Vcblx0XHRuYW1lOiBcInNjcm9sbHZpZXdcIlxuXHRcdHBhcmVudDogY29vcmRpbmF0b3JMYXlvdXRcblxuXHRjb29yZGluYXRvckxheW91dC5zY3JvbGx2aWV3ID0gc2Nyb2xsdmlldztcblxuXHRzY3JvbGx2aWV3LmNvbnRlbnQub24gXCJjaGFuZ2U6eVwiLCAtPlxuXHRcdHNjcm9sbFkgPSBNYXRoLm1heChNYXRoLm1pbihzY3JvbGx2aWV3LnNjcm9sbFksIHNjcm9sbHZpZXcuY29udGVudC5oZWlnaHQtc2Nyb2xsdmlldy5oZWlnaHQpLCAwKVxuXHRcdGZvciBpdGVtIGluIGNvb3JkaW5hdG9yTGF5b3V0LnNjcm9sbGluZ0NoaWxkcmVuXG5cblx0XHRcdGlmIGl0ZW0uc2Nyb2xsRGlyZWN0aW9uID09IGV4cG9ydHMuc2Nyb2xsRGlyZWN0aW9uLlVQXG5cdFx0XHRcdGl0ZW0ueSA9IE1hdGgubWF4KC1zY3JvbGxZK2l0ZW0uc3RhcnRZLCBpdGVtLnN0aWNreVBvaW50KVxuXG5cdGV4cG9ydHMuY29vcmRpbmF0b3JMYXlvdXQgPSBjb29yZGluYXRvckxheW91dFxuXHRleHBvcnRzLnNjcm9sbHZpZXcgPSBzY3JvbGx2aWV3XG5cblxuZXhwb3J0cy5hZGRTY3JvbGxpbmdDaGlsZCA9IChpdGVtLCBkaXJlY3Rpb24gPSAgZXhwb3J0cy5zY3JvbGxEaXJlY3Rpb24uVVAsIHN0aWNreVBvaW50ID0gaXRlbS5oZWlnaHQqLTEpIC0+XG5cdGl0ZW0uc2Nyb2xsRGlyZWN0aW9uID0gZGlyZWN0aW9uXG5cdGl0ZW0uc3RpY2t5UG9pbnQgPSBzdGlja3lQb2ludFxuXHRpdGVtLnN0YXJ0WSA9IGl0ZW0ueVxuXHRleHBvcnRzLmNvb3JkaW5hdG9yTGF5b3V0LnNjcm9sbGluZ0NoaWxkcmVuLnB1c2goaXRlbSlcblx0ZXhwb3J0cy5jb29yZGluYXRvckxheW91dC5hZGRDaGlsZChpdGVtKSIsIiMgQWRkIHRoZSBmb2xsb3dpbmcgbGluZSB0byB5b3VyIHByb2plY3QgaW4gRnJhbWVyIFN0dWRpby4gXG4jIG15TW9kdWxlID0gcmVxdWlyZSBcIm15TW9kdWxlXCJcbiMgUmVmZXJlbmNlIHRoZSBjb250ZW50cyBieSBuYW1lLCBsaWtlIG15TW9kdWxlLm15RnVuY3Rpb24oKSBvciBteU1vZHVsZS5teVZhclxuXG5leHBvcnRzLm15VmFyID0gXCJteVZhcmlhYmxlXCJcblxuZXhwb3J0cy5teUZ1bmN0aW9uID0gLT5cblx0cHJpbnQgXCJteUZ1bmN0aW9uIGlzIHJ1bm5pbmdcIlxuXG5leHBvcnRzLm15QXJyYXkgPSBbMSwgMiwgM10iXX0=
