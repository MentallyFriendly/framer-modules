require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"coordinatorLayout":[function(require,module,exports){
var lastY;

exports.coordinatorLayout = null;

exports.scrollview = null;

exports.scrollDirection = {
  UP: "up",
  DOWN: "down"
};

exports.scrollBehaviour = {
  AWAY: 0,
  RETURN: 1
};

lastY = 0;

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
    var deltaY, i, item, len, ref, scrollY;
    scrollY = Math.max(Math.min(scrollview.scrollY, scrollview.content.height - scrollview.height), 0);
    deltaY = scrollY - lastY;
    ref = coordinatorLayout.scrollingChildren;
    for (i = 0, len = ref.length; i < len; i++) {
      item = ref[i];
      if (item.scrollDirection === exports.scrollDirection.UP && item.scrollBehaviour === exports.scrollBehaviour.RETURN) {
        item.y = Math.min(Math.max(item.y - deltaY, item.stickyPoint), Math.max(-scrollY + item.startY, item.returnY));
      } else if (item.scrollDirection === exports.scrollDirection.UP && item.scrollBehaviour === exports.scrollBehaviour.AWAY) {
        item.y = Math.max(-scrollY + item.startY, item.stickyPoint);
      } else if (item.scrollDirection === exports.scrollDirection.DOWN && item.scrollBehaviour === exports.scrollBehaviour.RETURN) {
        item.y = Math.max(Math.min(item.y + deltaY, item.stickyPoint), Math.min(scrollY + item.startY, item.returnY));
      } else if (item.scrollDirection === exports.scrollDirection.DOWN && item.scrollBehaviour === exports.scrollBehaviour.AWAY) {
        item.y = Math.min(scrollY + item.startY, item.stickyPoint);
      }
    }
    return lastY = scrollY;
  });
  exports.coordinatorLayout = coordinatorLayout;
  return exports.scrollview = scrollview;
};

exports.addScrollingChild = function(item, direction, stickyPoint, scrollBehaviour, returnY) {
  if (direction == null) {
    direction = exports.scrollDirection.UP;
  }
  if (stickyPoint == null) {
    stickyPoint = item.height * -1;
  }
  if (scrollBehaviour == null) {
    scrollBehaviour = exports.scrollBehaviour.AWAY;
  }
  if (returnY == null) {
    returnY = 0;
  }
  item.scrollDirection = direction;
  item.stickyPoint = stickyPoint;
  item.scrollBehaviour = scrollBehaviour;
  item.startY = item.y;
  item.returnY = returnY;
  exports.coordinatorLayout.scrollingChildren.push(item);
  return exports.coordinatorLayout.addChild(item);
};


},{}],"myModule":[function(require,module,exports){
exports.myVar = "myVariable";

exports.myFunction = function() {
  return print("myFunction is running");
};

exports.myArray = [1, 2, 3];


},{}],"rippleButton":[function(require,module,exports){
var defaults;

defaults = {
  color: "rgba(0,0,0,0.1)",
  shadowColor: "rgba(0,0,0,0.3)",
  shadowBlur: 30,
  rippleTime: 0.3,
  fadeTime: 0.6
};

exports.setDefaults = function(color, shadowColor, shadowBlur, rippleTime, fadeTime) {
  if (color == null) {
    color = defaults.color;
  }
  if (shadowColor == null) {
    shadowColor = defaults.shadowColor;
  }
  if (shadowBlur == null) {
    shadowBlur = defaults.shadowBlur;
  }
  if (rippleTime == null) {
    rippleTime = defaults.rippleTime;
  }
  if (fadeTime == null) {
    fadeTime = defaults.fadeTime;
  }
  return defaults = {
    color: color,
    shadowColor: shadowColor,
    shadowBlur: shadowBlur,
    rippleTime: rippleTime,
    fadeTime: fadeTime
  };
};

exports.addRipple = function(layer, color, shadowColor, shadowBlur) {
  if (color == null) {
    color = defaults.color;
  }
  if (shadowColor == null) {
    shadowColor = defaults.shadowColor;
  }
  if (shadowBlur == null) {
    shadowBlur = defaults.shadowBlur;
  }
  layer.shadowBlur = 0;
  layer.shadowColor = shadowColor;
  return layer.onTap(function() {
    var ripple, rippleOut, s;
    s = (layer.width * 1.5) - layer.borderRadius;
    ripple = new Layer({
      x: 0,
      y: 0,
      width: s,
      height: s,
      borderRadius: s / 2,
      backgroundColor: color,
      scale: 0,
      opacity: 0
    });
    layer.addChild(ripple);
    layer.clip = true;
    ripple.center();
    rippleOut = ripple.animate({
      properties: {
        scale: 1,
        opacity: 1
      },
      time: defaults.rippleTime
    });
    layer.animate({
      properties: {
        shadowBlur: shadowBlur
      },
      time: defaults.rippleTime
    });
    return rippleOut.on("end", function() {
      var rippleFade;
      rippleFade = ripple.animate({
        properties: {
          opacity: 0
        },
        time: defaults.fadeTime
      });
      layer.animate({
        properties: {
          shadowBlur: 0
        },
        time: defaults.fadeTime
      });
      return rippleFade.on("end", function() {
        return ripple.destroy();
      });
    });
  });
};


},{}]},{},[])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMveWFzaW4vU2l0ZXMvRnJhbWVyIE1vZHVsZXMvY29vcmRpbmF0b3JMYXlvdXQuZnJhbWVyL21vZHVsZXMvY29vcmRpbmF0b3JMYXlvdXQuY29mZmVlIiwiL1VzZXJzL3lhc2luL1NpdGVzL0ZyYW1lciBNb2R1bGVzL2Nvb3JkaW5hdG9yTGF5b3V0LmZyYW1lci9tb2R1bGVzL215TW9kdWxlLmNvZmZlZSIsIi9Vc2Vycy95YXNpbi9TaXRlcy9GcmFtZXIgTW9kdWxlcy9jb29yZGluYXRvckxheW91dC5mcmFtZXIvbW9kdWxlcy9yaXBwbGVCdXR0b24uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDTUEsSUFBQTs7QUFBQSxPQUFPLENBQUMsaUJBQVIsR0FBNEI7O0FBQzVCLE9BQU8sQ0FBQyxVQUFSLEdBQXFCOztBQUVyQixPQUFPLENBQUMsZUFBUixHQUNDO0VBQUEsRUFBQSxFQUFJLElBQUo7RUFDQSxJQUFBLEVBQU0sTUFETjs7O0FBR0QsT0FBTyxDQUFDLGVBQVIsR0FDQztFQUFBLElBQUEsRUFBTSxDQUFOO0VBQ0EsTUFBQSxFQUFRLENBRFI7OztBQUtELEtBQUEsR0FBUTs7QUFFUixPQUFPLENBQUMsSUFBUixHQUFlLFNBQUE7QUFDZCxNQUFBO0VBQUEsaUJBQUEsR0FBd0IsSUFBQSxLQUFBLENBQ3ZCO0lBQUEsS0FBQSxFQUFPLE1BQU0sQ0FBQyxLQUFkO0lBQ0EsTUFBQSxFQUFRLE1BQU0sQ0FBQyxNQURmO0lBRUEsZUFBQSxFQUFpQixhQUZqQjtJQUdBLElBQUEsRUFBTSxtQkFITjtHQUR1QjtFQU14QixpQkFBaUIsQ0FBQyxpQkFBbEIsR0FBc0M7RUFFdEMsVUFBQSxHQUFpQixJQUFBLGVBQUEsQ0FDaEI7SUFBQSxLQUFBLEVBQU8sTUFBTSxDQUFDLEtBQWQ7SUFDQSxNQUFBLEVBQVEsTUFBTSxDQUFDLE1BRGY7SUFFQSxnQkFBQSxFQUFr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O1FBRUEsSUFBQSxFQUFNLFFBQVEsQ0FBQyxRQUZmO09BREQ7YUFLQSxVQUFVLENBQUMsRUFBWCxDQUFjLEtBQWQsRUFBcUIsU0FBQTtlQUNwQixNQUFNLENBQUMsT0FBUCxDQUFBO01BRG9CLENBQXJCO0lBWG1CLENBQXBCO0VBM0JXLENBQVo7QUFMbUIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiIyBBZGQgdGhlIGZvbGxvd2luZyBsaW5lIHRvIHlvdXIgcHJvamVjdCBpbiBGcmFtZXIgU3R1ZGlvLiBcbiMgbXlNb2R1bGUgPSByZXF1aXJlIFwibXlNb2R1bGVcIlxuIyBSZWZlcmVuY2UgdGhlIGNvbnRlbnRzIGJ5IG5hbWUsIGxpa2UgbXlNb2R1bGUubXlGdW5jdGlvbigpIG9yIG15TW9kdWxlLm15VmFyXG5cblxuXG5leHBvcnRzLmNvb3JkaW5hdG9yTGF5b3V0ID0gbnVsbFxuZXhwb3J0cy5zY3JvbGx2aWV3ID0gbnVsbFxuXG5leHBvcnRzLnNjcm9sbERpcmVjdGlvbiA9IFxuXHRVUDogXCJ1cFwiXG5cdERPV046IFwiZG93blwiXG5cbmV4cG9ydHMuc2Nyb2xsQmVoYXZpb3VyID0gXG5cdEFXQVk6IDBcblx0UkVUVVJOOiAxXG5cblxuXG5sYXN0WSA9IDBcblxuZXhwb3J0cy5tYWtlID0gKCkgLT5cblx0Y29vcmRpbmF0b3JMYXlvdXQgPSBuZXcgTGF5ZXJcblx0XHR3aWR0aDogU2NyZWVuLndpZHRoXG5cdFx0aGVpZ2h0OiBTY3JlZW4uaGVpZ2h0XG5cdFx0YmFja2dyb3VuZENvbG9yOiBcInRyYW5zcGFyZW50XCJcblx0XHRuYW1lOiBcImNvb3JkaW5hdG9yTGF5b3V0XCJcblxuXHRjb29yZGluYXRvckxheW91dC5zY3JvbGxpbmdDaGlsZHJlbiA9IFtdXG5cblx0c2Nyb2xsdmlldyA9IG5ldyBTY3JvbGxDb21wb25lbnRcblx0XHR3aWR0aDogU2NyZWVuLndpZHRoXG5cdFx0aGVpZ2h0OiBTY3JlZW4uaGVpZ2h0XG5cdFx0c2Nyb2xsSG9yaXpvbnRhbDogZmFsc2Vcblx0XHRuYW1lOiBcInNjcm9sbHZpZXdcIlxuXHRcdHBhcmVudDogY29vcmRpbmF0b3JMYXlvdXRcblxuXHRjb29yZGluYXRvckxheW91dC5zY3JvbGx2aWV3ID0gc2Nyb2xsdmlldztcblxuXHRzY3JvbGx2aWV3LmNvbnRlbnQub24gXCJjaGFuZ2U6eVwiLCAtPlxuXHRcdHNjcm9sbFkgPSBNYXRoLm1heChNYXRoLm1pbihzY3JvbGx2aWV3LnNjcm9sbFksIHNjcm9sbHZpZXcuY29udGVudC5oZWlnaHQtc2Nyb2xsdmlldy5oZWlnaHQpLCAwKVxuXHRcdGRlbHRhWSA9IHNjcm9sbFkgLSBsYXN0WTtcblxuXHRcdGZvciBpdGVtIGluIGNvb3JkaW5hdG9yTGF5b3V0LnNjcm9sbGluZ0NoaWxkcmVuXG5cblx0XHRcdGlmIGl0ZW0uc2Nyb2xsRGlyZWN0aW9uID09IGV4cG9ydHMuc2Nyb2xsRGlyZWN0aW9uLlVQICYmIGl0ZW0uc2Nyb2xsQmVoYXZpb3VyID09IGV4cG9ydHMuc2Nyb2xsQmVoYXZpb3VyLlJFVFVSTlxuXHRcdFx0XHRpdGVtLnkgPSBNYXRoLm1pbihNYXRoLm1heChpdGVtLnktZGVsdGFZLCBpdGVtLnN0aWNreVBvaW50KSwgTWF0aC5tYXgoLXNjcm9sbFkraXRlbS5zdGFydFksIGl0ZW0ucmV0dXJuWSkpXG5cblx0XHRcdGVsc2UgaWYgaXRlbS5zY3JvbGxEaXJlY3Rpb24gPT0gZXhwb3J0cy5zY3JvbGxEaXJlY3Rpb24uVVAgJiYgaXRlbS5zY3JvbGxCZWhhdmlvdXIgPT0gZXhwb3J0cy5zY3JvbGxCZWhhdmlvdXIuQVdBWVxuXHRcdFx0XHRpdGVtLnkgPSBNYXRoLm1heCgtc2Nyb2xsWStpdGVtLnN0YXJ0WSwgaXRlbS5zdGlja3lQb2ludClcdFxuXG5cdFx0XHRlbHNlIGlmIGl0ZW0uc2Nyb2xsRGlyZWN0aW9uID09IGV4cG9ydHMuc2Nyb2xsRGlyZWN0aW9uLkRPV04gJiYgaXRlbS5zY3JvbGxCZWhhdmlvdXIgPT0gZXhwb3J0cy5zY3JvbGxCZWhhdmlvdXIuUkVUVVJOXG5cdFx0XHRcdCMgcHJpbnQgTWF0aC5tYXgoc2Nyb2xsWS1pdGVtLnN0YXJ0WSwgaXRlbS5yZXR1cm5ZKSwgc2Nyb2xsWStpdGVtLnN0YXJ0WVxuXHRcdFx0XHRpdGVtLnkgPSBNYXRoLm1heChNYXRoLm1pbihpdGVtLnkrZGVsdGFZLCBpdGVtLnN0aWNreVBvaW50KSwgTWF0aC5taW4oc2Nyb2xsWStpdGVtLnN0YXJ0WSwgaXRlbS5yZXR1cm5ZKSlcdFxuXG5cdFx0XHRlbHNlIGlmIGl0ZW0uc2Nyb2xsRGlyZWN0aW9uID09IGV4cG9ydHMuc2Nyb2xsRGlyZWN0aW9uLkRPV04gJiYgaXRlbS5zY3JvbGxCZWhhdmlvdXIgPT0gZXhwb3J0cy5zY3JvbGxCZWhhdmlvdXIuQVdBWVxuXHRcdFx0XHRpdGVtLnkgPSBNYXRoLm1pbihzY3JvbGxZK2l0ZW0uc3RhcnRZLCBpdGVtLnN0aWNreVBvaW50KVx0XG5cblxuXG5cblx0XHRsYXN0WSA9IHNjcm9sbFlcblxuXG5cblxuXHRleHBvcnRzLmNvb3JkaW5hdG9yTGF5b3V0ID0gY29vcmRpbmF0b3JMYXlvdXRcblx0ZXhwb3J0cy5zY3JvbGx2aWV3ID0gc2Nyb2xsdmlld1xuXG5cbmV4cG9ydHMuYWRkU2Nyb2xsaW5nQ2hpbGQgPSAoaXRlbSwgZGlyZWN0aW9uID0gIGV4cG9ydHMuc2Nyb2xsRGlyZWN0aW9uLlVQLCBzdGlja3lQb2ludCA9IGl0ZW0uaGVpZ2h0Ki0xLCBzY3JvbGxCZWhhdmlvdXIgPSBleHBvcnRzLnNjcm9sbEJlaGF2aW91ci5BV0FZLCByZXR1cm5ZID0gMCkgLT5cblx0aXRlbS5zY3JvbGxEaXJlY3Rpb24gPSBkaXJlY3Rpb25cblx0aXRlbS5zdGlja3lQb2ludCA9IHN0aWNreVBvaW50XG5cdGl0ZW0uc2Nyb2xsQmVoYXZpb3VyID0gc2Nyb2xsQmVoYXZpb3VyXG5cdGl0ZW0uc3RhcnRZID0gaXRlbS55XG5cdGl0ZW0ucmV0dXJuWSA9IHJldHVybllcblx0ZXhwb3J0cy5jb29yZGluYXRvckxheW91dC5zY3JvbGxpbmdDaGlsZHJlbi5wdXNoKGl0ZW0pXG5cdGV4cG9ydHMuY29vcmRpbmF0b3JMYXlvdXQuYWRkQ2hpbGQoaXRlbSlcblxuIiwiIyBBZGQgdGhlIGZvbGxvd2luZyBsaW5lIHRvIHlvdXIgcHJvamVjdCBpbiBGcmFtZXIgU3R1ZGlvLiBcbiMgbXlNb2R1bGUgPSByZXF1aXJlIFwibXlNb2R1bGVcIlxuIyBSZWZlcmVuY2UgdGhlIGNvbnRlbnRzIGJ5IG5hbWUsIGxpa2UgbXlNb2R1bGUubXlGdW5jdGlvbigpIG9yIG15TW9kdWxlLm15VmFyXG5cbmV4cG9ydHMubXlWYXIgPSBcIm15VmFyaWFibGVcIlxuXG5leHBvcnRzLm15RnVuY3Rpb24gPSAtPlxuXHRwcmludCBcIm15RnVuY3Rpb24gaXMgcnVubmluZ1wiXG5cbmV4cG9ydHMubXlBcnJheSA9IFsxLCAyLCAzXSIsImRlZmF1bHRzID0gXG5cdGNvbG9yOiBcInJnYmEoMCwwLDAsMC4xKVwiXG5cdHNoYWRvd0NvbG9yOiBcInJnYmEoMCwwLDAsMC4zKVwiXG5cdHNoYWRvd0JsdXI6IDMwXG5cdHJpcHBsZVRpbWU6IDAuM1xuXHRmYWRlVGltZTogMC42XG5cbmV4cG9ydHMuc2V0RGVmYXVsdHMgPSAoY29sb3IgPSBkZWZhdWx0cy5jb2xvciwgc2hhZG93Q29sb3IgPSBkZWZhdWx0cy5zaGFkb3dDb2xvciwgc2hhZG93Qmx1ciA9IGRlZmF1bHRzLnNoYWRvd0JsdXIsIHJpcHBsZVRpbWUgPSBkZWZhdWx0cy5yaXBwbGVUaW1lLCBmYWRlVGltZSA9IGRlZmF1bHRzLmZhZGVUaW1lKSAtPlxuXHRkZWZhdWx0cyA9IFxuXHRcdGNvbG9yOiBjb2xvclxuXHRcdHNoYWRvd0NvbG9yOiBzaGFkb3dDb2xvclxuXHRcdHNoYWRvd0JsdXI6IHNoYWRvd0JsdXJcblx0XHRyaXBwbGVUaW1lOiByaXBwbGVUaW1lXG5cdFx0ZmFkZVRpbWU6IGZhZGVUaW1lXG5cblxuZXhwb3J0cy5hZGRSaXBwbGUgPSAobGF5ZXIsIGNvbG9yID0gZGVmYXVsdHMuY29sb3IsIHNoYWRvd0NvbG9yID0gZGVmYXVsdHMuc2hhZG93Q29sb3IsIHNoYWRvd0JsdXIgPSBkZWZhdWx0cy5zaGFkb3dCbHVyKSAtPlxuXG5cdGxheWVyLnNoYWRvd0JsdXIgPSAwXG5cdGxheWVyLnNoYWRvd0NvbG9yID0gc2hhZG93Q29sb3JcblxuXHRsYXllci5vblRhcCAtPlxuXHRcdHMgPSAobGF5ZXIud2lkdGgqMS41KS1sYXllci5ib3JkZXJSYWRpdXNcblx0XHRyaXBwbGUgPSBuZXcgTGF5ZXJcblx0XHRcdHg6IDBcblx0XHRcdHk6IDBcblx0XHRcdHdpZHRoOiBzXG5cdFx0XHRoZWlnaHQ6IHNcblx0XHRcdGJvcmRlclJhZGl1czogcy8yXG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IGNvbG9yXG5cdFx0XHRzY2FsZTogMFxuXHRcdFx0b3BhY2l0eTogMFxuXG5cdFx0bGF5ZXIuYWRkQ2hpbGQocmlwcGxlKVxuXHRcdGxheWVyLmNsaXAgPSB0cnVlXG5cdFx0cmlwcGxlLmNlbnRlcigpXG5cblx0XHRyaXBwbGVPdXQgPSByaXBwbGUuYW5pbWF0ZVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0c2NhbGU6IDEsXG5cdFx0XHRcdG9wYWNpdHk6IDEsXG5cdFx0XHR0aW1lOiBkZWZhdWx0cy5yaXBwbGVUaW1lXG5cblx0XHRsYXllci5hbmltYXRlIFxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0c2hhZG93Qmx1cjogc2hhZG93Qmx1clxuXHRcdFx0dGltZTogZGVmYXVsdHMucmlwcGxlVGltZVxuXG5cdFx0cmlwcGxlT3V0Lm9uIFwiZW5kXCIsIC0+XG5cdFx0XHRyaXBwbGVGYWRlID0gcmlwcGxlLmFuaW1hdGVcblx0XHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0XHRvcGFjaXR5OiAwLFxuXHRcdFx0XHR0aW1lOiBkZWZhdWx0cy5mYWRlVGltZVxuXG5cdFx0XHRsYXllci5hbmltYXRlIFxuXHRcdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRcdHNoYWRvd0JsdXI6IDBcblx0XHRcdFx0dGltZTogZGVmYXVsdHMuZmFkZVRpbWVcblxuXHRcdFx0cmlwcGxlRmFkZS5vbiBcImVuZFwiLCAtPlxuXHRcdFx0XHRyaXBwbGUuZGVzdHJveSgpXG5cblxuXG4iXX0=
