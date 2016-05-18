require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"coordinatorLayout":[function(require,module,exports){
var calculateDefaultStickyY, defaultOpts, isFunction, lastY;

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

defaultOpts = {
  scrollDirection: exports.scrollDirection.UP,
  stickyY: "auto",
  scrollBehaviour: exports.scrollBehaviour.AWAY,
  returnY: 0
};

calculateDefaultStickyY = function(layer, direction) {
  if (direction === exports.scrollDirection.UP) {
    return layer.height * -1;
  } else {
    return exports.coordinatorLayout.height;
  }
};

isFunction = function(obj) {
  return !!(obj && obj.constructor && obj.call && obj.apply);
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
    var deltaY, i, item, lastIsReturned, lastIsStuck, len, ref, scrollY;
    scrollY = Math.max(Math.min(scrollview.scrollY, scrollview.content.height - scrollview.height), 0);
    deltaY = scrollY - lastY;
    ref = coordinatorLayout.scrollingChildren;
    for (i = 0, len = ref.length; i < len; i++) {
      item = ref[i];
      if (item.scrollDirection === exports.scrollDirection.UP && item.scrollBehaviour === exports.scrollBehaviour.RETURN) {
        item.y = Math.min(Math.max(item.y - deltaY, item.stickyY), Math.max(-scrollY + item.startY, item.returnY));
      } else if (item.scrollDirection === exports.scrollDirection.UP && item.scrollBehaviour === exports.scrollBehaviour.AWAY) {
        item.y = Math.max(-scrollY + item.startY, item.stickyY);
      } else if (item.scrollDirection === exports.scrollDirection.DOWN && item.scrollBehaviour === exports.scrollBehaviour.RETURN) {
        item.y = Math.max(Math.min(item.y + deltaY, item.stickyY), Math.min(scrollY + item.startY, item.returnY));
      } else if (item.scrollDirection === exports.scrollDirection.DOWN && item.scrollBehaviour === exports.scrollBehaviour.AWAY) {
        item.y = Math.min(scrollY + item.startY, item.stickyY);
      }
      lastIsStuck = item.isStuck;
      if (item.y === item.stickyY) {
        item.isStuck === true;
      } else {
        item.isStuck === false;
      }
      lastIsReturned = item.isReturned;
      if (item.y === item.returnY) {
        item.isReturned = true;
      } else {
        item.isReturned = false;
      }
      if (item.hasOwnProperty("onStickChanged") && lastIsStuck !== item.isStuck) {
        item.onStickChanged(item, scrollY);
      }
      if (item.hasOwnProperty("onYChanged")) {
        item.onYChanged(item, scrollY);
      }
    }
    return lastY = scrollY;
  });
  exports.coordinatorLayout = coordinatorLayout;
  return exports.scrollview = scrollview;
};

exports.addScrollingChild = function(item, opts) {
  var key, value;
  if (opts == null) {
    opts = {};
  }
  for (key in defaultOpts) {
    value = defaultOpts[key];
    if (!opts.hasOwnProperty(key)) {
      if (key === "stickyY" && value === "auto") {
        opts[key] = calculateDefaultStickyY(item, opts.scrollDirection);
      } else {
        opts[key] = value;
      }
    }
  }
  item.scrollDirection = opts.scrollDirection;
  item.stickyY = opts.stickyY;
  item.scrollBehaviour = opts.scrollBehaviour;
  item.startY = item.y;
  item.returnY = opts.returnY;
  if (opts.hasOwnProperty("onYChanged")) {
    item.onYChanged = opts.onYChanged;
  }
  if (opts.hasOwnProperty("onStickChanged")) {
    item.onStickChanged = opts.onStickChanged;
  }
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMveWFzaW4vU2l0ZXMvRnJhbWVyIE1vZHVsZXMvY29vcmRpbmF0b3JMYXlvdXQuZnJhbWVyL21vZHVsZXMvY29vcmRpbmF0b3JMYXlvdXQuY29mZmVlIiwiL1VzZXJzL3lhc2luL1NpdGVzL0ZyYW1lciBNb2R1bGVzL2Nvb3JkaW5hdG9yTGF5b3V0LmZyYW1lci9tb2R1bGVzL215TW9kdWxlLmNvZmZlZSIsIi9Vc2Vycy95YXNpbi9TaXRlcy9GcmFtZXIgTW9kdWxlcy9jb29yZGluYXRvckxheW91dC5mcmFtZXIvbW9kdWxlcy9yaXBwbGVCdXR0b24uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDTUEsSUFBQTs7QUFBQSxPQUFPLENBQUMsaUJBQVIsR0FBNEI7O0FBQzVCLE9BQU8sQ0FBQyxVQUFSLEdBQXFCOztBQUVyQixPQUFPLENBQUMsZUFBUixHQUNDO0VBQUEsRUFBQSxFQUFJLElBQUo7RUFDQSxJQUFBLEVBQU0sTUFETjs7O0FBR0QsT0FBTyxDQUFDLGVBQVIsR0FDQztFQUFBLElBQUEsRUFBTSxDQUFOO0VBQ0EsTUFBQSxFQUFRLENBRFI7OztBQUlELFdBQUEsR0FDQztFQUFBLGVBQUEsRUFBaUIsT0FBTyxDQUFDLGVBQWUsQ0FBQyxFQUF6QztFQUNBLE9BQUEsRUFBUyxNQURUO0VBRUEsZUFBQSxFQUFpQixPQUFPLENBQUMsZUFBZSxDQUFDLElBRnpDO0VBR0EsT0FBQSxFQUFTLENBSFQ7OztBQVFELHVCQUFBLEdBQTBCLFNBQUMsS0FBRCxFQUFRLFNBQVI7RUFDekIsSUFBRyxTQUFBLEtBQWEsT0FBTyxDQUFDLGVBQWUsQ0FBQyxFQUF4QztBQUNDLFdBQU8sS0FBSyxDQUFDLE1BQU4sR0FBYSxDQUFDLEVBRHRCO0dBQUEsTUFBQTtBQUdDLFdBQU8sT0FBTyxDQUFDLGlCQUFpQixDQUFDLE9BSGxDOztBQUR5Qjs7QUFPMUIsVUFBQSxHQUFh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UDtRQUNBLE9BQUEsRUFBUyxDQURUO09BREQ7TUFHQSxJQUFBLEVBQU0sUUFBUSxDQUFDLFVBSGY7S0FEVztJQU1aLEtBQUssQ0FBQyxPQUFOLENBQ0M7TUFBQSxVQUFBLEVBQ0M7UUFBQSxVQUFBLEVBQVksVUFBWjtPQUREO01BRUEsSUFBQSxFQUFNLFFBQVEsQ0FBQyxVQUZmO0tBREQ7V0FLQSxTQUFTLENBQUMsRUFBVixDQUFhLEtBQWIsRUFBb0IsU0FBQTtBQUNuQixVQUFBO01BQUEsVUFBQSxHQUFhLE1BQU0sQ0FBQyxPQUFQLENBQ1o7UUFBQSxVQUFBLEVBQ0M7VUFBQSxPQUFBLEVBQVMsQ0FBVDtTQUREO1FBRUEsSUFBQSxFQUFNLFFBQVEsQ0FBQyxRQUZmO09BRFk7TUFLYixLQUFLLENBQUMsT0FBTixDQUNDO1FBQUEsVUFBQSxFQUNDO1VBQUEsVUFBQSxFQUFZLENBQVo7U0FERDtRQUVBLElBQUEsRUFBTSxRQUFRLENBQUMsUUFGZjtPQUREO2FBS0EsVUFBVSxDQUFDLEVBQVgsQ0FBYyxLQUFkLEVBQXFCLFNBQUE7ZUFDcEIsTUFBTSxDQUFDLE9BQVAsQ0FBQTtNQURvQixDQUFyQjtJQVhtQixDQUFwQjtFQTNCVyxDQUFaO0FBTG1CIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIiMgQWRkIHRoZSBmb2xsb3dpbmcgbGluZSB0byB5b3VyIHByb2plY3QgaW4gRnJhbWVyIFN0dWRpby4gXG4jIG15TW9kdWxlID0gcmVxdWlyZSBcIm15TW9kdWxlXCJcbiMgUmVmZXJlbmNlIHRoZSBjb250ZW50cyBieSBuYW1lLCBsaWtlIG15TW9kdWxlLm15RnVuY3Rpb24oKSBvciBteU1vZHVsZS5teVZhclxuXG5cblxuZXhwb3J0cy5jb29yZGluYXRvckxheW91dCA9IG51bGxcbmV4cG9ydHMuc2Nyb2xsdmlldyA9IG51bGxcblxuZXhwb3J0cy5zY3JvbGxEaXJlY3Rpb24gPSBcblx0VVA6IFwidXBcIlxuXHRET1dOOiBcImRvd25cIlxuXG5leHBvcnRzLnNjcm9sbEJlaGF2aW91ciA9IFxuXHRBV0FZOiAwXG5cdFJFVFVSTjogMVxuXG5cbmRlZmF1bHRPcHRzID0gXG5cdHNjcm9sbERpcmVjdGlvbjogZXhwb3J0cy5zY3JvbGxEaXJlY3Rpb24uVVBcblx0c3RpY2t5WTogXCJhdXRvXCJcblx0c2Nyb2xsQmVoYXZpb3VyOiBleHBvcnRzLnNjcm9sbEJlaGF2aW91ci5BV0FZXG5cdHJldHVyblk6IDBcblxuXG5cblxuY2FsY3VsYXRlRGVmYXVsdFN0aWNreVkgPSAobGF5ZXIsIGRpcmVjdGlvbikgLT5cblx0aWYgZGlyZWN0aW9uID09IGV4cG9ydHMuc2Nyb2xsRGlyZWN0aW9uLlVQXG5cdFx0cmV0dXJuIGxheWVyLmhlaWdodCotMVxuXHRlbHNlXG5cdFx0cmV0dXJuIGV4cG9ydHMuY29vcmRpbmF0b3JMYXlvdXQuaGVpZ2h0IFxuXG5cbmlzRnVuY3Rpb24gPSAob2JqKSAtPlxuICByZXR1cm4gISEob2JqICYmIG9iai5jb25zdHJ1Y3RvciAmJiBvYmouY2FsbCAmJiBvYmouYXBwbHkpXG5cblxubGFzdFkgPSAwXG5cbmV4cG9ydHMubWFrZSA9ICgpIC0+XG5cdGNvb3JkaW5hdG9yTGF5b3V0ID0gbmV3IExheWVyXG5cdFx0d2lkdGg6IFNjcmVlbi53aWR0aFxuXHRcdGhlaWdodDogU2NyZWVuLmhlaWdodFxuXHRcdGJhY2tncm91bmRDb2xvcjogXCJ0cmFuc3BhcmVudFwiXG5cdFx0bmFtZTogXCJjb29yZGluYXRvckxheW91dFwiXG5cblx0Y29vcmRpbmF0b3JMYXlvdXQuc2Nyb2xsaW5nQ2hpbGRyZW4gPSBbXVxuXG5cdHNjcm9sbHZpZXcgPSBuZXcgU2Nyb2xsQ29tcG9uZW50XG5cdFx0d2lkdGg6IFNjcmVlbi53aWR0aFxuXHRcdGhlaWdodDogU2NyZWVuLmhlaWdodFxuXHRcdHNjcm9sbEhvcml6b250YWw6IGZhbHNlXG5cdFx0bmFtZTogXCJzY3JvbGx2aWV3XCJcblx0XHRwYXJlbnQ6IGNvb3JkaW5hdG9yTGF5b3V0XG5cblx0Y29vcmRpbmF0b3JMYXlvdXQuc2Nyb2xsdmlldyA9IHNjcm9sbHZpZXc7XG5cblx0c2Nyb2xsdmlldy5jb250ZW50Lm9uIFwiY2hhbmdlOnlcIiwgLT5cblx0XHRzY3JvbGxZID0gTWF0aC5tYXgoTWF0aC5taW4oc2Nyb2xsdmlldy5zY3JvbGxZLCBzY3JvbGx2aWV3LmNvbnRlbnQuaGVpZ2h0LXNjcm9sbHZpZXcuaGVpZ2h0KSwgMClcblx0XHRkZWx0YVkgPSBzY3JvbGxZIC0gbGFzdFk7XG5cblx0XHRmb3IgaXRlbSBpbiBjb29yZGluYXRvckxheW91dC5zY3JvbGxpbmdDaGlsZHJlblxuXG5cdFx0XHRpZiBpdGVtLnNjcm9sbERpcmVjdGlvbiA9PSBleHBvcnRzLnNjcm9sbERpcmVjdGlvbi5VUCAmJiBpdGVtLnNjcm9sbEJlaGF2aW91ciA9PSBleHBvcnRzLnNjcm9sbEJlaGF2aW91ci5SRVRVUk5cblx0XHRcdFx0aXRlbS55ID0gTWF0aC5taW4oTWF0aC5tYXgoaXRlbS55LWRlbHRhWSwgaXRlbS5zdGlja3lZKSwgTWF0aC5tYXgoLXNjcm9sbFkraXRlbS5zdGFydFksIGl0ZW0ucmV0dXJuWSkpXG5cblx0XHRcdGVsc2UgaWYgaXRlbS5zY3JvbGxEaXJlY3Rpb24gPT0gZXhwb3J0cy5zY3JvbGxEaXJlY3Rpb24uVVAgJiYgaXRlbS5zY3JvbGxCZWhhdmlvdXIgPT0gZXhwb3J0cy5zY3JvbGxCZWhhdmlvdXIuQVdBWVxuXHRcdFx0XHRpdGVtLnkgPSBNYXRoLm1heCgtc2Nyb2xsWStpdGVtLnN0YXJ0WSwgaXRlbS5zdGlja3lZKVx0XG5cblx0XHRcdGVsc2UgaWYgaXRlbS5zY3JvbGxEaXJlY3Rpb24gPT0gZXhwb3J0cy5zY3JvbGxEaXJlY3Rpb24uRE9XTiAmJiBpdGVtLnNjcm9sbEJlaGF2aW91ciA9PSBleHBvcnRzLnNjcm9sbEJlaGF2aW91ci5SRVRVUk5cblx0XHRcdFx0aXRlbS55ID0gTWF0aC5tYXgoTWF0aC5taW4oaXRlbS55K2RlbHRhWSwgaXRlbS5zdGlja3lZKSwgTWF0aC5taW4oc2Nyb2xsWStpdGVtLnN0YXJ0WSwgaXRlbS5yZXR1cm5ZKSlcdFxuXG5cdFx0XHRlbHNlIGlmIGl0ZW0uc2Nyb2xsRGlyZWN0aW9uID09IGV4cG9ydHMuc2Nyb2xsRGlyZWN0aW9uLkRPV04gJiYgaXRlbS5zY3JvbGxCZWhhdmlvdXIgPT0gZXhwb3J0cy5zY3JvbGxCZWhhdmlvdXIuQVdBWVxuXHRcdFx0XHRpdGVtLnkgPSBNYXRoLm1pbihzY3JvbGxZK2l0ZW0uc3RhcnRZLCBpdGVtLnN0aWNreVkpXHRcblxuXG5cdFx0XHRsYXN0SXNTdHVjayA9IGl0ZW0uaXNTdHVjaztcblx0XHRcdGlmIGl0ZW0ueSA9PSBpdGVtLnN0aWNreVlcblx0XHRcdFx0aXRlbS5pc1N0dWNrID09IHRydWVcblx0XHRcdGVsc2Vcblx0XHRcdFx0aXRlbS5pc1N0dWNrID09IGZhbHNlXG5cblx0XHRcdGxhc3RJc1JldHVybmVkID0gaXRlbS5pc1JldHVybmVkO1xuXHRcdFx0aWYgaXRlbS55ID09IGl0ZW0ucmV0dXJuWVxuXHRcdFx0XHRpdGVtLmlzUmV0dXJuZWQgPSB0cnVlXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGl0ZW0uaXNSZXR1cm5lZCA9IGZhbHNlXG5cblx0XHRcdGlmIGl0ZW0uaGFzT3duUHJvcGVydHkoXCJvblN0aWNrQ2hhbmdlZFwiKSAmJiBsYXN0SXNTdHVjayAhPSBpdGVtLmlzU3R1Y2tcblx0XHRcdFx0aXRlbS5vblN0aWNrQ2hhbmdlZChpdGVtLCBzY3JvbGxZKTtcblxuXHRcdFx0aWYgaXRlbS5oYXNPd25Qcm9wZXJ0eShcIm9uWUNoYW5nZWRcIilcblx0XHRcdFx0aXRlbS5vbllDaGFuZ2VkKGl0ZW0sIHNjcm9sbFkpXG5cblxuXHRcdGxhc3RZID0gc2Nyb2xsWVxuXG5cblxuXG5cdGV4cG9ydHMuY29vcmRpbmF0b3JMYXlvdXQgPSBjb29yZGluYXRvckxheW91dFxuXHRleHBvcnRzLnNjcm9sbHZpZXcgPSBzY3JvbGx2aWV3XG5cblxuZXhwb3J0cy5hZGRTY3JvbGxpbmdDaGlsZCA9IChpdGVtLCBvcHRzID0ge30pIC0+XG5cblx0Zm9yIGtleSwgdmFsdWUgb2YgZGVmYXVsdE9wdHNcblx0XHRpZiAhb3B0cy5oYXNPd25Qcm9wZXJ0eShrZXkpXG5cdFx0XHRpZiBrZXkgPT0gXCJzdGlja3lZXCIgJiYgdmFsdWUgPT0gXCJhdXRvXCJcblx0XHRcdFx0b3B0c1trZXldID0gY2FsY3VsYXRlRGVmYXVsdFN0aWNreVkoaXRlbSwgb3B0cy5zY3JvbGxEaXJlY3Rpb24pXG5cdFx0XHRlbHNlXG5cdFx0XHRcdG9wdHNba2V5XSA9IHZhbHVlXG5cblx0aXRlbS5zY3JvbGxEaXJlY3Rpb24gPSBvcHRzLnNjcm9sbERpcmVjdGlvblxuXHRpdGVtLnN0aWNreVkgPSBvcHRzLnN0aWNreVlcblx0aXRlbS5zY3JvbGxCZWhhdmlvdXIgPSBvcHRzLnNjcm9sbEJlaGF2aW91clxuXHRpdGVtLnN0YXJ0WSA9IGl0ZW0ueVxuXHRpdGVtLnJldHVyblkgPSBvcHRzLnJldHVybllcblxuXHRpZiBvcHRzLmhhc093blByb3BlcnR5KFwib25ZQ2hhbmdlZFwiKVxuXHRcdGl0ZW0ub25ZQ2hhbmdlZCA9IG9wdHMub25ZQ2hhbmdlZFxuXG5cdGlmIG9wdHMuaGFzT3duUHJvcGVydHkoXCJvblN0aWNrQ2hhbmdlZFwiKVxuXHRcdGl0ZW0ub25TdGlja0NoYW5nZWQgPSBvcHRzLm9uU3RpY2tDaGFuZ2VkXG5cblxuXHRleHBvcnRzLmNvb3JkaW5hdG9yTGF5b3V0LnNjcm9sbGluZ0NoaWxkcmVuLnB1c2goaXRlbSlcblx0ZXhwb3J0cy5jb29yZGluYXRvckxheW91dC5hZGRDaGlsZChpdGVtKVxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cbiIsIiMgQWRkIHRoZSBmb2xsb3dpbmcgbGluZSB0byB5b3VyIHByb2plY3QgaW4gRnJhbWVyIFN0dWRpby4gXG4jIG15TW9kdWxlID0gcmVxdWlyZSBcIm15TW9kdWxlXCJcbiMgUmVmZXJlbmNlIHRoZSBjb250ZW50cyBieSBuYW1lLCBsaWtlIG15TW9kdWxlLm15RnVuY3Rpb24oKSBvciBteU1vZHVsZS5teVZhclxuXG5leHBvcnRzLm15VmFyID0gXCJteVZhcmlhYmxlXCJcblxuZXhwb3J0cy5teUZ1bmN0aW9uID0gLT5cblx0cHJpbnQgXCJteUZ1bmN0aW9uIGlzIHJ1bm5pbmdcIlxuXG5leHBvcnRzLm15QXJyYXkgPSBbMSwgMiwgM10iLCJkZWZhdWx0cyA9IFxuXHRjb2xvcjogXCJyZ2JhKDAsMCwwLDAuMSlcIlxuXHRzaGFkb3dDb2xvcjogXCJyZ2JhKDAsMCwwLDAuMylcIlxuXHRzaGFkb3dCbHVyOiAzMFxuXHRyaXBwbGVUaW1lOiAwLjNcblx0ZmFkZVRpbWU6IDAuNlxuXG5leHBvcnRzLnNldERlZmF1bHRzID0gKGNvbG9yID0gZGVmYXVsdHMuY29sb3IsIHNoYWRvd0NvbG9yID0gZGVmYXVsdHMuc2hhZG93Q29sb3IsIHNoYWRvd0JsdXIgPSBkZWZhdWx0cy5zaGFkb3dCbHVyLCByaXBwbGVUaW1lID0gZGVmYXVsdHMucmlwcGxlVGltZSwgZmFkZVRpbWUgPSBkZWZhdWx0cy5mYWRlVGltZSkgLT5cblx0ZGVmYXVsdHMgPSBcblx0XHRjb2xvcjogY29sb3Jcblx0XHRzaGFkb3dDb2xvcjogc2hhZG93Q29sb3Jcblx0XHRzaGFkb3dCbHVyOiBzaGFkb3dCbHVyXG5cdFx0cmlwcGxlVGltZTogcmlwcGxlVGltZVxuXHRcdGZhZGVUaW1lOiBmYWRlVGltZVxuXG5cbmV4cG9ydHMuYWRkUmlwcGxlID0gKGxheWVyLCBjb2xvciA9IGRlZmF1bHRzLmNvbG9yLCBzaGFkb3dDb2xvciA9IGRlZmF1bHRzLnNoYWRvd0NvbG9yLCBzaGFkb3dCbHVyID0gZGVmYXVsdHMuc2hhZG93Qmx1cikgLT5cblxuXHRsYXllci5zaGFkb3dCbHVyID0gMFxuXHRsYXllci5zaGFkb3dDb2xvciA9IHNoYWRvd0NvbG9yXG5cblx0bGF5ZXIub25UYXAgLT5cblx0XHRzID0gKGxheWVyLndpZHRoKjEuNSktbGF5ZXIuYm9yZGVyUmFkaXVzXG5cdFx0cmlwcGxlID0gbmV3IExheWVyXG5cdFx0XHR4OiAwXG5cdFx0XHR5OiAwXG5cdFx0XHR3aWR0aDogc1xuXHRcdFx0aGVpZ2h0OiBzXG5cdFx0XHRib3JkZXJSYWRpdXM6IHMvMlxuXHRcdFx0YmFja2dyb3VuZENvbG9yOiBjb2xvclxuXHRcdFx0c2NhbGU6IDBcblx0XHRcdG9wYWNpdHk6IDBcblxuXHRcdGxheWVyLmFkZENoaWxkKHJpcHBsZSlcblx0XHRsYXllci5jbGlwID0gdHJ1ZVxuXHRcdHJpcHBsZS5jZW50ZXIoKVxuXG5cdFx0cmlwcGxlT3V0ID0gcmlwcGxlLmFuaW1hdGVcblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdHNjYWxlOiAxLFxuXHRcdFx0XHRvcGFjaXR5OiAxLFxuXHRcdFx0dGltZTogZGVmYXVsdHMucmlwcGxlVGltZVxuXG5cdFx0bGF5ZXIuYW5pbWF0ZSBcblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdHNoYWRvd0JsdXI6IHNoYWRvd0JsdXJcblx0XHRcdHRpbWU6IGRlZmF1bHRzLnJpcHBsZVRpbWVcblxuXHRcdHJpcHBsZU91dC5vbiBcImVuZFwiLCAtPlxuXHRcdFx0cmlwcGxlRmFkZSA9IHJpcHBsZS5hbmltYXRlXG5cdFx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdFx0b3BhY2l0eTogMCxcblx0XHRcdFx0dGltZTogZGVmYXVsdHMuZmFkZVRpbWVcblxuXHRcdFx0bGF5ZXIuYW5pbWF0ZSBcblx0XHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0XHRzaGFkb3dCbHVyOiAwXG5cdFx0XHRcdHRpbWU6IGRlZmF1bHRzLmZhZGVUaW1lXG5cblx0XHRcdHJpcHBsZUZhZGUub24gXCJlbmRcIiwgLT5cblx0XHRcdFx0cmlwcGxlLmRlc3Ryb3koKVxuXG5cblxuIl19
