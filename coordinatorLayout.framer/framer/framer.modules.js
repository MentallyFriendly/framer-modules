require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"CoordinatorLayout":[function(require,module,exports){
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
      layer.emit("coordinatedChild:change:y", layer);
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMveWFzaW4vU2l0ZXMvRnJhbWVyIE1vZHVsZXMvY29vcmRpbmF0b3JMYXlvdXQuZnJhbWVyL21vZHVsZXMvQ29vcmRpbmF0b3JMYXlvdXQuY29mZmVlIiwiL1VzZXJzL3lhc2luL1NpdGVzL0ZyYW1lciBNb2R1bGVzL2Nvb3JkaW5hdG9yTGF5b3V0LmZyYW1lci9tb2R1bGVzL215TW9kdWxlLmNvZmZlZSIsIi9Vc2Vycy95YXNpbi9TaXRlcy9GcmFtZXIgTW9kdWxlcy9jb29yZGluYXRvckxheW91dC5mcmFtZXIvbW9kdWxlcy9yaXBwbGVCdXR0b24uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDRUEsSUFBQTs7O0FBQU0sT0FBTyxDQUFDOzs7OEJBQ2IsaUJBQUEsR0FBa0I7OzhCQUNsQixVQUFBLEdBQ0M7SUFBQSxFQUFBLEVBQUcsSUFBSDtJQUNBLElBQUEsRUFBSyxNQURMOzs7OEJBR0QsVUFBQSxHQUNDO0lBQUEsSUFBQSxFQUFLLE1BQUw7SUFDQSxNQUFBLEVBQU8sUUFEUDs7OzhCQUdELFdBQUEsR0FDQztJQUFBLGVBQUEsRUFBaUIsSUFBakI7SUFDQSxPQUFBLEVBQVMsTUFEVDtJQUVBLGVBQUEsRUFBaUIsTUFGakI7SUFHQSxPQUFBLEVBQVMsQ0FIVDs7OzhCQUtELEtBQUEsR0FBTzs7RUFFTSwyQkFBQyxPQUFEO0FBQ1osUUFBQTs7TUFEYSxVQUFROztJQUNyQixLQUFBLEdBQVE7SUFDUixtREFBTSxPQUFOO0lBQ0EsS0FBSyxDQUFDLFVBQU4sR0FBbUIsS0FBSyxDQUFDLFVBQU4sQ0FBQTtJQUNuQixLQUFLLENBQUMsT0FBTixHQUFnQixLQUFLLENBQUMsVUFBVSxDQUFDO0lBQ2pDLEtBQUssQ0FBQyxPQUFPLENBQUMsRUFBZCxDQUFpQixVQUFqQixFQUE2QixTQUFBO2FBQzVCLEtBQUssQ0FBQyxRQUFOLENBQWUsS0FBZjtJQUQ0QixD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LFVBQUEsRUFDQztRQUFBLEtBQUEsRUFBTyxDQUFQO1FBQ0EsT0FBQSxFQUFTLENBRFQ7T0FERDtNQUdBLElBQUEsRUFBTSxRQUFRLENBQUMsVUFIZjtLQURXO0lBTVosS0FBSyxDQUFDLE9BQU4sQ0FDQztNQUFBLFVBQUEsRUFDQztRQUFBLFVBQUEsRUFBWSxVQUFaO09BREQ7TUFFQSxJQUFBLEVBQU0sUUFBUSxDQUFDLFVBRmY7S0FERDtXQUtBLFNBQVMsQ0FBQyxFQUFWLENBQWEsS0FBYixFQUFvQixTQUFBO0FBQ25CLFVBQUE7TUFBQSxVQUFBLEdBQWEsTUFBTSxDQUFDLE9BQVAsQ0FDWjtRQUFBLFVBQUEsRUFDQztVQUFBLE9BQUEsRUFBUyxDQUFUO1NBREQ7UUFFQSxJQUFBLEVBQU0sUUFBUSxDQUFDLFFBRmY7T0FEWTtNQUtiLEtBQUssQ0FBQyxPQUFOLENBQ0M7UUFBQSxVQUFBLEVBQ0M7VUFBQSxVQUFBLEVBQVksQ0FBWjtTQUREO1FBRUEsSUFBQSxFQUFNLFFBQVEsQ0FBQyxRQUZmO09BREQ7YUFLQSxVQUFVLENBQUMsRUFBWCxDQUFjLEtBQWQsRUFBcUIsU0FBQTtlQUNwQixNQUFNLENBQUMsT0FBUCxDQUFBO01BRG9CLENBQXJCO0lBWG1CLENBQXBCO0VBM0JXLENBQVo7QUFMbUIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXG5cbmNsYXNzIGV4cG9ydHMuQ29vcmRpbmF0b3JMYXlvdXQgZXh0ZW5kcyBMYXllclxuXHRkZXBlbmRhbnRDaGlsZHJlbjpbXVxuXHRkaXJlY3Rpb25zOlxuXHRcdFVQOlwidXBcIlxuXHRcdERPV046XCJkb3duXCJcblxuXHRiZWhhdmlvdXJzOlxuXHRcdEFXQVk6XCJhd2F5XCJcblx0XHRSRVRVUk46XCJyZXR1cm5cIlxuXG5cdGRlZmF1bHRPcHRzOlxuXHRcdHNjcm9sbERpcmVjdGlvbjogXCJ1cFwiXG5cdFx0c3RpY2t5WTogXCJhdXRvXCJcblx0XHRzY3JvbGxCZWhhdmlvdXI6IFwiYXdheVwiXG5cdFx0cmV0dXJuWTogMFxuXG5cdGxhc3RZOiAwXG5cblx0Y29uc3RydWN0b3I6IChvcHRpb25zPXt9KSAtPlxuXHRcdF90aGlzID0gdGhpc1xuXHRcdHN1cGVyKG9wdGlvbnMpXG5cdFx0X3RoaXMuc2Nyb2xsdmlldyA9IF90aGlzLm1ha2VTY3JvbGwoKTtcblx0XHRfdGhpcy5jb250ZW50ID0gX3RoaXMuc2Nyb2xsdmlldy5jb250ZW50XG5cdFx0X3RoaXMuY29udGVudC5vbiBcImNoYW5nZTp5XCIsIC0+XG5cdFx0XHRfdGhpcy5vblNjcm9sbChfdGhpcylcblx0XHRcblxuXG5cdG1ha2VTY3JvbGw6IC0+XG5cdFx0c2Nyb2xsdmlldyA9IG5ldyBTY3JvbGxDb21wb25lbnRcblx0XHRcdGZyYW1lOiB0aGlzLmZyYW1lXG5cdFx0XHRzY3JvbGxIb3Jpem9udGFsOiBmYWxzZVxuXHRcdFx0bmFtZTogXCJjb29yZGluYXRvclNjcm9sbHZpZXdcIlxuXHRcdFx0cGFyZW50OiB0aGlzXG5cblx0XHQjIHRoaXMgPSB0aGlzXG5cdFx0XG5cdFx0cmV0dXJuIHNjcm9sbHZpZXdcblxuXG5cblx0b25TY3JvbGw6KF90aGlzKSAtPlxuXHRcdHNjcm9sbFkgPSBNYXRoLm1heChNYXRoLm1pbihfdGhpcy5zY3JvbGx2aWV3LnNjcm9sbFksIF90aGlzLnNjcm9sbHZpZXcuY29udGVudC5oZWlnaHQtX3RoaXMuc2Nyb2xsdmlldy5oZWlnaHQpLCAwKVxuXHRcdGRlbHRhWSA9IHNjcm9sbFkgLSBfdGhpcy5sYXN0WTtcblxuXHRcdGZvciBsYXllciBpbiBfdGhpcy5kZXBlbmRhbnRDaGlsZHJlblxuXG5cdFx0XHRpZiBsYXllci5zY3JvbGxEaXJlY3Rpb24gPT0gX3RoaXMuZGlyZWN0aW9ucy5VUCAmJiBsYXllci5zY3JvbGxCZWhhdmlvdXIgPT0gX3RoaXMuYmVoYXZpb3Vycy5SRVRVUk5cblx0XHRcdFx0bGF5ZXIueSA9IE1hdGgubWluKE1hdGgubWF4KGxheWVyLnktZGVsdGFZLCBsYXllci5zdGlja3lZKSwgTWF0aC5tYXgoLXNjcm9sbFkrbGF5ZXIuc3RhcnRZLCBsYXllci5yZXR1cm5ZKSlcblxuXHRcdFx0ZWxzZSBpZiBsYXllci5zY3JvbGxEaXJlY3Rpb24gPT0gX3RoaXMuZGlyZWN0aW9ucy5VUCAmJiBsYXllci5zY3JvbGxCZWhhdmlvdXIgPT0gX3RoaXMuYmVoYXZpb3Vycy5BV0FZXG5cdFx0XHRcdGxheWVyLnkgPSBNYXRoLm1heCgtc2Nyb2xsWStsYXllci5zdGFydFksIGxheWVyLnN0aWNreVkpXHRcblxuXHRcdFx0ZWxzZSBpZiBsYXllci5zY3JvbGxEaXJlY3Rpb24gPT0gX3RoaXMuZGlyZWN0aW9ucy5ET1dOICAmJiBsYXllci5zY3JvbGxCZWhhdmlvdXIgPT0gX3RoaXMuYmVoYXZpb3Vycy5SRVRVUk5cblx0XHRcdFx0bGF5ZXIueSA9IE1hdGgubWF4KE1hdGgubWluKGxheWVyLnkrZGVsdGFZLCBsYXllci5zdGlja3lZKSwgTWF0aC5taW4oc2Nyb2xsWStsYXllci5zdGFydFksIGxheWVyLnJldHVyblkpKVx0XG5cblx0XHRcdGVsc2UgaWYgbGF5ZXIuc2Nyb2xsRGlyZWN0aW9uID09IF90aGlzLmRpcmVjdGlvbnMuRE9XTiAmJiBsYXllci5zY3JvbGxCZWhhdmlvdXIgPT0gX3RoaXMuYmVoYXZpb3Vycy5BV0FZXG5cdFx0XHRcdGxheWVyLnkgPSBNYXRoLm1pbihzY3JvbGxZK2xheWVyLnN0YXJ0WSwgbGF5ZXIuc3RpY2t5WSlcdFxuXG5cdFx0XHRcblx0XHRcdGxheWVyLmVtaXQoXCJjb29yZGluYXRlZENoaWxkOmNoYW5nZTp5XCIsIGxheWVyKVxuXG5cblx0XHRfdGhpcy5sYXN0WSA9IHNjcm9sbFlcblxuXG5cblx0Y2FsY3VsYXRlRGVmYXVsdFN0aWNreVk6KGxheWVyLCBkaXJlY3Rpb24pIC0+XG5cdFx0aWYgZGlyZWN0aW9uID09IHRoaXMuZGlyZWN0aW9ucy5VUFxuXHRcdFx0cmV0dXJuIGxheWVyLmhlaWdodCotMVxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiB0aGlzLmhlaWdodCBcblxuXG5cdGFkZERlcGVuZGFudENoaWxkOihsYXllciwgb3B0aW9ucz17fSkgLT5cblx0XHRmb3Iga2V5LCB2YWx1ZSBvZiB0aGlzLmRlZmF1bHRPcHRzXG5cdFx0XHRpZiAhb3B0aW9ucy5oYXNPd25Qcm9wZXJ0eShrZXkpXG5cdFx0XHRcdGlmIGtleSA9PSBcInN0aWNreVlcIiAmJiB2YWx1ZSA9PSBcImF1dG9cIlxuXHRcdFx0XHRcdG9wdGlvbnNba2V5XSA9IHRoaXMuY2FsY3VsYXRlRGVmYXVsdFN0aWNreVkobGF5ZXIsIG9wdGlvbnMuc2Nyb2xsRGlyZWN0aW9uKVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0b3B0aW9uc1trZXldID0gdmFsdWVcblxuXHRcdGxheWVyLnNjcm9sbERpcmVjdGlvbiA9IG9wdGlvbnMuc2Nyb2xsRGlyZWN0aW9uXG5cdFx0bGF5ZXIuc3RpY2t5WSA9IG9wdGlvbnMuc3RpY2t5WVxuXHRcdGxheWVyLnNjcm9sbEJlaGF2aW91ciA9IG9wdGlvbnMuc2Nyb2xsQmVoYXZpb3VyXG5cdFx0bGF5ZXIuc3RhcnRZID0gbGF5ZXIueVxuXHRcdGxheWVyLnJldHVyblkgPSBvcHRpb25zLnJldHVybllcblxuXHRcdHRoaXMuZGVwZW5kYW50Q2hpbGRyZW4ucHVzaChsYXllcilcblx0XHR0aGlzLmFkZENoaWxkKGxheWVyKVxuXG5cdFx0XG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuIiwiIyBBZGQgdGhlIGZvbGxvd2luZyBsaW5lIHRvIHlvdXIgcHJvamVjdCBpbiBGcmFtZXIgU3R1ZGlvLiBcbiMgbXlNb2R1bGUgPSByZXF1aXJlIFwibXlNb2R1bGVcIlxuIyBSZWZlcmVuY2UgdGhlIGNvbnRlbnRzIGJ5IG5hbWUsIGxpa2UgbXlNb2R1bGUubXlGdW5jdGlvbigpIG9yIG15TW9kdWxlLm15VmFyXG5cbmV4cG9ydHMubXlWYXIgPSBcIm15VmFyaWFibGVcIlxuXG5leHBvcnRzLm15RnVuY3Rpb24gPSAtPlxuXHRwcmludCBcIm15RnVuY3Rpb24gaXMgcnVubmluZ1wiXG5cbmV4cG9ydHMubXlBcnJheSA9IFsxLCAyLCAzXSIsImRlZmF1bHRzID0gXG5cdGNvbG9yOiBcInJnYmEoMCwwLDAsMC4xKVwiXG5cdHNoYWRvd0NvbG9yOiBcInJnYmEoMCwwLDAsMC4zKVwiXG5cdHNoYWRvd0JsdXI6IDMwXG5cdHJpcHBsZVRpbWU6IDAuM1xuXHRmYWRlVGltZTogMC42XG5cbmV4cG9ydHMuc2V0RGVmYXVsdHMgPSAoY29sb3IgPSBkZWZhdWx0cy5jb2xvciwgc2hhZG93Q29sb3IgPSBkZWZhdWx0cy5zaGFkb3dDb2xvciwgc2hhZG93Qmx1ciA9IGRlZmF1bHRzLnNoYWRvd0JsdXIsIHJpcHBsZVRpbWUgPSBkZWZhdWx0cy5yaXBwbGVUaW1lLCBmYWRlVGltZSA9IGRlZmF1bHRzLmZhZGVUaW1lKSAtPlxuXHRkZWZhdWx0cyA9IFxuXHRcdGNvbG9yOiBjb2xvclxuXHRcdHNoYWRvd0NvbG9yOiBzaGFkb3dDb2xvclxuXHRcdHNoYWRvd0JsdXI6IHNoYWRvd0JsdXJcblx0XHRyaXBwbGVUaW1lOiByaXBwbGVUaW1lXG5cdFx0ZmFkZVRpbWU6IGZhZGVUaW1lXG5cblxuZXhwb3J0cy5hZGRSaXBwbGUgPSAobGF5ZXIsIGNvbG9yID0gZGVmYXVsdHMuY29sb3IsIHNoYWRvd0NvbG9yID0gZGVmYXVsdHMuc2hhZG93Q29sb3IsIHNoYWRvd0JsdXIgPSBkZWZhdWx0cy5zaGFkb3dCbHVyKSAtPlxuXG5cdGxheWVyLnNoYWRvd0JsdXIgPSAwXG5cdGxheWVyLnNoYWRvd0NvbG9yID0gc2hhZG93Q29sb3JcblxuXHRsYXllci5vblRhcCAtPlxuXHRcdHMgPSAobGF5ZXIud2lkdGgqMS41KS1sYXllci5ib3JkZXJSYWRpdXNcblx0XHRyaXBwbGUgPSBuZXcgTGF5ZXJcblx0XHRcdHg6IDBcblx0XHRcdHk6IDBcblx0XHRcdHdpZHRoOiBzXG5cdFx0XHRoZWlnaHQ6IHNcblx0XHRcdGJvcmRlclJhZGl1czogcy8yXG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IGNvbG9yXG5cdFx0XHRzY2FsZTogMFxuXHRcdFx0b3BhY2l0eTogMFxuXG5cdFx0bGF5ZXIuYWRkQ2hpbGQocmlwcGxlKVxuXHRcdGxheWVyLmNsaXAgPSB0cnVlXG5cdFx0cmlwcGxlLmNlbnRlcigpXG5cblx0XHRyaXBwbGVPdXQgPSByaXBwbGUuYW5pbWF0ZVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0c2NhbGU6IDEsXG5cdFx0XHRcdG9wYWNpdHk6IDEsXG5cdFx0XHR0aW1lOiBkZWZhdWx0cy5yaXBwbGVUaW1lXG5cblx0XHRsYXllci5hbmltYXRlIFxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0c2hhZG93Qmx1cjogc2hhZG93Qmx1clxuXHRcdFx0dGltZTogZGVmYXVsdHMucmlwcGxlVGltZVxuXG5cdFx0cmlwcGxlT3V0Lm9uIFwiZW5kXCIsIC0+XG5cdFx0XHRyaXBwbGVGYWRlID0gcmlwcGxlLmFuaW1hdGVcblx0XHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0XHRvcGFjaXR5OiAwLFxuXHRcdFx0XHR0aW1lOiBkZWZhdWx0cy5mYWRlVGltZVxuXG5cdFx0XHRsYXllci5hbmltYXRlIFxuXHRcdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRcdHNoYWRvd0JsdXI6IDBcblx0XHRcdFx0dGltZTogZGVmYXVsdHMuZmFkZVRpbWVcblxuXHRcdFx0cmlwcGxlRmFkZS5vbiBcImVuZFwiLCAtPlxuXHRcdFx0XHRyaXBwbGUuZGVzdHJveSgpXG5cblxuXG4iXX0=
