require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"myModule":[function(require,module,exports){
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


},{}],"toggleButton":[function(require,module,exports){
var createHighlight, defaults;

defaults = {
  highlightColor: "#F50057"
};

exports.makeToggleable = function(layer, highlightColor) {
  var contents, contentsActive, highlight;
  if (highlightColor == null) {
    highlightColor = defaults.highlightColor;
  }
  if (layer.childrenWithName("highlight").length === 0) {
    highlight = createHighlight(layer, highlightColor, 0);
  }
  contentsActive = layer.childrenWithName("contentsActive")[0];
  contents = layer.childrenWithName("contents")[0];
  contentsActive.opacity = 0;
  contents.opacity = 1;
  layer.clip = true;
  return layer.toggleState = false;
};

exports.toggle = function(layer) {
  if (layer.toggleState) {
    return exports.deactivateButton(layer);
  } else {
    return exports.activateButton(layer);
  }
};

exports.activateButton = function(layer) {
  var contents, contentsActive, highlight;
  highlight = layer.childrenWithName("highlight")[0];
  contentsActive = layer.childrenWithName("contentsActive")[0];
  contents = layer.childrenWithName("contents")[0];
  highlight.animate({
    properties: {
      opacity: 1
    },
    time: 0.3
  });
  contentsActive.animate({
    properties: {
      opacity: 1
    },
    time: 0.3
  });
  contents.animate({
    properties: {
      opacity: 0
    },
    time: 0.3
  });
  return layer.toggleState = true;
};

exports.deactivateButton = function(layer) {
  var contents, contentsActive, highlight;
  highlight = layer.childrenWithName("highlight")[0];
  contentsActive = layer.childrenWithName("contentsActive")[0];
  contents = layer.childrenWithName("contents")[0];
  highlight.animate({
    properties: {
      opacity: 0
    },
    time: 0.3
  });
  contentsActive.animate({
    properties: {
      opacity: 0
    },
    time: 0.3
  });
  contents.animate({
    properties: {
      opacity: 1
    },
    time: 0.3
  });
  return layer.toggleState = false;
};

createHighlight = function(layer, highlightColor, border) {
  var highlight;
  highlight = new Layer({
    x: 0,
    y: 0,
    width: layer.width,
    height: layer.width,
    borderRadius: layer.borderRadius,
    backgroundColor: highlightColor,
    name: "highlight",
    opacity: 0
  });
  layer.addChild(highlight);
  highlight.center();
  highlight.sendToBack();
  return highlight;
};


},{}]},{},[])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMveWFzaW4vU2l0ZXMvRnJhbWVyIE1vZHVsZXMvdG9nZ2xlQnV0dG9uLmZyYW1lci9tb2R1bGVzL215TW9kdWxlLmNvZmZlZSIsIi9Vc2Vycy95YXNpbi9TaXRlcy9GcmFtZXIgTW9kdWxlcy90b2dnbGVCdXR0b24uZnJhbWVyL21vZHVsZXMvcmlwcGxlQnV0dG9uLmNvZmZlZSIsIi9Vc2Vycy95YXNpbi9TaXRlcy9GcmFtZXIgTW9kdWxlcy90b2dnbGVCdXR0b24uZnJhbWVyL21vZHVsZXMvdG9nZ2xlQnV0dG9uLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0lBLE9BQU8sQ0FBQyxLQUFSLEdBQWdCOztBQUVoQixPQUFPLENBQUMsVUFBUixHQUFxQixTQUFBO1NBQ3BCLEtBQUEsQ0FBTSx1QkFBTjtBQURvQjs7QUFHckIsT0FBTyxDQUFDLE9BQVIsR0FBa0IsQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVA7Ozs7QUNUbEIsSUFBQTs7QUFBQSxRQUFBLEdBQ0M7RUFBQSxLQUFBLEVBQU8saUJBQVA7RUFDQSxXQUFBLEVBQWEsaUJBRGI7RUFFQSxVQUFBLEVBQVksRUFGWjtFQUdBLFVBQUEsRUFBWSxHQUhaO0VBSUEsUUFBQSxFQUFVLEdBSlY7OztBQU1ELE9BQU8sQ0FBQyxXQUFSLEdBQXNCLFNBQUMsS0FBRCxFQUF5QixXQUF6QixFQUE2RCxVQUE3RCxFQUErRixVQUEvRixFQUFpSSxRQUFqSTs7SUFBQyxRQUFRLFFBQVEsQ0FBQzs7O0lBQU8sY0FBYyxRQUFRLENBQUM7OztJQUFhLGFBQWEsUUFBUSxDQUFDOzs7SUFBWSxhQUFhLFFBQVEsQ0FBQzs7O0lBQVksV0FBVyxRQUFRLENBQUM7O1NBQzFLLFFBQUEsR0FDQztJQUFBLEtBQUEsRUFBTyxLQUFQO0lBQ0EsV0FBQSxFQUFhLFdBRGI7SUFFQSxVQUFBLEVBQVksVUFGWjtJQUdBLFVBQUEsRUFBWSxVQUhaO0lBSUEsUUFBQSxFQUFVLFFBSlY7O0FBRm9COztBQVN0QixPQUFPLENBQUMsU0FBUixHQUFvQixTQUFDLEtBQUQsRUFBUSxLQUFSLEVBQWdDLFdBQWhDLEVBQW9FLFVBQXBFOztJQUFRLFFBQVEsUUFBUSxDQUFDOzs7SUFBTyxjQUFjLFFBQVEsQ0FBQzs7O0lBQWEsYUFBYSxRQUFRLENBQUM7O0VBRTdHLEtBQUssQ0FBQyxVQUFOLEdBQW1CO0VBQ25CLEtBQUssQ0FBQyxXQUFOLEdBQW9CO1NBRXBCLEtBQUssQ0FBQyxLQUFOLENBQVksU0FBQTtBQUNYLFFBQUE7SUFBQSxDQUFBLEdBQUksQ0FBQyxLQUFLLENBQUMsS0FBTixHQUFZLEdBQWIsQ0FBQSxHQUFrQixLQUFLLENBQUM7SUFDNUIsTUFBQSxHQUFhLElBQUEsS0FBQSxDQUNaO01BQUEsQ0FBQSxFQUFHLENBQUg7TUFDQSxDQUFBLEVBQUcsQ0FESDtNQUVBLEtBQUEsRUFBTyxDQUZQO01BR0EsTUFBQSxFQUFRLENBSFI7TUFJQSxZQUFBLEVBQWMsQ0FBQSxHQUFFLENBSmhCO01BS0EsZUFBQSxFQUFpQixLQUxqQjtNQU1BLEtBQUEsRUFBTyxDQU5QO01BT0EsT0FBQSxFQUFTLENBUFQ7S0FEWTtJQVViLEtBQUssQ0FBQyxRQUFOLENBQWUsTUFBZjtJQUNBLEtBQUssQ0FBQyxJQUFOLEdBQWE7SUFDYixNQUFNLENBQUMsTUFBUCxDQUFBO0lBRUEsU0FBQSxHQUFZLE1BQU0sQ0FBQyxPQUFQLENBQ1g7TUFBQSxVQUFBLEVBQ0M7UUFBQSxLQUFBLEVBQU8sQ0FBUDtRQUNBLE9BQUEsRUFBUyxDQURUO09BREQ7TUFHQSxJQUFBLEVBQU0sUUFBUSxDQUFDLFVBSGY7S0FEVztJQU1aLEtBQUssQ0FBQyxPQUFOLENBQ0M7TUFBQSxVQUFBLEVBQ0M7UUFBQSxVQUFBLEVBQVksVUFBWjtPQUREO01BRUEsSUFBQSxFQUFNLFFBQVEsQ0FBQyxVQUZmO0tBREQ7V0FLQSxTQUFTLENBQUMsRUFBVixDQUFhLEtBQWIsRUFBb0IsU0FBQTtBQUNuQixVQUFBO01BQUEsVUFBQSxHQUFhLE1BQU0sQ0FBQyxPQUFQLENBQ1o7UUFBQSxVQUFBLEVBQ0M7VUFBQSxPQUFBLEVBQVMsQ0FBVDtTQUREO1FBRUEsSUFBQSxFQUFNLFFBQVEsQ0FBQyxRQUZmO09BRFk7TUFLYixLQUFLLENBQUMsT0FBTixDQUNDO1FBQUEsVUFBQSxFQUNDO1VBQUEsVUFBQSxFQUFZLENBQVo7U0FERDtRQUVBLElBQUEsRUFBTSxRQUFRLENBQUMsUUFGZjtPQUREO2FBS0EsVUFBVSxDQUFDLEVBQVgsQ0FBYyxLQUFkLEVBQXFCLFNBQUE7ZUFDcEIsTUFBTSxDQUFDLE9BQVAsQ0FBQTtNQURvQixDQUFyQjtJQVhtQixDQUFwQjtFQTNCVyxDQUFaO0FBTG1COzs7O0FDaEJwQixJQUFBOztBQUFBLFFBQUEsR0FDQztFQUFBLGNBQUEsRUFBZ0IsU0FBaEI7OztBQUVELE9BQU8sQ0FBQyxjQUFSLEdBQXlCLFNBQUMsS0FBRCxFQUFTLGNBQVQ7QUFDeEIsTUFBQTs7SUFEaUMsaUJBQWlCLFFBQVEsQ0FBQzs7RUFDM0QsSUFBRyxLQUFLLENBQUMsZ0JBQU4sQ0FBdUIsV0FBdkIsQ0FBbUMsQ0FBQyxNQUFwQyxLQUE4QyxDQUFqRDtJQUNDLFNBQUEsR0FBWSxlQUFBLENBQWdCLEtBQWhCLEVBQXVCLGNBQXZCLEVBQXVDLENBQXZDLEVBRGI7O0VBR0EsY0FBQSxHQUFpQixLQUFLLENBQUMsZ0JBQU4sQ0FBdUIsZ0JBQXZCLENBQXlDLENBQUEsQ0FBQTtFQUMxRCxRQUFBLEdBQVcsS0FBSyxDQUFDLGdCQUFOLENBQXVCLFVBQXZCLENBQW1DLENBQUEsQ0FBQTtFQUU5QyxjQUFjLENBQUMsT0FBZixHQUF5QjtFQUN6QixRQUFRLENBQUMsT0FBVCxHQUFtQjtFQUVuQixLQUFLLENBQUMsSUFBTixHQUFhO1NBQ2IsS0FBSyxDQUFDLFdBQU4sR0FBb0I7QUFYSTs7QUFjekIsT0FBTyxDQUFDLE1BQVIsR0FBaUIsU0FBQyxLQUFEO0VBQ2hCLElBQUcsS0FBSyxDQUFDLFdBQVQ7V0FDQyxPQUFPLENBQUMsZ0JBQVIsQ0FBeUIsS0FBekIsRUFERDtHQUFBLE1BQUE7V0FHQyxPQUFPLENBQUMsY0FBUixDQUF1QixLQUF2QixFQUhEOztBQURnQjs7QUFPakIsT0FBTyxDQUFDLGNBQVIsR0FBeUIsU0FBQyxLQUFEO0FBQ3hCLE1BQUE7RUFBQSxTQUFBLEdBQVksS0FBSyxDQUFDLGdCQUFOLENBQXVCLFdBQXZCLENBQW9DLENBQUEsQ0FBQTtFQUNoRCxjQUFBLEdBQWlCLEtBQUssQ0FBQyxnQkFBTixDQUF1QixnQkFBdkIsQ0FBeUMsQ0FBQSxDQUFBO0VBQzFELFFBQUEsR0FBVyxLQUFLLENBQUMsZ0JBQU4sQ0FBdUIsVUFBdkIsQ0FBbUMsQ0FBQSxDQUFBO0VBRTlDLFNBQVMsQ0FBQyxPQUFWLENBQ0M7SUFBQSxVQUFBLEVBQ0M7TUFBQSxPQUFBLEVBQVMsQ0FBVDtLQUREO0lBRUEsSUFBQSxFQUFNLEdBRk47R0FERDtFQUtBLGNBQWMsQ0FBQyxPQUFmLENBQ0M7SUFBQSxVQUFBLEVBQ0M7TUFBQSxPQUFBLEVBQVMsQ0FBVDtLQUREO0lBRUEsSUFBQSxFQUFNLEdBRk47R0FERDtFQUtBLFFBQVEsQ0FBQyxPQUFULENBQ0M7SUFBQSxVQUFBLEVBQ0M7TUFBQSxPQUFBLEVBQVMsQ0FBVDtLQUREO0lBRUEsSUFBQSxFQUFNLEdBRk47R0FERDtTQUtBLEtBQUssQ0FBQyxXQUFOLEdBQW9CO0FBcEJJOztBQXdCekIsT0FBTyxDQUFDLGdCQUFSLEdBQTJCLFNBQUMsS0FBRDtBQUMxQixNQUFBO0VBQUEsU0FBQSxHQUFZLEtBQUssQ0FBQyxnQkFBTixDQUF1QixXQUF2QixDQUFvQyxDQUFBLENBQUE7RUFDaEQsY0FBQSxHQUFpQixLQUFLLENBQUMsZ0JBQU4sQ0FBdUIsZ0JBQXZCLENBQXlDLENBQUEsQ0FBQTtFQUMxRCxRQUFBLEdBQVcsS0FBSyxDQUFDLGdCQUFOLENBQXVCLFVBQXZCLENBQW1DLENBQUEsQ0FBQTtFQUU5QyxTQUFTLENBQUMsT0FBVixDQUNDO0lBQUEsVUFBQSxFQUNDO01BQUEsT0FBQSxFQUFTLENBQVQ7S0FERDtJQUVBLElBQUEsRUFBTSxHQUZOO0dBREQ7RUFLQSxjQUFjLENBQUMsT0FBZixDQUNDO0lBQUEsVUFBQSxFQUNDO01BQUEsT0FBQSxFQUFTLENBQVQ7S0FERDtJQUVBLElBQUEsRUFBTSxHQUZOO0dBREQ7RUFLQSxRQUFRLENBQUMsT0FBVCxDQUNDO0lBQUEsVUFBQSxFQUNDO01BQUEsT0FBQSxFQUFTLENBQVQ7S0FERDtJQUVBLElBQUEsRUFBTSxHQUZOO0dBREQ7U0FLQSxLQUFLLENBQUMsV0FBTixHQUFvQjtBQXBCTTs7QUF1QjNCLGVBQUEsR0FBa0IsU0FBQyxLQUFELEVBQVEsY0FBUixFQUF3QixNQUF4QjtBQUNqQixNQUFBO0VBQUEsU0FBQSxHQUFnQixJQUFBLEtBQUEsQ0FDZjtJQUFBLENBQUEsRUFBRyxDQUFIO0lBQ0EsQ0FBQSxFQUFHLENBREg7SUFFQSxLQUFBLEVBQU8sS0FBSyxDQUFDLEtBRmI7SUFHQSxNQUFBLEVBQVEsS0FBSyxDQUFDLEtBSGQ7SUFJQSxZQUFBLEVBQWMsS0FBSyxDQUFDLFlBSnBCO0lBS0EsZUFBQSxFQUFpQixjQUxqQjtJQU1BLElBQUEsRUFBSyxXQU5MO0lBT0EsT0FBQSxFQUFTLENBUFQ7R0FEZTtFQVVoQixLQUFLLENBQUMsUUFBTixDQUFlLFNBQWY7RUFDQSxTQUFTLENBQUMsTUFBVixDQUFBO0VBQ0EsU0FBUyxDQUFDLFVBQVYsQ0FBQTtBQUVBLFNBQU87QUFmVSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIjIEFkZCB0aGUgZm9sbG93aW5nIGxpbmUgdG8geW91ciBwcm9qZWN0IGluIEZyYW1lciBTdHVkaW8uIFxuIyBteU1vZHVsZSA9IHJlcXVpcmUgXCJteU1vZHVsZVwiXG4jIFJlZmVyZW5jZSB0aGUgY29udGVudHMgYnkgbmFtZSwgbGlrZSBteU1vZHVsZS5teUZ1bmN0aW9uKCkgb3IgbXlNb2R1bGUubXlWYXJcblxuZXhwb3J0cy5teVZhciA9IFwibXlWYXJpYWJsZVwiXG5cbmV4cG9ydHMubXlGdW5jdGlvbiA9IC0+XG5cdHByaW50IFwibXlGdW5jdGlvbiBpcyBydW5uaW5nXCJcblxuZXhwb3J0cy5teUFycmF5ID0gWzEsIDIsIDNdIiwiZGVmYXVsdHMgPSBcblx0Y29sb3I6IFwicmdiYSgwLDAsMCwwLjEpXCJcblx0c2hhZG93Q29sb3I6IFwicmdiYSgwLDAsMCwwLjMpXCJcblx0c2hhZG93Qmx1cjogMzBcblx0cmlwcGxlVGltZTogMC4zXG5cdGZhZGVUaW1lOiAwLjZcblxuZXhwb3J0cy5zZXREZWZhdWx0cyA9IChjb2xvciA9IGRlZmF1bHRzLmNvbG9yLCBzaGFkb3dDb2xvciA9IGRlZmF1bHRzLnNoYWRvd0NvbG9yLCBzaGFkb3dCbHVyID0gZGVmYXVsdHMuc2hhZG93Qmx1ciwgcmlwcGxlVGltZSA9IGRlZmF1bHRzLnJpcHBsZVRpbWUsIGZhZGVUaW1lID0gZGVmYXVsdHMuZmFkZVRpbWUpIC0+XG5cdGRlZmF1bHRzID0gXG5cdFx0Y29sb3I6IGNvbG9yXG5cdFx0c2hhZG93Q29sb3I6IHNoYWRvd0NvbG9yXG5cdFx0c2hhZG93Qmx1cjogc2hhZG93Qmx1clxuXHRcdHJpcHBsZVRpbWU6IHJpcHBsZVRpbWVcblx0XHRmYWRlVGltZTogZmFkZVRpbWVcblxuXG5leHBvcnRzLmFkZFJpcHBsZSA9IChsYXllciwgY29sb3IgPSBkZWZhdWx0cy5jb2xvciwgc2hhZG93Q29sb3IgPSBkZWZhdWx0cy5zaGFkb3dDb2xvciwgc2hhZG93Qmx1ciA9IGRlZmF1bHRzLnNoYWRvd0JsdXIpIC0+XG5cblx0bGF5ZXIuc2hhZG93Qmx1ciA9IDBcblx0bGF5ZXIuc2hhZG93Q29sb3IgPSBzaGFkb3dDb2xvclxuXG5cdGxheWVyLm9uVGFwIC0+XG5cdFx0cyA9IChsYXllci53aWR0aCoxLjUpLWxheWVyLmJvcmRlclJhZGl1c1xuXHRcdHJpcHBsZSA9IG5ldyBMYXllclxuXHRcdFx0eDogMFxuXHRcdFx0eTogMFxuXHRcdFx0d2lkdGg6IHNcblx0XHRcdGhlaWdodDogc1xuXHRcdFx0Ym9yZGVyUmFkaXVzOiBzLzJcblx0XHRcdGJhY2tncm91bmRDb2xvcjogY29sb3Jcblx0XHRcdHNjYWxlOiAwXG5cdFx0XHRvcGFjaXR5OiAwXG5cblx0XHRsYXllci5hZGRDaGlsZChyaXBwbGUpXG5cdFx0bGF5ZXIuY2xpcCA9IHRydWVcblx0XHRyaXBwbGUuY2VudGVyKClcblxuXHRcdHJpcHBsZU91dCA9IHJpcHBsZS5hbmltYXRlXG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRzY2FsZTogMSxcblx0XHRcdFx0b3BhY2l0eTogMSxcblx0XHRcdHRpbWU6IGRlZmF1bHRzLnJpcHBsZVRpbWVcblxuXHRcdGxheWVyLmFuaW1hdGUgXG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRzaGFkb3dCbHVyOiBzaGFkb3dCbHVyXG5cdFx0XHR0aW1lOiBkZWZhdWx0cy5yaXBwbGVUaW1lXG5cblx0XHRyaXBwbGVPdXQub24gXCJlbmRcIiwgLT5cblx0XHRcdHJpcHBsZUZhZGUgPSByaXBwbGUuYW5pbWF0ZVxuXHRcdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRcdG9wYWNpdHk6IDAsXG5cdFx0XHRcdHRpbWU6IGRlZmF1bHRzLmZhZGVUaW1lXG5cblx0XHRcdGxheWVyLmFuaW1hdGUgXG5cdFx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdFx0c2hhZG93Qmx1cjogMFxuXHRcdFx0XHR0aW1lOiBkZWZhdWx0cy5mYWRlVGltZVxuXG5cdFx0XHRyaXBwbGVGYWRlLm9uIFwiZW5kXCIsIC0+XG5cdFx0XHRcdHJpcHBsZS5kZXN0cm95KClcblxuXG5cbiIsImRlZmF1bHRzID0gXG5cdGhpZ2hsaWdodENvbG9yOiBcIiNGNTAwNTdcIlxuXG5leHBvcnRzLm1ha2VUb2dnbGVhYmxlID0gKGxheWVyLCAgaGlnaGxpZ2h0Q29sb3IgPSBkZWZhdWx0cy5oaWdobGlnaHRDb2xvcikgLT5cblx0aWYgbGF5ZXIuY2hpbGRyZW5XaXRoTmFtZShcImhpZ2hsaWdodFwiKS5sZW5ndGggPT0gMFxuXHRcdGhpZ2hsaWdodCA9IGNyZWF0ZUhpZ2hsaWdodChsYXllciwgaGlnaGxpZ2h0Q29sb3IsIDApXG5cdFxuXHRjb250ZW50c0FjdGl2ZSA9IGxheWVyLmNoaWxkcmVuV2l0aE5hbWUoXCJjb250ZW50c0FjdGl2ZVwiKVswXVxuXHRjb250ZW50cyA9IGxheWVyLmNoaWxkcmVuV2l0aE5hbWUoXCJjb250ZW50c1wiKVswXVxuXG5cdGNvbnRlbnRzQWN0aXZlLm9wYWNpdHkgPSAwO1xuXHRjb250ZW50cy5vcGFjaXR5ID0gMTtcblxuXHRsYXllci5jbGlwID0gdHJ1ZVxuXHRsYXllci50b2dnbGVTdGF0ZSA9IGZhbHNlO1xuXG5cbmV4cG9ydHMudG9nZ2xlID0gKGxheWVyKSAtPlxuXHRpZiBsYXllci50b2dnbGVTdGF0ZVxuXHRcdGV4cG9ydHMuZGVhY3RpdmF0ZUJ1dHRvbihsYXllcilcblx0ZWxzZVxuXHRcdGV4cG9ydHMuYWN0aXZhdGVCdXR0b24obGF5ZXIpXG5cblxuZXhwb3J0cy5hY3RpdmF0ZUJ1dHRvbiA9IChsYXllcikgLT5cblx0aGlnaGxpZ2h0ID0gbGF5ZXIuY2hpbGRyZW5XaXRoTmFtZShcImhpZ2hsaWdodFwiKVswXVxuXHRjb250ZW50c0FjdGl2ZSA9IGxheWVyLmNoaWxkcmVuV2l0aE5hbWUoXCJjb250ZW50c0FjdGl2ZVwiKVswXVxuXHRjb250ZW50cyA9IGxheWVyLmNoaWxkcmVuV2l0aE5hbWUoXCJjb250ZW50c1wiKVswXVxuXHRcblx0aGlnaGxpZ2h0LmFuaW1hdGVcblx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0b3BhY2l0eTogMVxuXHRcdHRpbWU6IDAuM1xuXHRcdFxuXHRjb250ZW50c0FjdGl2ZS5hbmltYXRlXG5cdFx0cHJvcGVydGllczpcblx0XHRcdG9wYWNpdHk6IDFcblx0XHR0aW1lOiAwLjNcblxuXHRjb250ZW50cy5hbmltYXRlXG5cdFx0cHJvcGVydGllczpcblx0XHRcdG9wYWNpdHk6IDBcblx0XHR0aW1lOiAwLjNcblxuXHRsYXllci50b2dnbGVTdGF0ZSA9IHRydWVcblxuXHRcdFxuXG5leHBvcnRzLmRlYWN0aXZhdGVCdXR0b24gPSAobGF5ZXIpIC0+XG5cdGhpZ2hsaWdodCA9IGxheWVyLmNoaWxkcmVuV2l0aE5hbWUoXCJoaWdobGlnaHRcIilbMF1cblx0Y29udGVudHNBY3RpdmUgPSBsYXllci5jaGlsZHJlbldpdGhOYW1lKFwiY29udGVudHNBY3RpdmVcIilbMF1cblx0Y29udGVudHMgPSBsYXllci5jaGlsZHJlbldpdGhOYW1lKFwiY29udGVudHNcIilbMF1cblx0XG5cdGhpZ2hsaWdodC5hbmltYXRlXG5cdFx0cHJvcGVydGllczpcblx0XHRcdG9wYWNpdHk6IDBcblx0XHR0aW1lOiAwLjNcblx0XHRcblx0Y29udGVudHNBY3RpdmUuYW5pbWF0ZVxuXHRcdHByb3BlcnRpZXM6XG5cdFx0XHRvcGFjaXR5OiAwXG5cdFx0dGltZTogMC4zXG5cblx0Y29udGVudHMuYW5pbWF0ZVxuXHRcdHByb3BlcnRpZXM6XG5cdFx0XHRvcGFjaXR5OiAxXG5cdFx0dGltZTogMC4zXG5cblx0bGF5ZXIudG9nZ2xlU3RhdGUgPSBmYWxzZVxuXG5cbmNyZWF0ZUhpZ2hsaWdodCA9IChsYXllciwgaGlnaGxpZ2h0Q29sb3IsIGJvcmRlcikgLT5cblx0aGlnaGxpZ2h0ID0gbmV3IExheWVyXG5cdFx0eDogMFxuXHRcdHk6IDBcblx0XHR3aWR0aDogbGF5ZXIud2lkdGhcblx0XHRoZWlnaHQ6IGxheWVyLndpZHRoXG5cdFx0Ym9yZGVyUmFkaXVzOiBsYXllci5ib3JkZXJSYWRpdXNcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IGhpZ2hsaWdodENvbG9yXG5cdFx0bmFtZTpcImhpZ2hsaWdodFwiXG5cdFx0b3BhY2l0eTogMFxuXHRcdFxuXHRsYXllci5hZGRDaGlsZChoaWdobGlnaHQpO1xuXHRoaWdobGlnaHQuY2VudGVyKClcblx0aGlnaGxpZ2h0LnNlbmRUb0JhY2soKTtcblx0XG5cdHJldHVybiBoaWdobGlnaHQiXX0=
