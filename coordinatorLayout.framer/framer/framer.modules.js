require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"coordinatorLayout":[function(require,module,exports){
var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

exports.CoordinatorLayout = (function(superClass) {
  extend(CoordinatorLayout, superClass);

  CoordinatorLayout.prototype.dependantChildren = [];

  CoordinatorLayout.prototype.directions = {
    UP: "up",
    DOWN: "down"
  };

  CoordinatorLayout.prototype.behaviours = {
    AWAY: "away",
    RETURN: "return"
  };

  CoordinatorLayout.prototype.defaultOpts = {
    scrollDirection: "up",
    stickyY: "auto",
    scrollBehaviour: "away",
    returnY: 0
  };

  CoordinatorLayout.prototype.lastY = 0;

  function CoordinatorLayout(options) {
    var _this;
    if (options == null) {
      options = {};
    }
    _this = this;
    CoordinatorLayout.__super__.constructor.call(this, options);
    _this.scrollview = _this.makeScroll();
    _this.content = _this.scrollview.content;
    _this.content.on("change:y", function() {
      return _this.onScroll(_this);
    });
  }

  CoordinatorLayout.prototype.makeScroll = function() {
    var scrollview;
    scrollview = new ScrollComponent({
      frame: this.frame,
      scrollHorizontal: false,
      name: "coordinatorScrollview",
      parent: this
    });
    return scrollview;
  };

  CoordinatorLayout.prototype.onScroll = function(_this) {
    var deltaY, i, layer, len, ref, scrollY;
    scrollY = Math.max(Math.min(_this.scrollview.scrollY, _this.scrollview.content.height - _this.scrollview.height), 0);
    deltaY = scrollY - _this.lastY;
    ref = _this.dependantChildren;
    for (i = 0, len = ref.length; i < len; i++) {
      layer = ref[i];
      if (layer.scrollDirection === _this.directions.UP && layer.scrollBehaviour === _this.behaviours.RETURN) {
        layer.y = Math.min(Math.max(layer.y - deltaY, layer.stickyY), Math.max(-scrollY + layer.startY, layer.returnY));
      } else if (layer.scrollDirection === _this.directions.UP && layer.scrollBehaviour === _this.behaviours.AWAY) {
        layer.y = Math.max(-scrollY + layer.startY, layer.stickyY);
      } else if (layer.scrollDirection === _this.directions.DOWN && layer.scrollBehaviour === _this.behaviours.RETURN) {
        layer.y = Math.max(Math.min(layer.y + deltaY, layer.stickyY), Math.min(scrollY + layer.startY, layer.returnY));
      } else if (layer.scrollDirection === _this.directions.DOWN && layer.scrollBehaviour === _this.behaviours.AWAY) {
        layer.y = Math.min(scrollY + layer.startY, layer.stickyY);
      }
      layer.emit("change:y", layer);
    }
    return _this.lastY = scrollY;
  };

  CoordinatorLayout.prototype.calculateDefaultStickyY = function(layer, direction) {
    if (direction === this.directions.UP) {
      return layer.height * -1;
    } else {
      return this.height;
    }
  };

  CoordinatorLayout.prototype.addDependantChild = function(layer, options) {
    var key, ref, value;
    if (options == null) {
      options = {};
    }
    ref = this.defaultOpts;
    for (key in ref) {
      value = ref[key];
      if (!options.hasOwnProperty(key)) {
        if (key === "stickyY" && value === "auto") {
          options[key] = this.calculateDefaultStickyY(layer, options.scrollDirection);
        } else {
          options[key] = value;
        }
      }
    }
    layer.scrollDirection = options.scrollDirection;
    layer.stickyY = options.stickyY;
    layer.scrollBehaviour = options.scrollBehaviour;
    layer.startY = layer.y;
    layer.returnY = options.returnY;
    this.dependantChildren.push(layer);
    return this.addChild(layer);
  };

  return CoordinatorLayout;

})(Layer);


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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMveWFzaW4vU2l0ZXMvRnJhbWVyIE1vZHVsZXMvY29vcmRpbmF0b3JMYXlvdXQuZnJhbWVyL21vZHVsZXMvY29vcmRpbmF0b3JMYXlvdXQuY29mZmVlIiwiL1VzZXJzL3lhc2luL1NpdGVzL0ZyYW1lciBNb2R1bGVzL2Nvb3JkaW5hdG9yTGF5b3V0LmZyYW1lci9tb2R1bGVzL215TW9kdWxlLmNvZmZlZSIsIi9Vc2Vycy95YXNpbi9TaXRlcy9GcmFtZXIgTW9kdWxlcy9jb29yZGluYXRvckxheW91dC5mcmFtZXIvbW9kdWxlcy9yaXBwbGVCdXR0b24uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDRUEsSUFBQTs7O0FBQU0sT0FBTyxDQUFDOzs7OEJBQ2IsaUJBQUEsR0FBa0I7OzhCQUNsQixVQUFBLEdBQ0M7SUFBQSxFQUFBLEVBQUcsSUFBSDtJQUNBLElBQUEsRUFBSyxNQURMOzs7OEJBR0QsVUFBQSxHQUNDO0lBQUEsSUFBQSxFQUFLLE1BQUw7SUFDQSxNQUFBLEVBQU8sUUFEUDs7OzhCQUdELFdBQUEsR0FDQztJQUFBLGVBQUEsRUFBaUIsSUFBakI7SUFDQSxPQUFBLEVBQVMsTUFEVDtJQUVBLGVBQUEsRUFBaUIsTUFGakI7SUFHQSxPQUFBLEVBQVMsQ0FIVDs7OzhCQUtELEtBQUEsR0FBTzs7RUFFTSwyQkFBQyxPQUFEO0FBQ1osUUFBQTs7TUFEYSxVQUFROztJQUNyQixLQUFBLEdBQVE7SUFDUixtREFBTSxPQUFOO0lBQ0EsS0FBSyxDQUFDLFVBQU4sR0FBbUIsS0FBSyxDQUFDLFVBQU4sQ0FBQTtJQUNuQixLQUFLLENBQUMsT0FBTixHQUFnQixLQUFLLENBQUMsVUFBVSxDQUFDO0lBQ2pDLEtBQUssQ0FBQyxPQUFPLENBQUMsRUFBZCxDQUFpQixVQUFqQixFQUE2QixTQUFBO2FBQzVCLEtBQUssQ0FBQyxRQUFOLENBQWUsS0FBZjtJQUQ0QixDQUE3QjtFQUxZOzs4QkFVYixVQUFBLEdBQVksU0FBQTtBQUNYLFFBQUE7SUFBQSxVQUFBLEdBQWlCLElBQUEsZUFBQSxDQUNoQjtNQUFBLEtBQUEsRUFBTyxJQUFJLENBQUMsS0FBWjtNQUNBLGdCQUFBLEVBQWtCLEtBRGxCO01BRUEsSUFBQSxFQUFNLHVCQUZOO01BR0EsTUFBQSxFQUFRLElBSFI7S0FEZ0I7QUFRakIsV0FBTztFQVRJOzs4QkFhWixRQUFBLEdBQVMsU0FBQyxLQUFEO0FBQ1IsUUFBQTtJQUFBLE9BQUEsR0FBVSxJQUFJLENBQUMsR0FBTCxDQUFTLElBQUksQ0FBQyxHQUFMLENBQVMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxPQUExQixFQUFtQyxLQUFLLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxNQUF6QixHQUFnQyxLQUFLLENBQUMsVUFBVSxDQUFDLE1BQXBGLENBQVQsRUFBc0csQ0FBdEc7SUFDVixNQUFBLEdBQVMsT0FBQSxHQUFVLEtBQUssQ0FBQztBQUV6QjtBQUFBLFNBQUEscUNBQUE7O01BRUMsSUFBRyxLQUFLLENBQUMsZUFBTixLQUF5QixLQUFLLENBQUMsVUFBVSxDQUFDLEVBQTFDLElBQWdELEtBQUssQ0FBQyxlQUFOLEtBQXlCLEtBQUssQ0FBQyxVQUFVLENBQUMsTUFBN0Y7UUFDQyxLQUFLLENBQUMsQ0FBTixHQUFVLElBQUksQ0FBQyxHQUFMLENBQVMsSUFBSSxDQUFDLEdBQUwsQ0FBUyxLQUFLLENBQUMsQ0FBTixHQUFRLE1BQWpCLEVBQXlCLEtBQUssQ0FBQyxPQUEvQixDQUFULEVBQWtELElBQUksQ0FBQyxHQUFMLENBQVMsQ0FBQyxPQUFELEdBQVMsS0FBSyxDQUFDLE1BQXhCLEVBQWdDLEtBQUssQ0FBQyxPQUF0QyxDQUFsRCxFQURYO09BQUEsTUFHSyxJQUFHLEtBQUssQ0FBQyxlQUFOLEtBQXlCLEtBQUssQ0FBQyxVQUFVLENBQUMsRUFBMUMsSUFBZ0QsS0FBSyxDQUFDLGVBQU4sS0FBeUIsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUE3RjtRQUNKLEtBQUssQ0FBQyxDQUFOLEdBQVUsSUFBSSxDQUFDLEdBQUwsQ0FBUyxDQUFDLE9BQUQsR0FBUyxLQUFLLENBQUMsTUFBeEIsRUFBZ0MsS0FBSyxDQUFDLE9BQXRDLEVBRE47T0FBQSxNQUdBLElBQUcsS0FBSyxDQUFDLGVBQU4sS0FBeUIsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUExQyxJQUFtRCxLQUFLLENBQUMsZUFBTixLQUF5QixLQUFLLENBQUMsVUFBVSxDQUFDLE1BQWhHO1FBQ0osS0FBSyxDQUFDLENBQU4sR0FBVSxJQUFJLENBQUMsR0FBTCxDQUFTLElBQUksQ0FBQyxHQUFMLENBQVMsS0FBSyxDQUFDLENBQU4sR0FBUSxNQUFqQixFQUF5QixLQUFLLENBQUMsT0FBL0IsQ0FBVCxFQUFrRCxJQUFJLENBQUMsR0FBTCxDQUFTLE9BQUEsR0FBUSxLQUFLLENBQUMsTUFBdkIsRUFBK0IsS0FBSyxDQUFDLE9BQXJDLENBQWxELEVBRE47T0FBQSxNQUdBLElBQUcsS0FBSyxDQUFDLGVBQU4sS0FBeUIsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUExQyxJQUFrRCxLQUFLLENBQUMsZUFBTixLQUF5QixLQUFLLENBQUMsVUFBVSxDQUFDLElBQS9GO1FBQ0osS0FBSyxDQUFDLENBQU4sR0FBVSxJQUFJLENBQUMsR0FBTCxDQUFTLE9BQUEsR0FBUSxLQUFLLENBQUMsTUFBdkIsRUFBK0IsS0FBSyxDQUFDLE9BQXJDLEVBRE47O01BSUwsS0FBSyxDQUFDLElBQU4sQ0FBVyxVQUFYLEVBQXVCLEtBQXZCO0FBZkQ7V0FrQkEsS0FBSyxDQUFDLEtBQU4sR0FBYztFQXRCTjs7OEJBMEJULHVCQUFBLEdBQXdCLFNBQUMsS0FBRCxFQUFRLFNBQVI7SUFDdkIsSUFBRyxTQUFBLEtBQWEsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFoQztBQUNDLGFBQU8sS0FBSyxDQUFDLE1BQU4sR0FBYSxDQUFDLEVBRHRCO0tBQUEsTUFBQTtBQUdDLGFBQU8sSUFBSSxDQUFDLE9BSGI7O0VBRHVCOzs4QkFPeEIsaUJBQUEsR0FBa0IsU0FBQyxLQUFELEVBQVEsT0FBUjtBQUNqQixRQUFBOztNQUR5QixVQUFROztBQUNqQztBQUFBLFNBQUEsVUFBQTs7TUFDQyxJQUFHLENBQUMsT0FBTyxDQUFDLGNBQVIsQ0FBdUIsR0FBdkIsQ0FBSjtRQUNDLElBQUcsR0FBQSxLQUFPLFNBQVAsSUFBb0IsS0FBQSxLQUFTLE1BQWhDO1VBQ0MsT0FBUSxDQUFBLEdBQUEsQ0FBUixHQUFlLElBQUksQ0FBQyx1QkFBTCxDQUE2QixLQUE3QixFQUFvQyxPQUFPLENBQUMsZUFBNUMsRUFEaEI7U0FBQSxNQUFBO1VBR0MsT0FBUSxDQUFBLEdBQUEsQ0FBUixHQUFlLE1BSGhCO1NBREQ7O0FBREQ7SUFPQSxLQUFLLENBQUMsZUFBTixHQUF3QixPQUFPLENBQUM7SUFDaEMsS0FBSyxDQUFDLE9BQU4sR0FBZ0IsT0FBTyxDQUFDO0lBQ3hCLEtBQUssQ0FBQyxlQUFOLEdBQXdCLE9BQU8sQ0FBQztJQUNoQyxLQUFLLENBQUMsTUFBTixHQUFlLEtBQUssQ0FBQztJQUNyQixLQUFLLENBQUMsT0FBTixHQUFnQixPQUFPLENBQUM7SUFNeEIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQXZCLENBQTRCLEtBQTVCO1dBQ0EsSUFBSSxDQUFDLFFBQUwsQ0FBYyxLQUFkO0VBbkJpQjs7OztHQTFFcUI7Ozs7QUNFeEMsT0FBTyxDQUFDLEtBQVIsR0FBZ0I7O0FBRWhCLE9BQU8sQ0FBQyxVQUFSLEdBQXFCLFNBQUE7U0FDcEIsS0FBQSxDQUFNLHVCQUFOO0FBRG9COztBQUdyQixPQUFPLENBQUMsT0FBUixHQUFrQixDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUDs7OztBQ1RsQixJQUFBOztBQUFBLFFBQUEsR0FDQztFQUFBLEtBQUEsRUFBTyxpQkFBUDtFQUNBLFdBQUEsRUFBYSxpQkFEYjtFQUVBLFVBQUEsRUFBWSxFQUZaO0VBR0EsVUFBQSxFQUFZLEdBSFo7RUFJQSxRQUFBLEVBQVUsR0FKVjs7O0FBTUQsT0FBTyxDQUFDLFdBQVIsR0FBc0IsU0FBQyxLQUFELEVBQXlCLFdBQXpCLEVBQTZELFVBQTdELEVBQStGLFVBQS9GLEVBQWlJLFFBQWpJOztJQUFDLFFBQVEsUUFBUSxDQUFDOzs7SUFBTyxjQUFjLFFBQVEsQ0FBQzs7O0lBQWEsYUFBYSxRQUFRLENBQUM7OztJQUFZLGFBQWEsUUFBUSxDQUFDOzs7SUFBWSxXQUFXLFFBQVEsQ0FBQzs7U0FDMUssUUFBQSxHQUNDO0lBQUEsS0FBQSxFQUFPLEtBQVA7SUFDQSxXQUFBLEVBQWEsV0FEYjtJQUVBLFVBQUEsRUFBWSxVQUZaO0lBR0EsVUFBQSxFQUFZLFVBSFo7SUFJQSxRQUFBLEVBQVUsUUFKVjs7QUFGb0I7O0FBU3RCLE9BQU8sQ0FBQyxTQUFSLEdBQW9CLFNBQUMsS0FBRCxFQUFRLEtBQVIsRUFBZ0MsV0FBaEMsRUFBb0UsVUFBcEU7O0lBQVEsUUFBUSxRQUFRLENBQUM7OztJQUFPLGNBQWMsUUFBUSxDQUFDOzs7SUFBYSxhQUFhLFFBQVEsQ0FBQzs7RUFFN0csS0FBSyxDQUFDLFVBQU4sR0FBbUI7RUFDbkIsS0FBSyxDQUFDLFdBQU4sR0FBb0I7U0FFcEIsS0FBSyxDQUFDLEtBQU4sQ0FBWSxTQUFBO0FBQ1gsUUFBQTtJQUFBLENBQUEsR0FBSSxDQUFDLEtBQUssQ0FBQyxLQUFOLEdBQVksR0FBYixDQUFBLEdBQWtCLEtBQUssQ0FBQztJQUM1QixNQUFBLEdBQWEsSUFBQSxLQUFBLENBQ1o7TUFBQSxDQUFBLEVBQUcsQ0FBSDtNQUNBLENBQUEsRUFBRyxDQURIO01BRUEsS0FBQSxFQUFPLENBRlA7TUFHQSxNQUFBLEVBQVEsQ0FIUjtNQUlBLFlBQUEsRUFBYyxDQUFBLEdBQUUsQ0FKaEI7TUFLQSxlQUFBLEVBQWlCLEtBTGpCO01BTUEsS0FBQSxFQUFPLENBTlA7TUFPQSxPQUFBLEVBQVMsQ0FQVDtLQURZO0lBVWIsS0FBSyxDQUFDLFFBQU4sQ0FBZSxNQUFmO0lBQ0EsS0FBSyxDQUFDLElBQU4sR0FBYTtJQUNiLE1BQU0sQ0FBQyxNQUFQLENBQUE7SUFFQSxTQUFBLEdBQVksTUFBTSxDQUFDLE9BQVAsQ0FDWDtNQUFBLFVBQUEsRUFDQztRQUFBLEtBQUEsRUFBTyxDQUFQO1FBQ0EsT0FBQSxFQUFTLENBRFQ7T0FERDtNQUdBLElBQUEsRUFBTSxRQUFRLENBQUMsVUFIZjtLQURXO0lBTVosS0FBSyxDQUFDLE9BQU4sQ0FDQztNQUFBLFVBQUEsRUFDQztRQUFBLFVBQUEsRUFBWSxVQUFaO09BREQ7TUFFQSxJQUFBLEVBQU0sUUFBUSxDQUFDLFVBRmY7S0FERDtXQUtBLFNBQVMsQ0FBQyxFQUFWLENBQWEsS0FBYixFQUFvQixTQUFBO0FBQ25CLFVBQUE7TUFBQSxVQUFBLEdBQWEsTUFBTSxDQUFDLE9BQVAsQ0FDWjtRQUFBLFVBQUEsRUFDQztVQUFBLE9BQUEsRUFBUyxDQUFUO1NBREQ7UUFFQSxJQUFBLEVBQU0sUUFBUSxDQUFDLFFBRmY7T0FEWTtNQUtiLEtBQUssQ0FBQyxPQUFOLENBQ0M7UUFBQSxVQUFBLEVBQ0M7VUFBQSxVQUFBLEVBQVksQ0FBWjtTQUREO1FBRUEsSUFBQSxFQUFNLFFBQVEsQ0FBQyxRQUZmO09BREQ7YUFLQSxVQUFVLENBQUMsRUFBWCxDQUFjLEtBQWQsRUFBcUIsU0FBQTtlQUNwQixNQUFNLENBQUMsT0FBUCxDQUFBO01BRG9CLENBQXJCO0lBWG1CLENBQXBCO0VBM0JXLENBQVo7QUFMbUIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXG5cbmNsYXNzIGV4cG9ydHMuQ29vcmRpbmF0b3JMYXlvdXQgZXh0ZW5kcyBMYXllclxuXHRkZXBlbmRhbnRDaGlsZHJlbjpbXVxuXHRkaXJlY3Rpb25zOlxuXHRcdFVQOlwidXBcIlxuXHRcdERPV046XCJkb3duXCJcblxuXHRiZWhhdmlvdXJzOlxuXHRcdEFXQVk6XCJhd2F5XCJcblx0XHRSRVRVUk46XCJyZXR1cm5cIlxuXG5cdGRlZmF1bHRPcHRzOlxuXHRcdHNjcm9sbERpcmVjdGlvbjogXCJ1cFwiXG5cdFx0c3RpY2t5WTogXCJhdXRvXCJcblx0XHRzY3JvbGxCZWhhdmlvdXI6IFwiYXdheVwiXG5cdFx0cmV0dXJuWTogMFxuXG5cdGxhc3RZOiAwXG5cblx0Y29uc3RydWN0b3I6IChvcHRpb25zPXt9KSAtPlxuXHRcdF90aGlzID0gdGhpc1xuXHRcdHN1cGVyKG9wdGlvbnMpXG5cdFx0X3RoaXMuc2Nyb2xsdmlldyA9IF90aGlzLm1ha2VTY3JvbGwoKTtcblx0XHRfdGhpcy5jb250ZW50ID0gX3RoaXMuc2Nyb2xsdmlldy5jb250ZW50XG5cdFx0X3RoaXMuY29udGVudC5vbiBcImNoYW5nZTp5XCIsIC0+XG5cdFx0XHRfdGhpcy5vblNjcm9sbChfdGhpcylcblx0XHRcblxuXG5cdG1ha2VTY3JvbGw6IC0+XG5cdFx0c2Nyb2xsdmlldyA9IG5ldyBTY3JvbGxDb21wb25lbnRcblx0XHRcdGZyYW1lOiB0aGlzLmZyYW1lXG5cdFx0XHRzY3JvbGxIb3Jpem9udGFsOiBmYWxzZVxuXHRcdFx0bmFtZTogXCJjb29yZGluYXRvclNjcm9sbHZpZXdcIlxuXHRcdFx0cGFyZW50OiB0aGlzXG5cblx0XHQjIHRoaXMgPSB0aGlzXG5cdFx0XG5cdFx0cmV0dXJuIHNjcm9sbHZpZXdcblxuXG5cblx0b25TY3JvbGw6KF90aGlzKSAtPlxuXHRcdHNjcm9sbFkgPSBNYXRoLm1heChNYXRoLm1pbihfdGhpcy5zY3JvbGx2aWV3LnNjcm9sbFksIF90aGlzLnNjcm9sbHZpZXcuY29udGVudC5oZWlnaHQtX3RoaXMuc2Nyb2xsdmlldy5oZWlnaHQpLCAwKVxuXHRcdGRlbHRhWSA9IHNjcm9sbFkgLSBfdGhpcy5sYXN0WTtcblxuXHRcdGZvciBsYXllciBpbiBfdGhpcy5kZXBlbmRhbnRDaGlsZHJlblxuXG5cdFx0XHRpZiBsYXllci5zY3JvbGxEaXJlY3Rpb24gPT0gX3RoaXMuZGlyZWN0aW9ucy5VUCAmJiBsYXllci5zY3JvbGxCZWhhdmlvdXIgPT0gX3RoaXMuYmVoYXZpb3Vycy5SRVRVUk5cblx0XHRcdFx0bGF5ZXIueSA9IE1hdGgubWluKE1hdGgubWF4KGxheWVyLnktZGVsdGFZLCBsYXllci5zdGlja3lZKSwgTWF0aC5tYXgoLXNjcm9sbFkrbGF5ZXIuc3RhcnRZLCBsYXllci5yZXR1cm5ZKSlcblxuXHRcdFx0ZWxzZSBpZiBsYXllci5zY3JvbGxEaXJlY3Rpb24gPT0gX3RoaXMuZGlyZWN0aW9ucy5VUCAmJiBsYXllci5zY3JvbGxCZWhhdmlvdXIgPT0gX3RoaXMuYmVoYXZpb3Vycy5BV0FZXG5cdFx0XHRcdGxheWVyLnkgPSBNYXRoLm1heCgtc2Nyb2xsWStsYXllci5zdGFydFksIGxheWVyLnN0aWNreVkpXHRcblxuXHRcdFx0ZWxzZSBpZiBsYXllci5zY3JvbGxEaXJlY3Rpb24gPT0gX3RoaXMuZGlyZWN0aW9ucy5ET1dOICAmJiBsYXllci5zY3JvbGxCZWhhdmlvdXIgPT0gX3RoaXMuYmVoYXZpb3Vycy5SRVRVUk5cblx0XHRcdFx0bGF5ZXIueSA9IE1hdGgubWF4KE1hdGgubWluKGxheWVyLnkrZGVsdGFZLCBsYXllci5zdGlja3lZKSwgTWF0aC5taW4oc2Nyb2xsWStsYXllci5zdGFydFksIGxheWVyLnJldHVyblkpKVx0XG5cblx0XHRcdGVsc2UgaWYgbGF5ZXIuc2Nyb2xsRGlyZWN0aW9uID09IF90aGlzLmRpcmVjdGlvbnMuRE9XTiAmJiBsYXllci5zY3JvbGxCZWhhdmlvdXIgPT0gX3RoaXMuYmVoYXZpb3Vycy5BV0FZXG5cdFx0XHRcdGxheWVyLnkgPSBNYXRoLm1pbihzY3JvbGxZK2xheWVyLnN0YXJ0WSwgbGF5ZXIuc3RpY2t5WSlcdFxuXG5cdFx0XHRcblx0XHRcdGxheWVyLmVtaXQoXCJjaGFuZ2U6eVwiLCBsYXllcilcblxuXG5cdFx0X3RoaXMubGFzdFkgPSBzY3JvbGxZXG5cblxuXG5cdGNhbGN1bGF0ZURlZmF1bHRTdGlja3lZOihsYXllciwgZGlyZWN0aW9uKSAtPlxuXHRcdGlmIGRpcmVjdGlvbiA9PSB0aGlzLmRpcmVjdGlvbnMuVVBcblx0XHRcdHJldHVybiBsYXllci5oZWlnaHQqLTFcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gdGhpcy5oZWlnaHQgXG5cblxuXHRhZGREZXBlbmRhbnRDaGlsZDoobGF5ZXIsIG9wdGlvbnM9e30pIC0+XG5cdFx0Zm9yIGtleSwgdmFsdWUgb2YgdGhpcy5kZWZhdWx0T3B0c1xuXHRcdFx0aWYgIW9wdGlvbnMuaGFzT3duUHJvcGVydHkoa2V5KVxuXHRcdFx0XHRpZiBrZXkgPT0gXCJzdGlja3lZXCIgJiYgdmFsdWUgPT0gXCJhdXRvXCJcblx0XHRcdFx0XHRvcHRpb25zW2tleV0gPSB0aGlzLmNhbGN1bGF0ZURlZmF1bHRTdGlja3lZKGxheWVyLCBvcHRpb25zLnNjcm9sbERpcmVjdGlvbilcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdG9wdGlvbnNba2V5XSA9IHZhbHVlXG5cblx0XHRsYXllci5zY3JvbGxEaXJlY3Rpb24gPSBvcHRpb25zLnNjcm9sbERpcmVjdGlvblxuXHRcdGxheWVyLnN0aWNreVkgPSBvcHRpb25zLnN0aWNreVlcblx0XHRsYXllci5zY3JvbGxCZWhhdmlvdXIgPSBvcHRpb25zLnNjcm9sbEJlaGF2aW91clxuXHRcdGxheWVyLnN0YXJ0WSA9IGxheWVyLnlcblx0XHRsYXllci5yZXR1cm5ZID0gb3B0aW9ucy5yZXR1cm5ZXG5cblx0XHQjIGlmIG9wdGlvbnMuaGFzT3duUHJvcGVydHkoXCJvbllDaGFuZ2VkXCIpXG5cdFx0IyBcdGxheWVyLm9uWUNoYW5nZWQgPSBvcHRpb25zLm9uWUNoYW5nZWRcblxuXG5cdFx0dGhpcy5kZXBlbmRhbnRDaGlsZHJlbi5wdXNoKGxheWVyKVxuXHRcdHRoaXMuYWRkQ2hpbGQobGF5ZXIpXG5cblx0XHRcblxuXG5cblxuIyAjIEFkZCB0aGUgZm9sbG93aW5nIGxpbmUgdG8geW91ciBwcm9qZWN0IGluIEZyYW1lciBTdHVkaW8uIFxuIyAjIG15TW9kdWxlID0gcmVxdWlyZSBcIm15TW9kdWxlXCJcbiMgIyBSZWZlcmVuY2UgdGhlIGNvbnRlbnRzIGJ5IG5hbWUsIGxpa2UgbXlNb2R1bGUubXlGdW5jdGlvbigpIG9yIG15TW9kdWxlLm15VmFyXG5cblxuXG4jIGV4cG9ydHMuY29vcmRpbmF0b3JMYXlvdXQgPSBudWxsXG4jIGV4cG9ydHMuc2Nyb2xsdmlldyA9IG51bGxcblxuIyBleHBvcnRzLnNjcm9sbERpcmVjdGlvbiA9IFxuIyBcdFVQOiBcInVwXCJcbiMgXHRET1dOOiBcImRvd25cIlxuXG4jIGV4cG9ydHMuc2Nyb2xsQmVoYXZpb3VyID0gXG4jIFx0QVdBWTogMFxuIyBcdFJFVFVSTjogMVxuXG5cbiMgZGVmYXVsdE9wdHMgPSBcbiMgXHRzY3JvbGxEaXJlY3Rpb246IGV4cG9ydHMuc2Nyb2xsRGlyZWN0aW9uLlVQXG4jIFx0c3RpY2t5WTogXCJhdXRvXCJcbiMgXHRzY3JvbGxCZWhhdmlvdXI6IGV4cG9ydHMuc2Nyb2xsQmVoYXZpb3VyLkFXQVlcbiMgXHRyZXR1cm5ZOiAwXG5cblxuXG5cbiMgY2FsY3VsYXRlRGVmYXVsdFN0aWNreVkgPSAobGF5ZXIsIGRpcmVjdGlvbikgLT5cbiMgXHRpZiBkaXJlY3Rpb24gPT0gZXhwb3J0cy5zY3JvbGxEaXJlY3Rpb24uVVBcbiMgXHRcdHJldHVybiBsYXllci5oZWlnaHQqLTFcbiMgXHRlbHNlXG4jIFx0XHRyZXR1cm4gZXhwb3J0cy5jb29yZGluYXRvckxheW91dC5oZWlnaHQgXG5cblxuIyBpc0Z1bmN0aW9uID0gKG9iaikgLT5cbiMgICByZXR1cm4gISEob2JqICYmIG9iai5jb25zdHJ1Y3RvciAmJiBvYmouY2FsbCAmJiBvYmouYXBwbHkpXG5cblxuIyBsYXN0WSA9IDBcblxuIyBleHBvcnRzLm1ha2UgPSAoKSAtPlxuIyBcdGNvb3JkaW5hdG9yTGF5b3V0ID0gbmV3IExheWVyXG4jIFx0XHR3aWR0aDogU2NyZWVuLndpZHRoXG4jIFx0XHRoZWlnaHQ6IFNjcmVlbi5oZWlnaHRcbiMgXHRcdGJhY2tncm91bmRDb2xvcjogXCJ0cmFuc3BhcmVudFwiXG4jIFx0XHRuYW1lOiBcImNvb3JkaW5hdG9yTGF5b3V0XCJcblxuIyBcdGNvb3JkaW5hdG9yTGF5b3V0LnNjcm9sbGluZ0NoaWxkcmVuID0gW11cblxuIyBcdHNjcm9sbHZpZXcgPSBuZXcgU2Nyb2xsQ29tcG9uZW50XG4jIFx0XHR3aWR0aDogU2NyZWVuLndpZHRoXG4jIFx0XHRoZWlnaHQ6IFNjcmVlbi5oZWlnaHRcbiMgXHRcdHNjcm9sbEhvcml6b250YWw6IGZhbHNlXG4jIFx0XHRuYW1lOiBcInNjcm9sbHZpZXdcIlxuIyBcdFx0cGFyZW50OiBjb29yZGluYXRvckxheW91dFxuXG4jIFx0Y29vcmRpbmF0b3JMYXlvdXQuc2Nyb2xsdmlldyA9IHNjcm9sbHZpZXc7XG5cbiMgXHRzY3JvbGx2aWV3LmNvbnRlbnQub24gXCJjaGFuZ2U6eVwiLCAtPlxuIyBcdFx0c2Nyb2xsWSA9IE1hdGgubWF4KE1hdGgubWluKHNjcm9sbHZpZXcuc2Nyb2xsWSwgc2Nyb2xsdmlldy5jb250ZW50LmhlaWdodC1zY3JvbGx2aWV3LmhlaWdodCksIDApXG4jIFx0XHRkZWx0YVkgPSBzY3JvbGxZIC0gbGFzdFk7XG5cbiMgXHRcdGZvciBpdGVtIGluIGNvb3JkaW5hdG9yTGF5b3V0LnNjcm9sbGluZ0NoaWxkcmVuXG5cbiMgXHRcdFx0aWYgaXRlbS5zY3JvbGxEaXJlY3Rpb24gPT0gZXhwb3J0cy5zY3JvbGxEaXJlY3Rpb24uVVAgJiYgaXRlbS5zY3JvbGxCZWhhdmlvdXIgPT0gZXhwb3J0cy5zY3JvbGxCZWhhdmlvdXIuUkVUVVJOXG4jIFx0XHRcdFx0aXRlbS55ID0gTWF0aC5taW4oTWF0aC5tYXgoaXRlbS55LWRlbHRhWSwgaXRlbS5zdGlja3lZKSwgTWF0aC5tYXgoLXNjcm9sbFkraXRlbS5zdGFydFksIGl0ZW0ucmV0dXJuWSkpXG5cbiMgXHRcdFx0ZWxzZSBpZiBpdGVtLnNjcm9sbERpcmVjdGlvbiA9PSBleHBvcnRzLnNjcm9sbERpcmVjdGlvbi5VUCAmJiBpdGVtLnNjcm9sbEJlaGF2aW91ciA9PSBleHBvcnRzLnNjcm9sbEJlaGF2aW91ci5BV0FZXG4jIFx0XHRcdFx0aXRlbS55ID0gTWF0aC5tYXgoLXNjcm9sbFkraXRlbS5zdGFydFksIGl0ZW0uc3RpY2t5WSlcdFxuXG4jIFx0XHRcdGVsc2UgaWYgaXRlbS5zY3JvbGxEaXJlY3Rpb24gPT0gZXhwb3J0cy5zY3JvbGxEaXJlY3Rpb24uRE9XTiAmJiBpdGVtLnNjcm9sbEJlaGF2aW91ciA9PSBleHBvcnRzLnNjcm9sbEJlaGF2aW91ci5SRVRVUk5cbiMgXHRcdFx0XHRpdGVtLnkgPSBNYXRoLm1heChNYXRoLm1pbihpdGVtLnkrZGVsdGFZLCBpdGVtLnN0aWNreVkpLCBNYXRoLm1pbihzY3JvbGxZK2l0ZW0uc3RhcnRZLCBpdGVtLnJldHVyblkpKVx0XG5cbiMgXHRcdFx0ZWxzZSBpZiBpdGVtLnNjcm9sbERpcmVjdGlvbiA9PSBleHBvcnRzLnNjcm9sbERpcmVjdGlvbi5ET1dOICYmIGl0ZW0uc2Nyb2xsQmVoYXZpb3VyID09IGV4cG9ydHMuc2Nyb2xsQmVoYXZpb3VyLkFXQVlcbiMgXHRcdFx0XHRpdGVtLnkgPSBNYXRoLm1pbihzY3JvbGxZK2l0ZW0uc3RhcnRZLCBpdGVtLnN0aWNreVkpXHRcblxuXG4jIFx0XHRcdGxhc3RJc1N0dWNrID0gaXRlbS5pc1N0dWNrO1xuIyBcdFx0XHRpZiBpdGVtLnkgPT0gaXRlbS5zdGlja3lZXG4jIFx0XHRcdFx0aXRlbS5pc1N0dWNrID09IHRydWVcbiMgXHRcdFx0ZWxzZVxuIyBcdFx0XHRcdGl0ZW0uaXNTdHVjayA9PSBmYWxzZVxuXG4jIFx0XHRcdGxhc3RJc1JldHVybmVkID0gaXRlbS5pc1JldHVybmVkO1xuIyBcdFx0XHRpZiBpdGVtLnkgPT0gaXRlbS5yZXR1cm5ZXG4jIFx0XHRcdFx0aXRlbS5pc1JldHVybmVkID0gdHJ1ZVxuIyBcdFx0XHRlbHNlXG4jIFx0XHRcdFx0aXRlbS5pc1JldHVybmVkID0gZmFsc2VcblxuIyBcdFx0XHRpZiBpdGVtLmhhc093blByb3BlcnR5KFwib25TdGlja0NoYW5nZWRcIikgJiYgbGFzdElzU3R1Y2sgIT0gaXRlbS5pc1N0dWNrXG4jIFx0XHRcdFx0aXRlbS5vblN0aWNrQ2hhbmdlZChpdGVtLCBzY3JvbGxZKTtcblxuIyBcdFx0XHRpZiBpdGVtLmhhc093blByb3BlcnR5KFwib25ZQ2hhbmdlZFwiKVxuIyBcdFx0XHRcdGl0ZW0ub25ZQ2hhbmdlZChpdGVtLCBzY3JvbGxZKVxuXG5cbiMgXHRcdGxhc3RZID0gc2Nyb2xsWVxuXG5cblxuXG4jIFx0ZXhwb3J0cy5jb29yZGluYXRvckxheW91dCA9IGNvb3JkaW5hdG9yTGF5b3V0XG4jIFx0ZXhwb3J0cy5zY3JvbGx2aWV3ID0gc2Nyb2xsdmlld1xuXG5cbiMgZXhwb3J0cy5hZGRTY3JvbGxpbmdDaGlsZCA9IChpdGVtLCBvcHRzID0ge30pIC0+XG5cbiMgXHRmb3Iga2V5LCB2YWx1ZSBvZiBkZWZhdWx0T3B0c1xuIyBcdFx0aWYgIW9wdHMuaGFzT3duUHJvcGVydHkoa2V5KVxuIyBcdFx0XHRpZiBrZXkgPT0gXCJzdGlja3lZXCIgJiYgdmFsdWUgPT0gXCJhdXRvXCJcbiMgXHRcdFx0XHRvcHRzW2tleV0gPSBjYWxjdWxhdGVEZWZhdWx0U3RpY2t5WShpdGVtLCBvcHRzLnNjcm9sbERpcmVjdGlvbilcbiMgXHRcdFx0ZWxzZVxuIyBcdFx0XHRcdG9wdHNba2V5XSA9IHZhbHVlXG5cbiMgXHRpdGVtLnNjcm9sbERpcmVjdGlvbiA9IG9wdHMuc2Nyb2xsRGlyZWN0aW9uXG4jIFx0aXRlbS5zdGlja3lZID0gb3B0cy5zdGlja3lZXG4jIFx0aXRlbS5zY3JvbGxCZWhhdmlvdXIgPSBvcHRzLnNjcm9sbEJlaGF2aW91clxuIyBcdGl0ZW0uc3RhcnRZID0gaXRlbS55XG4jIFx0aXRlbS5yZXR1cm5ZID0gb3B0cy5yZXR1cm5ZXG5cbiMgXHRpZiBvcHRzLmhhc093blByb3BlcnR5KFwib25ZQ2hhbmdlZFwiKVxuIyBcdFx0aXRlbS5vbllDaGFuZ2VkID0gb3B0cy5vbllDaGFuZ2VkXG5cbiMgXHRpZiBvcHRzLmhhc093blByb3BlcnR5KFwib25TdGlja0NoYW5nZWRcIilcbiMgXHRcdGl0ZW0ub25TdGlja0NoYW5nZWQgPSBvcHRzLm9uU3RpY2tDaGFuZ2VkXG5cblxuIyBcdGV4cG9ydHMuY29vcmRpbmF0b3JMYXlvdXQuc2Nyb2xsaW5nQ2hpbGRyZW4ucHVzaChpdGVtKVxuIyBcdGV4cG9ydHMuY29vcmRpbmF0b3JMYXlvdXQuYWRkQ2hpbGQoaXRlbSlcblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG4iLCIjIEFkZCB0aGUgZm9sbG93aW5nIGxpbmUgdG8geW91ciBwcm9qZWN0IGluIEZyYW1lciBTdHVkaW8uIFxuIyBteU1vZHVsZSA9IHJlcXVpcmUgXCJteU1vZHVsZVwiXG4jIFJlZmVyZW5jZSB0aGUgY29udGVudHMgYnkgbmFtZSwgbGlrZSBteU1vZHVsZS5teUZ1bmN0aW9uKCkgb3IgbXlNb2R1bGUubXlWYXJcblxuZXhwb3J0cy5teVZhciA9IFwibXlWYXJpYWJsZVwiXG5cbmV4cG9ydHMubXlGdW5jdGlvbiA9IC0+XG5cdHByaW50IFwibXlGdW5jdGlvbiBpcyBydW5uaW5nXCJcblxuZXhwb3J0cy5teUFycmF5ID0gWzEsIDIsIDNdIiwiZGVmYXVsdHMgPSBcblx0Y29sb3I6IFwicmdiYSgwLDAsMCwwLjEpXCJcblx0c2hhZG93Q29sb3I6IFwicmdiYSgwLDAsMCwwLjMpXCJcblx0c2hhZG93Qmx1cjogMzBcblx0cmlwcGxlVGltZTogMC4zXG5cdGZhZGVUaW1lOiAwLjZcblxuZXhwb3J0cy5zZXREZWZhdWx0cyA9IChjb2xvciA9IGRlZmF1bHRzLmNvbG9yLCBzaGFkb3dDb2xvciA9IGRlZmF1bHRzLnNoYWRvd0NvbG9yLCBzaGFkb3dCbHVyID0gZGVmYXVsdHMuc2hhZG93Qmx1ciwgcmlwcGxlVGltZSA9IGRlZmF1bHRzLnJpcHBsZVRpbWUsIGZhZGVUaW1lID0gZGVmYXVsdHMuZmFkZVRpbWUpIC0+XG5cdGRlZmF1bHRzID0gXG5cdFx0Y29sb3I6IGNvbG9yXG5cdFx0c2hhZG93Q29sb3I6IHNoYWRvd0NvbG9yXG5cdFx0c2hhZG93Qmx1cjogc2hhZG93Qmx1clxuXHRcdHJpcHBsZVRpbWU6IHJpcHBsZVRpbWVcblx0XHRmYWRlVGltZTogZmFkZVRpbWVcblxuXG5leHBvcnRzLmFkZFJpcHBsZSA9IChsYXllciwgY29sb3IgPSBkZWZhdWx0cy5jb2xvciwgc2hhZG93Q29sb3IgPSBkZWZhdWx0cy5zaGFkb3dDb2xvciwgc2hhZG93Qmx1ciA9IGRlZmF1bHRzLnNoYWRvd0JsdXIpIC0+XG5cblx0bGF5ZXIuc2hhZG93Qmx1ciA9IDBcblx0bGF5ZXIuc2hhZG93Q29sb3IgPSBzaGFkb3dDb2xvclxuXG5cdGxheWVyLm9uVGFwIC0+XG5cdFx0cyA9IChsYXllci53aWR0aCoxLjUpLWxheWVyLmJvcmRlclJhZGl1c1xuXHRcdHJpcHBsZSA9IG5ldyBMYXllclxuXHRcdFx0eDogMFxuXHRcdFx0eTogMFxuXHRcdFx0d2lkdGg6IHNcblx0XHRcdGhlaWdodDogc1xuXHRcdFx0Ym9yZGVyUmFkaXVzOiBzLzJcblx0XHRcdGJhY2tncm91bmRDb2xvcjogY29sb3Jcblx0XHRcdHNjYWxlOiAwXG5cdFx0XHRvcGFjaXR5OiAwXG5cblx0XHRsYXllci5hZGRDaGlsZChyaXBwbGUpXG5cdFx0bGF5ZXIuY2xpcCA9IHRydWVcblx0XHRyaXBwbGUuY2VudGVyKClcblxuXHRcdHJpcHBsZU91dCA9IHJpcHBsZS5hbmltYXRlXG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRzY2FsZTogMSxcblx0XHRcdFx0b3BhY2l0eTogMSxcblx0XHRcdHRpbWU6IGRlZmF1bHRzLnJpcHBsZVRpbWVcblxuXHRcdGxheWVyLmFuaW1hdGUgXG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRzaGFkb3dCbHVyOiBzaGFkb3dCbHVyXG5cdFx0XHR0aW1lOiBkZWZhdWx0cy5yaXBwbGVUaW1lXG5cblx0XHRyaXBwbGVPdXQub24gXCJlbmRcIiwgLT5cblx0XHRcdHJpcHBsZUZhZGUgPSByaXBwbGUuYW5pbWF0ZVxuXHRcdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRcdG9wYWNpdHk6IDAsXG5cdFx0XHRcdHRpbWU6IGRlZmF1bHRzLmZhZGVUaW1lXG5cblx0XHRcdGxheWVyLmFuaW1hdGUgXG5cdFx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdFx0c2hhZG93Qmx1cjogMFxuXHRcdFx0XHR0aW1lOiBkZWZhdWx0cy5mYWRlVGltZVxuXG5cdFx0XHRyaXBwbGVGYWRlLm9uIFwiZW5kXCIsIC0+XG5cdFx0XHRcdHJpcHBsZS5kZXN0cm95KClcblxuXG5cbiJdfQ==
