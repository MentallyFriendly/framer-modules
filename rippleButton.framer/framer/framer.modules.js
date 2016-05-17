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


},{}]},{},[])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMveWFzaW4vU2l0ZXMvRnJhbWVyIE1vZHVsZXMvcmlwcGxlQnV0dG9uLmZyYW1lci9tb2R1bGVzL215TW9kdWxlLmNvZmZlZSIsIi9Vc2Vycy95YXNpbi9TaXRlcy9GcmFtZXIgTW9kdWxlcy9yaXBwbGVCdXR0b24uZnJhbWVyL21vZHVsZXMvcmlwcGxlQnV0dG9uLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0lBLE9BQU8sQ0FBQyxLQUFSLEdBQWdCOztBQUVoQixPQUFPLENBQUMsVUFBUixHQUFxQixTQUFBO1NBQ3BCLEtBQUEsQ0FBTSx1QkFBTjtBQURvQjs7QUFHckIsT0FBTyxDQUFDLE9BQVIsR0FBa0IsQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVA7Ozs7QUNUbEIsSUFBQTs7QUFBQSxRQUFBLEdBQ0M7RUFBQSxLQUFBLEVBQU8saUJBQVA7RUFDQSxXQUFBLEVBQWEsaUJBRGI7RUFFQSxVQUFBLEVBQVksRUFGWjtFQUdBLFVBQUEsRUFBWSxHQUhaO0VBSUEsUUFBQSxFQUFVLEdBSlY7OztBQU1ELE9BQU8sQ0FBQyxXQUFSLEdBQXNCLFNBQUMsS0FBRCxFQUF5QixXQUF6QixFQUE2RCxVQUE3RCxFQUErRixVQUEvRixFQUFpSSxRQUFqSTs7SUFBQyxRQUFRLFFBQVEsQ0FBQzs7O0lBQU8sY0FBYyxRQUFRLENBQUM7OztJQUFhLGFBQWEsUUFBUSxDQUFDOzs7SUFBWSxhQUFhLFFBQVEsQ0FBQzs7O0lBQVksV0FBVyxRQUFRLENBQUM7O1NBQzFLLFFBQUEsR0FDQztJQUFBLEtBQUEsRUFBTyxLQUFQO0lBQ0EsV0FBQSxFQUFhLFdBRGI7SUFFQSxVQUFBLEVBQVksVUFGWjtJQUdBLFVBQUEsRUFBWSxVQUhaO0lBSUEsUUFBQSxFQUFVLFFBSlY7O0FBRm9COztBQVN0QixPQUFPLENBQUMsU0FBUixHQUFvQixTQUFDLEtBQUQsRUFBUSxLQUFSLEVBQWdDLFdBQWhDLEVBQW9FLFVBQXBFOztJQUFRLFFBQVEsUUFBUSxDQUFDOzs7SUFBTyxjQUFjLFFBQVEsQ0FBQzs7O0lBQWEsYUFBYSxRQUFRLENBQUM7O0VBRTdHLEtBQUssQ0FBQyxVQUFOLEdBQW1CO0VBQ25CLEtBQUssQ0FBQyxXQUFOLEdBQW9CO1NBRXBCLEtBQUssQ0FBQyxLQUFOLENBQVksU0FBQTtBQUNYLFFBQUE7SUFBQSxDQUFBLEdBQUksQ0FBQyxLQUFLLENBQUMsS0FBTixHQUFZLEdBQWIsQ0FBQSxHQUFrQixLQUFLLENBQUM7SUFDNUIsTUFBQSxHQUFhLElBQUEsS0FBQSxDQUNaO01BQUEsQ0FBQSxFQUFHLENBQUg7TUFDQSxDQUFBLEVBQUcsQ0FESDtNQUVBLEtBQUEsRUFBTyxDQUZQO01BR0EsTUFBQSxFQUFRLENBSFI7TUFJQSxZQUFBLEVBQWMsQ0FBQSxHQUFFLENBSmhCO01BS0EsZUFBQSxFQUFpQixLQUxqQjtNQU1BLEtBQUEsRUFBTyxDQU5QO01BT0EsT0FBQSxFQUFTLENBUFQ7S0FEWTtJQVViLEtBQUssQ0FBQyxRQUFOLENBQWUsTUFBZjtJQUNBLEtBQUssQ0FBQyxJQUFOLEdBQWE7SUFDYixNQUFNLENBQUMsTUFBUCxDQUFBO0lBRUEsU0FBQSxHQUFZLE1BQU0sQ0FBQyxPQUFQLENBQ1g7TUFBQSxVQUFBLEVBQ0M7UUFBQSxLQUFBLEVBQU8sQ0FBUDtRQUNBLE9BQUEsRUFBUyxDQURUO09BREQ7TUFHQSxJQUFBLEVBQU0sUUFBUSxDQUFDLFVBSGY7S0FEVztJQU1aLEtBQUssQ0FBQyxPQUFOLENBQ0M7TUFBQSxVQUFBLEVBQ0M7UUFBQSxVQUFBLEVBQVksVUFBWjtPQUREO01BRUEsSUFBQSxFQUFNLFFBQVEsQ0FBQyxVQUZmO0tBREQ7V0FLQSxTQUFTLENBQUMsRUFBVixDQUFhLEtBQWIsRUFBb0IsU0FBQTtBQUNuQixVQUFBO01BQUEsVUFBQSxHQUFhLE1BQU0sQ0FBQyxPQUFQLENBQ1o7UUFBQSxVQUFBLEVBQ0M7VUFBQSxPQUFBLEVBQVMsQ0FBVDtTQUREO1FBRUEsSUFBQSxFQUFNLFFBQVEsQ0FBQyxRQUZmO09BRFk7TUFLYixLQUFLLENBQUMsT0FBTixDQUNDO1FBQUEsVUFBQSxFQUNDO1VBQUEsVUFBQSxFQUFZLENBQVo7U0FERDtRQUVBLElBQUEsRUFBTSxRQUFRLENBQUMsUUFGZjtPQUREO2FBS0EsVUFBVSxDQUFDLEVBQVgsQ0FBYyxLQUFkLEVBQXFCLFNBQUE7ZUFDcEIsTUFBTSxDQUFDLE9BQVAsQ0FBQTtNQURvQixDQUFyQjtJQVhtQixDQUFwQjtFQTNCVyxDQUFaO0FBTG1CIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIiMgQWRkIHRoZSBmb2xsb3dpbmcgbGluZSB0byB5b3VyIHByb2plY3QgaW4gRnJhbWVyIFN0dWRpby4gXG4jIG15TW9kdWxlID0gcmVxdWlyZSBcIm15TW9kdWxlXCJcbiMgUmVmZXJlbmNlIHRoZSBjb250ZW50cyBieSBuYW1lLCBsaWtlIG15TW9kdWxlLm15RnVuY3Rpb24oKSBvciBteU1vZHVsZS5teVZhclxuXG5leHBvcnRzLm15VmFyID0gXCJteVZhcmlhYmxlXCJcblxuZXhwb3J0cy5teUZ1bmN0aW9uID0gLT5cblx0cHJpbnQgXCJteUZ1bmN0aW9uIGlzIHJ1bm5pbmdcIlxuXG5leHBvcnRzLm15QXJyYXkgPSBbMSwgMiwgM10iLCJkZWZhdWx0cyA9IFxuXHRjb2xvcjogXCJyZ2JhKDAsMCwwLDAuMSlcIlxuXHRzaGFkb3dDb2xvcjogXCJyZ2JhKDAsMCwwLDAuMylcIlxuXHRzaGFkb3dCbHVyOiAzMFxuXHRyaXBwbGVUaW1lOiAwLjNcblx0ZmFkZVRpbWU6IDAuNlxuXG5leHBvcnRzLnNldERlZmF1bHRzID0gKGNvbG9yID0gZGVmYXVsdHMuY29sb3IsIHNoYWRvd0NvbG9yID0gZGVmYXVsdHMuc2hhZG93Q29sb3IsIHNoYWRvd0JsdXIgPSBkZWZhdWx0cy5zaGFkb3dCbHVyLCByaXBwbGVUaW1lID0gZGVmYXVsdHMucmlwcGxlVGltZSwgZmFkZVRpbWUgPSBkZWZhdWx0cy5mYWRlVGltZSkgLT5cblx0ZGVmYXVsdHMgPSBcblx0XHRjb2xvcjogY29sb3Jcblx0XHRzaGFkb3dDb2xvcjogc2hhZG93Q29sb3Jcblx0XHRzaGFkb3dCbHVyOiBzaGFkb3dCbHVyXG5cdFx0cmlwcGxlVGltZTogcmlwcGxlVGltZVxuXHRcdGZhZGVUaW1lOiBmYWRlVGltZVxuXG5cbmV4cG9ydHMuYWRkUmlwcGxlID0gKGxheWVyLCBjb2xvciA9IGRlZmF1bHRzLmNvbG9yLCBzaGFkb3dDb2xvciA9IGRlZmF1bHRzLnNoYWRvd0NvbG9yLCBzaGFkb3dCbHVyID0gZGVmYXVsdHMuc2hhZG93Qmx1cikgLT5cblxuXHRsYXllci5zaGFkb3dCbHVyID0gMFxuXHRsYXllci5zaGFkb3dDb2xvciA9IHNoYWRvd0NvbG9yXG5cblx0bGF5ZXIub25UYXAgLT5cblx0XHRzID0gKGxheWVyLndpZHRoKjEuNSktbGF5ZXIuYm9yZGVyUmFkaXVzXG5cdFx0cmlwcGxlID0gbmV3IExheWVyXG5cdFx0XHR4OiAwXG5cdFx0XHR5OiAwXG5cdFx0XHR3aWR0aDogc1xuXHRcdFx0aGVpZ2h0OiBzXG5cdFx0XHRib3JkZXJSYWRpdXM6IHMvMlxuXHRcdFx0YmFja2dyb3VuZENvbG9yOiBjb2xvclxuXHRcdFx0c2NhbGU6IDBcblx0XHRcdG9wYWNpdHk6IDBcblxuXHRcdGxheWVyLmFkZENoaWxkKHJpcHBsZSlcblx0XHRsYXllci5jbGlwID0gdHJ1ZVxuXHRcdHJpcHBsZS5jZW50ZXIoKVxuXG5cdFx0cmlwcGxlT3V0ID0gcmlwcGxlLmFuaW1hdGVcblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdHNjYWxlOiAxLFxuXHRcdFx0XHRvcGFjaXR5OiAxLFxuXHRcdFx0dGltZTogZGVmYXVsdHMucmlwcGxlVGltZVxuXG5cdFx0bGF5ZXIuYW5pbWF0ZSBcblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdHNoYWRvd0JsdXI6IHNoYWRvd0JsdXJcblx0XHRcdHRpbWU6IGRlZmF1bHRzLnJpcHBsZVRpbWVcblxuXHRcdHJpcHBsZU91dC5vbiBcImVuZFwiLCAtPlxuXHRcdFx0cmlwcGxlRmFkZSA9IHJpcHBsZS5hbmltYXRlXG5cdFx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdFx0b3BhY2l0eTogMCxcblx0XHRcdFx0dGltZTogZGVmYXVsdHMuZmFkZVRpbWVcblxuXHRcdFx0bGF5ZXIuYW5pbWF0ZSBcblx0XHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0XHRzaGFkb3dCbHVyOiAwXG5cdFx0XHRcdHRpbWU6IGRlZmF1bHRzLmZhZGVUaW1lXG5cblx0XHRcdHJpcHBsZUZhZGUub24gXCJlbmRcIiwgLT5cblx0XHRcdFx0cmlwcGxlLmRlc3Ryb3koKVxuXG5cblxuIl19
