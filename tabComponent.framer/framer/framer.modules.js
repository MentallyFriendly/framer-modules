require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"AnimatedPages":[function(require,module,exports){
var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

exports.AnimatedPages = (function(superClass) {
  extend(AnimatedPages, superClass);

  AnimatedPages.prototype.selectedIndex = 0;

  AnimatedPages.prototype.defaultInAnimation = {
    properties: {
      opacity: 1,
      y: 0
    },
    time: 0.3
  };

  AnimatedPages.prototype.defaultOutAnimation = {
    properties: {
      opacity: 0,
      y: -AnimatedPages.height / 5
    },
    time: 0.3
  };

  function AnimatedPages(options) {
    if (options == null) {
      options = {};
    }
    AnimatedPages.__super__.constructor.call(this, options);
    this.pages = options.pages;
    this.makePages();
    this.selectPage(0);
  }

  AnimatedPages.prototype.makePages = function() {
    return this.pages.forEach((function(_this) {
      return function(page, i) {
        page.x = 0;
        page.y = 0;
        page.opacity = 0;
        page.visible = false;
        _this.setAnimationsForPage(page, _this.defaultInAnimation, _this.defaultOutAnimation);
        return _this.addChild(page);
      };
    })(this));
  };

  AnimatedPages.prototype.setAnimationsForPage = function(page, inAnimationObj, outAnimationObj) {
    var inAnimation, outAnimation;
    inAnimation = new Animation({
      layer: page,
      properties: inAnimationObj.properties,
      time: inAnimationObj.time
    });
    outAnimation = new Animation({
      layer: page,
      properties: outAnimationObj.properties,
      time: outAnimationObj.time
    });
    inAnimation.on(Events.AnimationStart, function() {
      return this._target.visible = true;
    });
    outAnimation.on(Events.AnimationEnd, function() {
      return this._target.visible = false;
    });
    page.inAnimation = inAnimation;
    return page.outAnimation = outAnimation;
  };

  AnimatedPages.prototype.selectPage = function(pageIndex) {
    var inPage, outPage;
    outPage = this.pages[this.selectedIndex];
    inPage = this.pages[pageIndex];
    console.log(inPage);
    outPage.outAnimation.start();
    inPage.inAnimation.start();
    this.selectedIndex = pageIndex;
    return this.emit("pages:change:page", this.selectedIndex);
  };

  return AnimatedPages;

})(Layer);


},{}],"CoordinatorLayout":[function(require,module,exports){
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


},{}],"TabComponent":[function(require,module,exports){
var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

exports.TabComponent = (function(superClass) {
  extend(TabComponent, superClass);

  TabComponent.prototype.tabs = [];

  TabComponent.prototype.indicatorHeight = 8;

  TabComponent.prototype.indicatorColor = "#FFF";

  TabComponent.prototype.selectedIndex = 0;

  function TabComponent(options) {
    if (options == null) {
      options = {};
    }
    TabComponent.__super__.constructor.call(this, options);
    this.tabs = options.tabs;
    this.scrollview = this.makeScroll();
    this.populateTabs();
    if (options.hasOwnProperty("indicatorHeight")) {
      this.indicatorHeight = options.indicatorHeight;
    }
    if (options.hasOwnProperty("indicatorColor")) {
      this.indicatorColor = options.indicatorColor;
    }
    this.indicator = this.makeIndicator();
  }

  TabComponent.prototype.makeScroll = function() {
    var scrollview;
    scrollview = new ScrollComponent({
      frame: this.frame,
      scrollVertical: false,
      scrollHorizontal: true,
      name: "tabScrollview",
      parent: this
    });
    return scrollview;
  };

  TabComponent.prototype.makeIndicator = function() {
    var indicator;
    indicator = new Layer({
      x: 0,
      y: this.height - this.indicatorHeight,
      width: this.tabs[this.selectedIndex].width,
      height: this.indicatorHeight,
      backgroundColor: this.indicatorColor,
      parent: this.scrollview.content
    });
    return indicator;
  };

  TabComponent.prototype.populateTabs = function() {
    var x;
    x = 0;
    return this.tabs.forEach((function(_this) {
      return function(tab, i) {
        tab.x = x;
        tab.tabIndex = i;
        tab.onTap(function() {
          return _this.selectTab(tab.tabIndex);
        });
        _this.scrollview.content.addChild(tab);
        return x = x + tab.width;
      };
    })(this));
  };

  TabComponent.prototype.selectTab = function(tabIndex) {
    var tab;
    this.selectedIndex = tabIndex;
    tab = this.tabs[this.selectedIndex];
    this.scrollview.scrollToLayer(tab, 0.5, 0.5, {
      time: 0.2
    });
    print(tab.x, this.scrollview.scrollX);
    this.indicator.animate({
      properties: {
        width: tab.width,
        x: tab.x
      },
      time: 0.2
    });
    return this.emit("tabs:change:tab", this.selectedIndex);
  };

  return TabComponent;

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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMveWFzaW4vU2l0ZXMvRnJhbWVyIE1vZHVsZXMvdGFiQ29tcG9uZW50LmZyYW1lci9tb2R1bGVzL0FuaW1hdGVkUGFnZXMuY29mZmVlIiwiL1VzZXJzL3lhc2luL1NpdGVzL0ZyYW1lciBNb2R1bGVzL3RhYkNvbXBvbmVudC5mcmFtZXIvbW9kdWxlcy9Db29yZGluYXRvckxheW91dC5jb2ZmZWUiLCIvVXNlcnMveWFzaW4vU2l0ZXMvRnJhbWVyIE1vZHVsZXMvdGFiQ29tcG9uZW50LmZyYW1lci9tb2R1bGVzL1RhYkNvbXBvbmVudC5jb2ZmZWUiLCIvVXNlcnMveWFzaW4vU2l0ZXMvRnJhbWVyIE1vZHVsZXMvdGFiQ29tcG9uZW50LmZyYW1lci9tb2R1bGVzL215TW9kdWxlLmNvZmZlZSIsIi9Vc2Vycy95YXNpbi9TaXRlcy9GcmFtZXIgTW9kdWxlcy90YWJDb21wb25lbnQuZnJhbWVyL21vZHVsZXMvcmlwcGxlQnV0dG9uLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0NBLElBQUE7OztBQUFNLE9BQU8sQ0FBQzs7OzBCQUNiLGFBQUEsR0FBYzs7MEJBQ2Qsa0JBQUEsR0FDQztJQUFBLFVBQUEsRUFDQztNQUFBLE9BQUEsRUFBUSxDQUFSO01BQ0EsQ0FBQSxFQUFFLENBREY7S0FERDtJQUdBLElBQUEsRUFBSyxHQUhMOzs7MEJBS0QsbUJBQUEsR0FDQztJQUFBLFVBQUEsRUFDQztNQUFBLE9BQUEsRUFBUSxDQUFSO01BQ0EsQ0FBQSxFQUFFLENBQUMsYUFBSSxDQUFDLE1BQU4sR0FBYSxDQURmO0tBREQ7SUFHQSxJQUFBLEVBQUssR0FITDs7O0VBS1ksdUJBQUMsT0FBRDs7TUFBQyxVQUFROztJQUNyQiwrQ0FBTSxPQUFOO0lBR0EsSUFBSSxDQUFDLEtBQUwsR0FBYSxPQUFPLENBQUM7SUFDckIsSUFBSSxDQUFDLFNBQUwsQ0FBQTtJQUNBLElBQUks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QUNBLEtBQUssQ0FBQyxJQUFOLEdBQWE7SUFDYixNQUFNLENBQUMsTUFBUCxDQUFBO0lBRUEsU0FBQSxHQUFZLE1BQU0sQ0FBQyxPQUFQLENBQ1g7TUFBQSxVQUFBLEVBQ0M7UUFBQSxLQUFBLEVBQU8sQ0FBUDtRQUNBLE9BQUEsRUFBUyxDQURUO09BREQ7TUFHQSxJQUFBLEVBQU0sUUFBUSxDQUFDLFVBSGY7S0FEVztJQU1aLEtBQUssQ0FBQyxPQUFOLENBQ0M7TUFBQSxVQUFBLEVBQ0M7UUFBQSxVQUFBLEVBQVksVUFBWjtPQUREO01BRUEsSUFBQSxFQUFNLFFBQVEsQ0FBQyxVQUZmO0tBREQ7V0FLQSxTQUFTLENBQUMsRUFBVixDQUFhLEtBQWIsRUFBb0IsU0FBQTtBQUNuQixVQUFBO01BQUEsVUFBQSxHQUFhLE1BQU0sQ0FBQyxPQUFQLENBQ1o7UUFBQSxVQUFBLEVBQ0M7VUFBQSxPQUFBLEVBQVMsQ0FBVDtTQUREO1FBRUEsSUFBQSxFQUFNLFFBQVEsQ0FBQyxRQUZmO09BRFk7TUFLYixLQUFLLENBQUMsT0FBTixDQUNDO1FBQUEsVUFBQSxFQUNDO1VBQUEsVUFBQSxFQUFZLENBQVo7U0FERDtRQUVBLElBQUEsRUFBTSxRQUFRLENBQUMsUUFGZjtPQUREO2FBS0EsVUFBVSxDQUFDLEVBQVgsQ0FBYyxLQUFkLEVBQXFCLFNBQUE7ZUFDcEIsTUFBTSxDQUFDLE9BQVAsQ0FBQTtNQURvQixDQUFyQjtJQVhtQixDQUFwQjtFQTNCVyxDQUFaO0FBTG1CIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlxuY2xhc3MgZXhwb3J0cy5BbmltYXRlZFBhZ2VzIGV4dGVuZHMgTGF5ZXJcblx0c2VsZWN0ZWRJbmRleDowXG5cdGRlZmF1bHRJbkFuaW1hdGlvbjpcblx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0b3BhY2l0eToxXG5cdFx0XHR5OjBcblx0XHR0aW1lOjAuM1xuXG5cdGRlZmF1bHRPdXRBbmltYXRpb246XG5cdFx0cHJvcGVydGllczpcblx0XHRcdG9wYWNpdHk6MFxuXHRcdFx0eTotdGhpcy5oZWlnaHQvNVxuXHRcdHRpbWU6MC4zXG5cblx0Y29uc3RydWN0b3I6IChvcHRpb25zPXt9KSAtPlxuXHRcdHN1cGVyKG9wdGlvbnMpXG5cblxuXHRcdHRoaXMucGFnZXMgPSBvcHRpb25zLnBhZ2VzXG5cdFx0dGhpcy5tYWtlUGFnZXMoKVxuXHRcdHRoaXMuc2VsZWN0UGFnZSgwKVxuXG5cblx0bWFrZVBhZ2VzOigpLT5cblx0XHR0aGlzLnBhZ2VzLmZvckVhY2ggKHBhZ2UsIGkpID0+XG5cdFx0XHRwYWdlLnggPSAwXG5cdFx0XHRwYWdlLnkgPSAwXG5cdFx0XHRwYWdlLm9wYWNpdHkgPSAwXG5cdFx0XHRwYWdlLnZpc2libGUgPSBmYWxzZTtcblx0XHRcdHRoaXMuc2V0QW5pbWF0aW9uc0ZvclBhZ2UocGFnZSwgdGhpcy5kZWZhdWx0SW5BbmltYXRpb24sIHRoaXMuZGVmYXVsdE91dEFuaW1hdGlvbilcblx0XHRcdHRoaXMuYWRkQ2hpbGQocGFnZSlcblxuXG5cdHNldEFuaW1hdGlvbnNGb3JQYWdlOihwYWdlLCBpbkFuaW1hdGlvbk9iaiwgb3V0QW5pbWF0aW9uT2JqKSAtPlxuXHRcdGluQW5pbWF0aW9uID0gbmV3IEFuaW1hdGlvblxuXHRcdFx0bGF5ZXI6cGFnZVxuXHRcdFx0cHJvcGVydGllczppbkFuaW1hdGlvbk9iai5wcm9wZXJ0aWVzXG5cdFx0XHR0aW1lOmluQW5pbWF0aW9uT2JqLnRpbWVcblxuXHRcdG91dEFuaW1hdGlvbiA9IG5ldyBBbmltYXRpb25cblx0XHRcdGxheWVyOnBhZ2Vcblx0XHRcdHByb3BlcnRpZXM6b3V0QW5pbWF0aW9uT2JqLnByb3BlcnRpZXNcblx0XHRcdHRpbWU6b3V0QW5pbWF0aW9uT2JqLnRpbWVcblxuXHRcdFxuXHRcdGluQW5pbWF0aW9uLm9uIEV2ZW50cy5BbmltYXRpb25TdGFydCwgKCkgLT5cblx0XHRcdHRoaXMuX3RhcmdldC52aXNpYmxlID0gdHJ1ZTtcblxuXHRcdG91dEFuaW1hdGlvbi5vbiBFdmVudHMuQW5pbWF0aW9uRW5kLCAoKSAtPlxuXHRcdFx0dGhpcy5fdGFyZ2V0LnZpc2libGUgPSBmYWxzZTtcblxuXHRcdHBhZ2UuaW5BbmltYXRpb24gPSBpbkFuaW1hdGlvblxuXHRcdHBhZ2Uub3V0QW5pbWF0aW9uID0gb3V0QW5pbWF0aW9uXG5cblxuXHRzZWxlY3RQYWdlOihwYWdlSW5kZXgpLT5cblxuXHRcdG91dFBhZ2UgPSB0aGlzLnBhZ2VzW3RoaXMuc2VsZWN0ZWRJbmRleF1cblx0XHRpblBhZ2UgPSB0aGlzLnBhZ2VzW3BhZ2VJbmRleF1cblxuXHRcdGNvbnNvbGUubG9nKGluUGFnZSlcblxuXHRcdG91dFBhZ2Uub3V0QW5pbWF0aW9uLnN0YXJ0KCk7XG5cdFx0aW5QYWdlLmluQW5pbWF0aW9uLnN0YXJ0KCk7XG5cblx0XHR0aGlzLnNlbGVjdGVkSW5kZXggPSBwYWdlSW5kZXhcblx0XHR0aGlzLmVtaXQoXCJwYWdlczpjaGFuZ2U6cGFnZVwiLCB0aGlzLnNlbGVjdGVkSW5kZXgpIiwiXG5cbmNsYXNzIGV4cG9ydHMuQ29vcmRpbmF0b3JMYXlvdXQgZXh0ZW5kcyBMYXllclxuXHRkZXBlbmRhbnRDaGlsZHJlbjpbXVxuXHRkaXJlY3Rpb25zOlxuXHRcdFVQOlwidXBcIlxuXHRcdERPV046XCJkb3duXCJcblxuXHRiZWhhdmlvdXJzOlxuXHRcdEFXQVk6XCJhd2F5XCJcblx0XHRSRVRVUk46XCJyZXR1cm5cIlxuXG5cdGRlZmF1bHRPcHRzOlxuXHRcdHNjcm9sbERpcmVjdGlvbjogXCJ1cFwiXG5cdFx0c3RpY2t5WTogXCJhdXRvXCJcblx0XHRzY3JvbGxCZWhhdmlvdXI6IFwiYXdheVwiXG5cdFx0cmV0dXJuWTogMFxuXG5cdGxhc3RZOiAwXG5cblx0Y29uc3RydWN0b3I6IChvcHRpb25zPXt9KSAtPlxuXHRcdF90aGlzID0gdGhpc1xuXHRcdHN1cGVyKG9wdGlvbnMpXG5cdFx0X3RoaXMuc2Nyb2xsdmlldyA9IF90aGlzLm1ha2VTY3JvbGwoKTtcblx0XHRfdGhpcy5jb250ZW50ID0gX3RoaXMuc2Nyb2xsdmlldy5jb250ZW50XG5cdFx0X3RoaXMuY29udGVudC5vbiBcImNoYW5nZTp5XCIsIC0+XG5cdFx0XHRfdGhpcy5vblNjcm9sbChfdGhpcylcblx0XHRcblxuXG5cdG1ha2VTY3JvbGw6IC0+XG5cdFx0c2Nyb2xsdmlldyA9IG5ldyBTY3JvbGxDb21wb25lbnRcblx0XHRcdGZyYW1lOiB0aGlzLmZyYW1lXG5cdFx0XHRzY3JvbGxIb3Jpem9udGFsOiBmYWxzZVxuXHRcdFx0bmFtZTogXCJjb29yZGluYXRvclNjcm9sbHZpZXdcIlxuXHRcdFx0cGFyZW50OiB0aGlzXG5cblx0XHQjIHRoaXMgPSB0aGlzXG5cdFx0XG5cdFx0cmV0dXJuIHNjcm9sbHZpZXdcblxuXG5cblx0b25TY3JvbGw6KF90aGlzKSAtPlxuXHRcdHNjcm9sbFkgPSBNYXRoLm1heChNYXRoLm1pbihfdGhpcy5zY3JvbGx2aWV3LnNjcm9sbFksIF90aGlzLnNjcm9sbHZpZXcuY29udGVudC5oZWlnaHQtX3RoaXMuc2Nyb2xsdmlldy5oZWlnaHQpLCAwKVxuXHRcdGRlbHRhWSA9IHNjcm9sbFkgLSBfdGhpcy5sYXN0WTtcblxuXHRcdGZvciBsYXllciBpbiBfdGhpcy5kZXBlbmRhbnRDaGlsZHJlblxuXG5cdFx0XHRpZiBsYXllci5zY3JvbGxEaXJlY3Rpb24gPT0gX3RoaXMuZGlyZWN0aW9ucy5VUCAmJiBsYXllci5zY3JvbGxCZWhhdmlvdXIgPT0gX3RoaXMuYmVoYXZpb3Vycy5SRVRVUk5cblx0XHRcdFx0bGF5ZXIueSA9IE1hdGgubWluKE1hdGgubWF4KGxheWVyLnktZGVsdGFZLCBsYXllci5zdGlja3lZKSwgTWF0aC5tYXgoLXNjcm9sbFkrbGF5ZXIuc3RhcnRZLCBsYXllci5yZXR1cm5ZKSlcblxuXHRcdFx0ZWxzZSBpZiBsYXllci5zY3JvbGxEaXJlY3Rpb24gPT0gX3RoaXMuZGlyZWN0aW9ucy5VUCAmJiBsYXllci5zY3JvbGxCZWhhdmlvdXIgPT0gX3RoaXMuYmVoYXZpb3Vycy5BV0FZXG5cdFx0XHRcdGxheWVyLnkgPSBNYXRoLm1heCgtc2Nyb2xsWStsYXllci5zdGFydFksIGxheWVyLnN0aWNreVkpXHRcblxuXHRcdFx0ZWxzZSBpZiBsYXllci5zY3JvbGxEaXJlY3Rpb24gPT0gX3RoaXMuZGlyZWN0aW9ucy5ET1dOICAmJiBsYXllci5zY3JvbGxCZWhhdmlvdXIgPT0gX3RoaXMuYmVoYXZpb3Vycy5SRVRVUk5cblx0XHRcdFx0bGF5ZXIueSA9IE1hdGgubWF4KE1hdGgubWluKGxheWVyLnkrZGVsdGFZLCBsYXllci5zdGlja3lZKSwgTWF0aC5taW4oc2Nyb2xsWStsYXllci5zdGFydFksIGxheWVyLnJldHVyblkpKVx0XG5cblx0XHRcdGVsc2UgaWYgbGF5ZXIuc2Nyb2xsRGlyZWN0aW9uID09IF90aGlzLmRpcmVjdGlvbnMuRE9XTiAmJiBsYXllci5zY3JvbGxCZWhhdmlvdXIgPT0gX3RoaXMuYmVoYXZpb3Vycy5BV0FZXG5cdFx0XHRcdGxheWVyLnkgPSBNYXRoLm1pbihzY3JvbGxZK2xheWVyLnN0YXJ0WSwgbGF5ZXIuc3RpY2t5WSlcdFxuXG5cdFx0XHRcblx0XHRcdGxheWVyLmVtaXQoXCJjb29yZGluYXRlZENoaWxkOmNoYW5nZTp5XCIsIGxheWVyKVxuXG5cblx0XHRfdGhpcy5sYXN0WSA9IHNjcm9sbFlcblxuXG5cblx0Y2FsY3VsYXRlRGVmYXVsdFN0aWNreVk6KGxheWVyLCBkaXJlY3Rpb24pIC0+XG5cdFx0aWYgZGlyZWN0aW9uID09IHRoaXMuZGlyZWN0aW9ucy5VUFxuXHRcdFx0cmV0dXJuIGxheWVyLmhlaWdodCotMVxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiB0aGlzLmhlaWdodCBcblxuXG5cdGFkZERlcGVuZGFudENoaWxkOihsYXllciwgb3B0aW9ucz17fSkgLT5cblx0XHRmb3Iga2V5LCB2YWx1ZSBvZiB0aGlzLmRlZmF1bHRPcHRzXG5cdFx0XHRpZiAhb3B0aW9ucy5oYXNPd25Qcm9wZXJ0eShrZXkpXG5cdFx0XHRcdGlmIGtleSA9PSBcInN0aWNreVlcIiAmJiB2YWx1ZSA9PSBcImF1dG9cIlxuXHRcdFx0XHRcdG9wdGlvbnNba2V5XSA9IHRoaXMuY2FsY3VsYXRlRGVmYXVsdFN0aWNreVkobGF5ZXIsIG9wdGlvbnMuc2Nyb2xsRGlyZWN0aW9uKVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0b3B0aW9uc1trZXldID0gdmFsdWVcblxuXHRcdGxheWVyLnNjcm9sbERpcmVjdGlvbiA9IG9wdGlvbnMuc2Nyb2xsRGlyZWN0aW9uXG5cdFx0bGF5ZXIuc3RpY2t5WSA9IG9wdGlvbnMuc3RpY2t5WVxuXHRcdGxheWVyLnNjcm9sbEJlaGF2aW91ciA9IG9wdGlvbnMuc2Nyb2xsQmVoYXZpb3VyXG5cdFx0bGF5ZXIuc3RhcnRZID0gbGF5ZXIueVxuXHRcdGxheWVyLnJldHVyblkgPSBvcHRpb25zLnJldHVybllcblxuXHRcdHRoaXMuZGVwZW5kYW50Q2hpbGRyZW4ucHVzaChsYXllcilcblx0XHR0aGlzLmFkZENoaWxkKGxheWVyKVxuXG5cdFx0XG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuIiwiIyBBZGQgdGhlIGZvbGxvd2luZyBsaW5lIHRvIHlvdXIgcHJvamVjdCBpbiBGcmFtZXIgU3R1ZGlvLiBcbiMgbXlNb2R1bGUgPSByZXF1aXJlIFwibXlNb2R1bGVcIlxuIyBSZWZlcmVuY2UgdGhlIGNvbnRlbnRzIGJ5IG5hbWUsIGxpa2UgbXlNb2R1bGUubXlGdW5jdGlvbigpIG9yIG15TW9kdWxlLm15VmFyXG5cblxuXG5jbGFzcyBleHBvcnRzLlRhYkNvbXBvbmVudCBleHRlbmRzIExheWVyXG5cdHRhYnM6IFtdXG5cdGluZGljYXRvckhlaWdodDogOFxuXHRpbmRpY2F0b3JDb2xvcjogXCIjRkZGXCJcblx0c2VsZWN0ZWRJbmRleDogMFxuXG5cdGNvbnN0cnVjdG9yOiAob3B0aW9ucz17fSkgLT5cblx0XHRzdXBlcihvcHRpb25zKVxuXHRcdHRoaXMudGFicyA9IG9wdGlvbnMudGFic1xuXHRcdHRoaXMuc2Nyb2xsdmlldyA9IHRoaXMubWFrZVNjcm9sbCgpXG5cdFx0dGhpcy5wb3B1bGF0ZVRhYnMoKVxuXHRcdFxuXG5cdFx0aWYob3B0aW9ucy5oYXNPd25Qcm9wZXJ0eShcImluZGljYXRvckhlaWdodFwiKSlcblx0XHRcdHRoaXMuaW5kaWNhdG9ySGVpZ2h0ID0gb3B0aW9ucy5pbmRpY2F0b3JIZWlnaHRcblxuXHRcdGlmKG9wdGlvbnMuaGFzT3duUHJvcGVydHkoXCJpbmRpY2F0b3JDb2xvclwiKSlcblx0XHRcdHRoaXMuaW5kaWNhdG9yQ29sb3IgPSBvcHRpb25zLmluZGljYXRvckNvbG9yXG5cblx0XHR0aGlzLmluZGljYXRvciA9IHRoaXMubWFrZUluZGljYXRvcigpXG5cblx0bWFrZVNjcm9sbDogLT5cblx0XHRzY3JvbGx2aWV3ID0gbmV3IFNjcm9sbENvbXBvbmVudFxuXHRcdFx0ZnJhbWU6IHRoaXMuZnJhbWVcblx0XHRcdHNjcm9sbFZlcnRpY2FsOiBmYWxzZVxuXHRcdFx0c2Nyb2xsSG9yaXpvbnRhbDogdHJ1ZVxuXHRcdFx0bmFtZTogXCJ0YWJTY3JvbGx2aWV3XCJcblx0XHRcdHBhcmVudDogdGhpc1xuXHRcdFxuXHRcdHJldHVybiBzY3JvbGx2aWV3XG5cblx0bWFrZUluZGljYXRvcjogLT5cblx0XHRpbmRpY2F0b3IgPSBuZXcgTGF5ZXJcblx0XHRcdHg6MFxuXHRcdFx0eTp0aGlzLmhlaWdodC10aGlzLmluZGljYXRvckhlaWdodFxuXHRcdFx0d2lkdGg6dGhpcy50YWJzW3RoaXMuc2VsZWN0ZWRJbmRleF0ud2lkdGhcblx0XHRcdGhlaWdodDp0aGlzLmluZGljYXRvckhlaWdodFxuXHRcdFx0YmFja2dyb3VuZENvbG9yOnRoaXMuaW5kaWNhdG9yQ29sb3Jcblx0XHRcdHBhcmVudDogdGhpcy5zY3JvbGx2aWV3LmNvbnRlbnRcblx0XHRyZXR1cm4gaW5kaWNhdG9yXG5cblx0cG9wdWxhdGVUYWJzOiAtPlxuXHRcdHggPSAwXG5cdFx0dGhpcy50YWJzLmZvckVhY2ggKHRhYiwgaSkgPT5cblx0XHRcdHRhYi54ID0geFxuXHRcdFx0dGFiLnRhYkluZGV4ID0gaVxuXHRcdFx0dGFiLm9uVGFwID0+XG5cdFx0XHRcdHRoaXMuc2VsZWN0VGFiKHRhYi50YWJJbmRleClcblxuXHRcdFx0dGhpcy5zY3JvbGx2aWV3LmNvbnRlbnQuYWRkQ2hpbGQodGFiKVxuXHRcdFx0eCA9IHgrdGFiLndpZHRoXG5cblx0c2VsZWN0VGFiOih0YWJJbmRleCkgLT5cblx0XHR0aGlzLnNlbGVjdGVkSW5kZXggPSB0YWJJbmRleFxuXHRcdHRhYiA9IHRoaXMudGFic1t0aGlzLnNlbGVjdGVkSW5kZXhdXG5cdFx0dGhpcy5zY3JvbGx2aWV3LnNjcm9sbFRvTGF5ZXIodGFiLCAwLjUsIDAuNSwgdGltZTowLjIpXG5cblx0XHRwcmludCB0YWIueCwgdGhpcy5zY3JvbGx2aWV3LnNjcm9sbFhcblx0XHR0aGlzLmluZGljYXRvci5hbmltYXRlXG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHR3aWR0aDogdGFiLndpZHRoXG5cdFx0XHRcdHg6IHRhYi54XG5cdFx0XHR0aW1lOjAuMlxuXG5cblx0XHR0aGlzLmVtaXQoXCJ0YWJzOmNoYW5nZTp0YWJcIiwgdGhpcy5zZWxlY3RlZEluZGV4KVxuXG5cblxuIiwiIyBBZGQgdGhlIGZvbGxvd2luZyBsaW5lIHRvIHlvdXIgcHJvamVjdCBpbiBGcmFtZXIgU3R1ZGlvLiBcbiMgbXlNb2R1bGUgPSByZXF1aXJlIFwibXlNb2R1bGVcIlxuIyBSZWZlcmVuY2UgdGhlIGNvbnRlbnRzIGJ5IG5hbWUsIGxpa2UgbXlNb2R1bGUubXlGdW5jdGlvbigpIG9yIG15TW9kdWxlLm15VmFyXG5cbmV4cG9ydHMubXlWYXIgPSBcIm15VmFyaWFibGVcIlxuXG5leHBvcnRzLm15RnVuY3Rpb24gPSAtPlxuXHRwcmludCBcIm15RnVuY3Rpb24gaXMgcnVubmluZ1wiXG5cbmV4cG9ydHMubXlBcnJheSA9IFsxLCAyLCAzXSIsImRlZmF1bHRzID0gXG5cdGNvbG9yOiBcInJnYmEoMCwwLDAsMC4xKVwiXG5cdHNoYWRvd0NvbG9yOiBcInJnYmEoMCwwLDAsMC4zKVwiXG5cdHNoYWRvd0JsdXI6IDMwXG5cdHJpcHBsZVRpbWU6IDAuM1xuXHRmYWRlVGltZTogMC42XG5cbmV4cG9ydHMuc2V0RGVmYXVsdHMgPSAoY29sb3IgPSBkZWZhdWx0cy5jb2xvciwgc2hhZG93Q29sb3IgPSBkZWZhdWx0cy5zaGFkb3dDb2xvciwgc2hhZG93Qmx1ciA9IGRlZmF1bHRzLnNoYWRvd0JsdXIsIHJpcHBsZVRpbWUgPSBkZWZhdWx0cy5yaXBwbGVUaW1lLCBmYWRlVGltZSA9IGRlZmF1bHRzLmZhZGVUaW1lKSAtPlxuXHRkZWZhdWx0cyA9IFxuXHRcdGNvbG9yOiBjb2xvclxuXHRcdHNoYWRvd0NvbG9yOiBzaGFkb3dDb2xvclxuXHRcdHNoYWRvd0JsdXI6IHNoYWRvd0JsdXJcblx0XHRyaXBwbGVUaW1lOiByaXBwbGVUaW1lXG5cdFx0ZmFkZVRpbWU6IGZhZGVUaW1lXG5cblxuZXhwb3J0cy5hZGRSaXBwbGUgPSAobGF5ZXIsIGNvbG9yID0gZGVmYXVsdHMuY29sb3IsIHNoYWRvd0NvbG9yID0gZGVmYXVsdHMuc2hhZG93Q29sb3IsIHNoYWRvd0JsdXIgPSBkZWZhdWx0cy5zaGFkb3dCbHVyKSAtPlxuXG5cdGxheWVyLnNoYWRvd0JsdXIgPSAwXG5cdGxheWVyLnNoYWRvd0NvbG9yID0gc2hhZG93Q29sb3JcblxuXHRsYXllci5vblRhcCAtPlxuXHRcdHMgPSAobGF5ZXIud2lkdGgqMS41KS1sYXllci5ib3JkZXJSYWRpdXNcblx0XHRyaXBwbGUgPSBuZXcgTGF5ZXJcblx0XHRcdHg6IDBcblx0XHRcdHk6IDBcblx0XHRcdHdpZHRoOiBzXG5cdFx0XHRoZWlnaHQ6IHNcblx0XHRcdGJvcmRlclJhZGl1czogcy8yXG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IGNvbG9yXG5cdFx0XHRzY2FsZTogMFxuXHRcdFx0b3BhY2l0eTogMFxuXG5cdFx0bGF5ZXIuYWRkQ2hpbGQocmlwcGxlKVxuXHRcdGxheWVyLmNsaXAgPSB0cnVlXG5cdFx0cmlwcGxlLmNlbnRlcigpXG5cblx0XHRyaXBwbGVPdXQgPSByaXBwbGUuYW5pbWF0ZVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0c2NhbGU6IDEsXG5cdFx0XHRcdG9wYWNpdHk6IDEsXG5cdFx0XHR0aW1lOiBkZWZhdWx0cy5yaXBwbGVUaW1lXG5cblx0XHRsYXllci5hbmltYXRlIFxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0c2hhZG93Qmx1cjogc2hhZG93Qmx1clxuXHRcdFx0dGltZTogZGVmYXVsdHMucmlwcGxlVGltZVxuXG5cdFx0cmlwcGxlT3V0Lm9uIFwiZW5kXCIsIC0+XG5cdFx0XHRyaXBwbGVGYWRlID0gcmlwcGxlLmFuaW1hdGVcblx0XHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0XHRvcGFjaXR5OiAwLFxuXHRcdFx0XHR0aW1lOiBkZWZhdWx0cy5mYWRlVGltZVxuXG5cdFx0XHRsYXllci5hbmltYXRlIFxuXHRcdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRcdHNoYWRvd0JsdXI6IDBcblx0XHRcdFx0dGltZTogZGVmYXVsdHMuZmFkZVRpbWVcblxuXHRcdFx0cmlwcGxlRmFkZS5vbiBcImVuZFwiLCAtPlxuXHRcdFx0XHRyaXBwbGUuZGVzdHJveSgpXG5cblxuXG4iXX0=
