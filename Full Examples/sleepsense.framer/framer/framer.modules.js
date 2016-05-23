require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"AnimatedPages":[function(require,module,exports){
var animations,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

exports.animations = {
  slideRight: {
    "in": {
      x: 0
    },
    out: {
      x: Screen.width
    }
  },
  slideLeft: {
    "in": {
      x: 0
    },
    out: {
      x: -Screen.width
    }
  },
  slideUp: {
    "in": {
      y: 0
    },
    out: {
      y: -Screen.height
    }
  },
  slideDown: {
    "in": {
      y: 0
    },
    out: {
      y: Screen.height
    }
  },
  slideFadeRight: {
    "in": {
      x: 0,
      opacity: 1
    },
    out: {
      x: '20%',
      opacity: 0
    }
  },
  slideFadeLeft: {
    "in": {
      x: 0,
      opacity: 1
    },
    out: {
      x: '-20%',
      opacity: 0
    }
  },
  slideFadeUp: {
    "in": {
      y: 0,
      opacity: 1
    },
    out: {
      y: '-20%',
      opacity: 0
    }
  },
  slideFadeDown: {
    "in": {
      y: 0,
      opacity: 1
    },
    out: {
      y: '20%',
      opacity: 0
    }
  }
};

animations = exports.animations;

exports.AnimatedPages = (function(superClass) {
  extend(AnimatedPages, superClass);

  AnimatedPages.prototype.selectedIndex = 0;

  function AnimatedPages(options) {
    var layer;
    if (options == null) {
      options = {};
    }
    if (options.upgradeLayer) {
      layer = options.upgradeLayer;
      options.frame = layer.frame;
      options.name = layer.name;
      options.pages = layer.children;
      AnimatedPages.__super__.constructor.call(this, options);
      layer.parent.addChild(this);
      this.placeBehind(layer);
      layer.destroy();
    } else {
      AnimatedPages.__super__.constructor.call(this, options);
    }
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
        _this.setAnimationsForLayer(page, "slideFadeUp", "slideFadeDown");
        return _this.addChild(page);
      };
    })(this));
  };

  AnimatedPages.prototype.setAnimationsForLayer = function(layer, inAnimationName, outAnimationName) {
    var inAnimation, outAnimation;
    inAnimation = new Animation({
      layer: layer,
      properties: animations[inAnimationName]["in"],
      time: 0.3
    });
    outAnimation = new Animation({
      layer: layer,
      properties: animations[outAnimationName].out,
      time: 0.3
    });
    inAnimation.on(Events.AnimationStart, function() {
      return this._target.visible = true;
    });
    outAnimation.on(Events.AnimationEnd, function() {
      return this._target.visible = false;
    });
    layer.inAnimation = inAnimation;
    return layer.outAnimation = outAnimation;
  };

  AnimatedPages.prototype.selectPage = function(pageIndex) {
    var inPage, outPage;
    outPage = this.pages[this.selectedIndex];
    inPage = this.pages[pageIndex];
    console.log(inPage);
    outPage.outAnimation.start();
    inPage.inAnimation.start();
    this.height = inPage.height;
    this.selectedIndex = pageIndex;
    return this.emit("pages:change:page", this.selectedIndex);
  };

  AnimatedPages.prototype.animateChildren = function() {};

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
    returnY: 0,
    parallax: 1
  };

  CoordinatorLayout.prototype.parallaxVals = {
    slow: 0.3,
    mid: 0.6,
    fast: 0.9
  };

  CoordinatorLayout.prototype.lastY = 0;

  function CoordinatorLayout(options) {
    var _this, layer;
    if (options == null) {
      options = {};
    }
    _this = this;
    if (options.upgradeLayer) {
      layer = options.upgradeLayer;
      options.frame = layer.frame;
      options.name = layer.name;
      CoordinatorLayout.__super__.constructor.call(this, options);
      _this.scrollview = _this.makeScroll();
      _this.content = _this.scrollview.content;
      _this.populateUpgradedLayers(layer.children);
      layer.parent.addChild(this);
      this.placeBehind(layer);
      layer.destroy();
    } else {
      CoordinatorLayout.__super__.constructor.call(this, options);
      _this.scrollview = _this.makeScroll();
      _this.content = _this.scrollview.content;
    }
    _this.content.on("change:y", function() {
      return _this.onScroll(_this);
    });
  }

  CoordinatorLayout.prototype.populateUpgradedLayers = function(layers) {
    var child, content, i, j, k, layer, layerOpts, len, len1, len2, ref, results;
    for (i = 0, len = layers.length; i < len; i++) {
      layer = layers[i];
      layer.originalIndex = layer.index;
      if (layer.name.match(/^header/) || layer.name.match(/^footer/)) {
        layerOpts = {};
        if (layer.name.match(/^header/)) {
          layerOpts.scrollDirection = "up";
        } else if (layer.name.match(/^footer/)) {
          layerOpts.scrollDirection = "down";
        }
        if (layer.name.match(/-away/)) {
          layerOpts.scrollBehaviour = "away";
        } else if (layer.name.match(/-return/)) {
          layerOpts.scrollBehaviour = "return";
          if (layer.name.match(/-top/)) {
            layerOpts.returnY = 0;
          } else if (layer.name.match(/-bottom/)) {
            layerOpts.returnY = this.height - layer.height;
          } else if (layer.name.match(/-original/)) {
            layerOpts.returnY = layer.y;
          }
        }
        if (layer.name.match(/-parallax/)) {
          if (layer.name.match(/-parallax-slow/)) {
            layerOpts.parallax = this.parallaxVals.slow;
          }
          if (layer.name.match(/-parallax-mid/)) {
            layerOpts.parallax = this.parallaxVals.mid;
          }
          if (layer.name.match(/-parallax-fast/)) {
            layerOpts.parallax = this.parallaxVals.fast;
          }
        }
        this.addDependantChild(layer, layerOpts);
      } else if (layer.name.match(/^scroller/)) {
        content = layer.childrenWithName("content")[0];
        content.x = 0;
        content.y = 0;
        ref = content.children;
        for (j = 0, len1 = ref.length; j < len1; j++) {
          child = ref[j];
          this.content.addChild(child);
        }
        content.destroy();
      }
    }
    results = [];
    for (k = 0, len2 = layers.length; k < len2; k++) {
      layer = layers[k];
      if (layer.name.match(/^scroller/)) {
        results.push(this.scrollview.index = layer.originalIndex);
      } else {
        results.push(layer.index = layer.originalIndex);
      }
    }
    return results;
  };

  CoordinatorLayout.prototype.makeScroll = function() {
    var scrollview;
    scrollview = new ScrollComponent({
      size: this.size,
      scrollHorizontal: false,
      name: "coordinatorScrollview",
      parent: this
    });
    return scrollview;
  };

  CoordinatorLayout.prototype.onScroll = function(_this) {
    var deltaY, i, layer, len, ref, scrollY;
    ref = _this.dependantChildren;
    for (i = 0, len = ref.length; i < len; i++) {
      layer = ref[i];
      scrollY = _this.scrollview.scrollY * layer.parallax;
      deltaY = scrollY - _this.lastY;
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
    layer.parallax = options.parallax;
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
    var layer;
    if (options == null) {
      options = {};
    }
    if (options.upgradeLayer) {
      layer = options.upgradeLayer;
      options.frame = layer.frame;
      options.name = layer.name;
      options.tabs = layer.children;
      TabComponent.__super__.constructor.call(this, options);
      layer.parent.addChild(this);
      this.placeBehind(layer);
      layer.destroy();
    } else {
      TabComponent.__super__.constructor.call(this, options);
    }
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
      size: this.size,
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
    this.tabs.forEach((function(_this) {
      return function(tab, i) {
        if (tab.childrenWithName("active").length > 0 && tab.childrenWithName("inactive").length > 0) {
          tab.childrenWithName("active")[0].visible = false;
          tab.childrenWithName("inactive")[0].visible = true;
        }
        tab.x = x;
        tab.tabIndex = i;
        tab.onTap(function() {
          return _this.selectTab(tab.tabIndex);
        });
        _this.scrollview.content.addChild(tab);
        return x = x + tab.width;
      };
    })(this));
    if (this.scrollview.content.width <= this.width) {
      return this.scrollview.scrollHorizontal = false;
    }
  };

  TabComponent.prototype.selectTab = function(tabIndex) {
    var inTab, outTab;
    outTab = this.tabs[this.selectedIndex];
    inTab = this.tabs[tabIndex];
    this.scrollview.scrollToLayer(inTab, 0.5, 0.5, {
      time: 0.2
    });
    inTab.placeBehind(this.indicator);
    this.indicator.animate({
      properties: {
        width: inTab.width,
        x: inTab.x
      },
      time: 0.2
    });
    if (outTab.childrenWithName("active").length > 0 && outTab.childrenWithName("inactive").length > 0) {
      outTab.childrenWithName("active")[0].visible = false;
      outTab.childrenWithName("inactive")[0].visible = true;
    }
    if (inTab.childrenWithName("active").length > 0 && inTab.childrenWithName("inactive").length > 0) {
      inTab.childrenWithName("active")[0].visible = true;
      inTab.childrenWithName("inactive")[0].visible = false;
    }
    this.selectedIndex = tabIndex;
    return this.emit("tabs:change:tab", this.selectedIndex);
  };

  TabComponent.prototype.upgradeToTabComponent = function(layer) {
    return print("derp");
  };

  return TabComponent;

})(Layer);


},{}],"animations":[function(require,module,exports){
exports.animations = {
  slideRight: {
    "in": {
      x: 0
    },
    out: {
      x: Screen.width
    }
  },
  slideLeft: {
    "in": {
      x: 0
    },
    out: {
      x: -Screen.width
    }
  },
  slideUp: {
    "in": {
      y: 0
    },
    out: {
      y: -Screen.height
    }
  },
  slideDown: {
    "in": {
      y: 0
    },
    out: {
      y: Screen.height
    }
  },
  slideFadeRight: {
    "in": {
      x: 0,
      opacity: 1
    },
    out: {
      x: '20%',
      opacity: 0
    }
  },
  slideFadeLeft: {
    "in": {
      x: 0,
      opacity: 1
    },
    out: {
      x: '-20%',
      opacity: 0
    }
  },
  slideFadeUp: {
    "in": {
      y: 0,
      opacity: 1
    },
    out: {
      y: '-20%',
      opacity: 0
    }
  },
  slideFadeDown: {
    "in": {
      y: 0,
      opacity: 1
    },
    out: {
      y: '20%',
      opacity: 0
    }
  }
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMveWFzaW4vU2l0ZXMvRnJhbWVyIE1vZHVsZXMvRnVsbCBFeGFtcGxlcy9zbGVlcHNlbnNlLmZyYW1lci9tb2R1bGVzL0FuaW1hdGVkUGFnZXMuY29mZmVlIiwiL1VzZXJzL3lhc2luL1NpdGVzL0ZyYW1lciBNb2R1bGVzL0Z1bGwgRXhhbXBsZXMvc2xlZXBzZW5zZS5mcmFtZXIvbW9kdWxlcy9Db29yZGluYXRvckxheW91dC5jb2ZmZWUiLCIvVXNlcnMveWFzaW4vU2l0ZXMvRnJhbWVyIE1vZHVsZXMvRnVsbCBFeGFtcGxlcy9zbGVlcHNlbnNlLmZyYW1lci9tb2R1bGVzL1RhYkNvbXBvbmVudC5jb2ZmZWUiLCIvVXNlcnMveWFzaW4vU2l0ZXMvRnJhbWVyIE1vZHVsZXMvRnVsbCBFeGFtcGxlcy9zbGVlcHNlbnNlLmZyYW1lci9tb2R1bGVzL2FuaW1hdGlvbnMuY29mZmVlIiwiL1VzZXJzL3lhc2luL1NpdGVzL0ZyYW1lciBNb2R1bGVzL0Z1bGwgRXhhbXBsZXMvc2xlZXBzZW5zZS5mcmFtZXIvbW9kdWxlcy9teU1vZHVsZS5jb2ZmZWUiLCIvVXNlcnMveWFzaW4vU2l0ZXMvRnJhbWVyIE1vZHVsZXMvRnVsbCBFeGFtcGxlcy9zbGVlcHNlbnNlLmZyYW1lci9tb2R1bGVzL3JpcHBsZUJ1dHRvbi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxJQUFBLFVBQUE7RUFBQTs7O0FBQUEsT0FBTyxDQUFDLFVBQVIsR0FDQztFQUFBLFVBQUEsRUFDQztJQUFBLElBQUEsRUFDQztNQUFBLENBQUEsRUFBRSxDQUFGO0tBREQ7SUFFQSxHQUFBLEVBQ0M7TUFBQSxDQUFBLEVBQUUsTUFBTSxDQUFDLEtBQVQ7S0FIRDtHQUREO0VBTUEsU0FBQSxFQUNDO0lBQUEsSUFBQSxFQUNDO01BQUEsQ0FBQSxFQUFFLENBQUY7S0FERDtJQUVBLEdBQUEsRUFDQztNQUFB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Q0FBQyxPQUFQLENBQ1o7UUFBQSxVQUFBLEVBQ0M7VUFBQSxPQUFBLEVBQVMsQ0FBVDtTQUREO1FBRUEsSUFBQSxFQUFNLFFBQVEsQ0FBQyxRQUZmO09BRFk7TUFLYixLQUFLLENBQUMsT0FBTixDQUNDO1FBQUEsVUFBQSxFQUNDO1VBQUEsVUFBQSxFQUFZLENBQVo7U0FERDtRQUVBLElBQUEsRUFBTSxRQUFRLENBQUMsUUFGZjtPQUREO2FBS0EsVUFBVSxDQUFDLEVBQVgsQ0FBYyxLQUFkLEVBQXFCLFNBQUE7ZUFDcEIsTUFBTSxDQUFDLE9BQVAsQ0FBQTtNQURvQixDQUFyQjtJQVhtQixDQUFwQjtFQTNCVyxDQUFaO0FBTG1CIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImV4cG9ydHMuYW5pbWF0aW9ucyA9XG5cdHNsaWRlUmlnaHQ6XG5cdFx0aW46XG5cdFx0XHR4OjBcblx0XHRvdXQ6IFxuXHRcdFx0eDpTY3JlZW4ud2lkdGhcblxuXHRzbGlkZUxlZnQ6XG5cdFx0aW46XG5cdFx0XHR4OjBcblx0XHRvdXQ6IFxuXHRcdFx0eDotU2NyZWVuLndpZHRoXG5cblx0c2xpZGVVcDpcblx0XHRpbjpcblx0XHRcdHk6MFxuXHRcdG91dDogXG5cdFx0XHR5Oi1TY3JlZW4uaGVpZ2h0XG5cblx0c2xpZGVEb3duOlxuXHRcdGluOlxuXHRcdFx0eTowXG5cdFx0b3V0OiBcblx0XHRcdHk6U2NyZWVuLmhlaWdodFxuXG5cdHNsaWRlRmFkZVJpZ2h0OlxuXHRcdGluOlxuXHRcdFx0eDowXG5cdFx0XHRvcGFjaXR5OjFcblx0XHRvdXQ6IFxuXHRcdFx0eDonMjAlJ1xuXHRcdFx0b3BhY2l0eTowXG5cblx0c2xpZGVGYWRlTGVmdDpcblx0XHRpbjpcblx0XHRcdHg6MFxuXHRcdFx0b3BhY2l0eToxXG5cdFx0b3V0OiBcblx0XHRcdHg6Jy0yMCUnXG5cdFx0XHRvcGFjaXR5OjBcblxuXHRzbGlkZUZhZGVVcDpcblx0XHRpbjpcblx0XHRcdHk6MFxuXHRcdFx0b3BhY2l0eToxXG5cdFx0b3V0OiBcblx0XHRcdHk6Jy0yMCUnXG5cdFx0XHRvcGFjaXR5OjBcblxuXHRzbGlkZUZhZGVEb3duOlxuXHRcdGluOlxuXHRcdFx0eTowXG5cdFx0XHRvcGFjaXR5OjFcblx0XHRvdXQ6IFxuXHRcdFx0eTonMjAlJ1xuXHRcdFx0b3BhY2l0eTowXG5cblxuXG5hbmltYXRpb25zID0gZXhwb3J0cy5hbmltYXRpb25zXG5cblxuY2xhc3MgZXhwb3J0cy5BbmltYXRlZFBhZ2VzIGV4dGVuZHMgTGF5ZXJcblx0c2VsZWN0ZWRJbmRleDowXG5cdCMgZGVmYXVsdEluQW5pbWF0aW9uOlxuXHQjIFx0cHJvcGVydGllczpcblx0IyBcdFx0b3BhY2l0eToxXG5cdCMgXHRcdHk6MFxuXHQjIFx0dGltZTowLjNcblxuXHQjIGRlZmF1bHRPdXRBbmltYXRpb246XG5cdCMgXHRwcm9wZXJ0aWVzOlxuXHQjIFx0XHRvcGFjaXR5OjBcblx0IyBcdFx0eTonMzMlJ1xuXHQjIFx0dGltZTowLjNcblxuXG5cdGNvbnN0cnVjdG9yOiAob3B0aW9ucz17fSkgLT5cblx0XHRpZiBvcHRpb25zLnVwZ3JhZGVMYXllclxuXHRcdFx0bGF5ZXIgPSBvcHRpb25zLnVwZ3JhZGVMYXllclxuXHRcdFx0b3B0aW9ucy5mcmFtZSA9IGxheWVyLmZyYW1lXG5cdFx0XHRvcHRpb25zLm5hbWUgPSBsYXllci5uYW1lXG5cdFx0XHRvcHRpb25zLnBhZ2VzID0gbGF5ZXIuY2hpbGRyZW5cblx0XHRcdHN1cGVyKG9wdGlvbnMpXG5cdFx0XHRsYXllci5wYXJlbnQuYWRkQ2hpbGQodGhpcylcblx0XHRcdHRoaXMucGxhY2VCZWhpbmQobGF5ZXIpXG5cdFx0XHRsYXllci5kZXN0cm95KClcblx0XHRlbHNlXG5cdFx0XHRzdXBlcihvcHRpb25zKVxuXG5cblx0XHR0aGlzLnBhZ2VzID0gb3B0aW9ucy5wYWdlc1xuXHRcdHRoaXMubWFrZVBhZ2VzKClcblx0XHR0aGlzLnNlbGVjdFBhZ2UoMClcblxuXG5cdG1ha2VQYWdlczooKS0+XG5cdFx0dGhpcy5wYWdlcy5mb3JFYWNoIChwYWdlLCBpKSA9PlxuXHRcdFx0cGFnZS54ID0gMFxuXHRcdFx0cGFnZS55ID0gMFxuXHRcdFx0cGFnZS5vcGFjaXR5ID0gMFxuXHRcdFx0cGFnZS52aXNpYmxlID0gZmFsc2U7XG5cdFx0XHR0aGlzLnNldEFuaW1hdGlvbnNGb3JMYXllcihwYWdlLCBcInNsaWRlRmFkZVVwXCIsIFwic2xpZGVGYWRlRG93blwiKVxuXHRcdFx0dGhpcy5hZGRDaGlsZChwYWdlKVxuXG5cblx0c2V0QW5pbWF0aW9uc0ZvckxheWVyOihsYXllciwgaW5BbmltYXRpb25OYW1lLCBvdXRBbmltYXRpb25OYW1lKSAtPlxuXG5cdFx0aW5BbmltYXRpb24gPSBuZXcgQW5pbWF0aW9uXG5cdFx0XHRsYXllcjpsYXllclxuXHRcdFx0cHJvcGVydGllczphbmltYXRpb25zW2luQW5pbWF0aW9uTmFtZV0uaW5cblx0XHRcdHRpbWU6MC4zXG5cblx0XHRvdXRBbmltYXRpb24gPSBuZXcgQW5pbWF0aW9uXG5cdFx0XHRsYXllcjpsYXllclxuXHRcdFx0cHJvcGVydGllczphbmltYXRpb25zW291dEFuaW1hdGlvbk5hbWVdLm91dFxuXHRcdFx0dGltZTowLjNcblxuXHRcdFxuXHRcdGluQW5pbWF0aW9uLm9uIEV2ZW50cy5BbmltYXRpb25TdGFydCwgKCkgLT5cblx0XHRcdHRoaXMuX3RhcmdldC52aXNpYmxlID0gdHJ1ZTtcblxuXHRcdG91dEFuaW1hdGlvbi5vbiBFdmVudHMuQW5pbWF0aW9uRW5kLCAoKSAtPlxuXHRcdFx0dGhpcy5fdGFyZ2V0LnZpc2libGUgPSBmYWxzZTtcblxuXHRcdGxheWVyLmluQW5pbWF0aW9uID0gaW5BbmltYXRpb25cblx0XHRsYXllci5vdXRBbmltYXRpb24gPSBvdXRBbmltYXRpb25cblxuXG5cblxuXHRzZWxlY3RQYWdlOihwYWdlSW5kZXgpLT5cblxuXHRcdG91dFBhZ2UgPSB0aGlzLnBhZ2VzW3RoaXMuc2VsZWN0ZWRJbmRleF1cblx0XHRpblBhZ2UgPSB0aGlzLnBhZ2VzW3BhZ2VJbmRleF1cblxuXHRcdGNvbnNvbGUubG9nKGluUGFnZSlcblxuXHRcdG91dFBhZ2Uub3V0QW5pbWF0aW9uLnN0YXJ0KCk7XG5cdFx0aW5QYWdlLmluQW5pbWF0aW9uLnN0YXJ0KCk7XG5cdFx0dGhpcy5oZWlnaHQgPSBpblBhZ2UuaGVpZ2h0XG5cblx0XHR0aGlzLnNlbGVjdGVkSW5kZXggPSBwYWdlSW5kZXhcblx0XHR0aGlzLmVtaXQoXCJwYWdlczpjaGFuZ2U6cGFnZVwiLCB0aGlzLnNlbGVjdGVkSW5kZXgpXG5cblx0YW5pbWF0ZUNoaWxkcmVuOigpLT5cblxuXG4iLCJcblxuY2xhc3MgZXhwb3J0cy5Db29yZGluYXRvckxheW91dCBleHRlbmRzIExheWVyXG5cdGRlcGVuZGFudENoaWxkcmVuOltdXG5cdGRpcmVjdGlvbnM6XG5cdFx0VVA6XCJ1cFwiXG5cdFx0RE9XTjpcImRvd25cIlxuXG5cdGJlaGF2aW91cnM6XG5cdFx0QVdBWTpcImF3YXlcIlxuXHRcdFJFVFVSTjpcInJldHVyblwiXG5cblx0ZGVmYXVsdE9wdHM6XG5cdFx0c2Nyb2xsRGlyZWN0aW9uOiBcInVwXCJcblx0XHRzdGlja3lZOiBcImF1dG9cIlxuXHRcdHNjcm9sbEJlaGF2aW91cjogXCJhd2F5XCJcblx0XHRyZXR1cm5ZOiAwXG5cdFx0cGFyYWxsYXg6IDFcblxuXHRwYXJhbGxheFZhbHM6XG5cdFx0c2xvdzowLjNcblx0XHRtaWQ6MC42XG5cdFx0ZmFzdDowLjlcblxuXHRsYXN0WTogMFxuXG5cdGNvbnN0cnVjdG9yOiAob3B0aW9ucz17fSkgLT5cblx0XHRfdGhpcyA9IHRoaXNcblx0XHRpZiBvcHRpb25zLnVwZ3JhZGVMYXllclxuXHRcdFx0bGF5ZXIgPSBvcHRpb25zLnVwZ3JhZGVMYXllclxuXHRcdFx0b3B0aW9ucy5mcmFtZSA9IGxheWVyLmZyYW1lXG5cdFx0XHRvcHRpb25zLm5hbWUgPSBsYXllci5uYW1lXG5cdFx0XHRzdXBlcihvcHRpb25zKVxuXG5cdFx0XHRfdGhpcy5zY3JvbGx2aWV3ID0gX3RoaXMubWFrZVNjcm9sbCgpO1xuXHRcdFx0X3RoaXMuY29udGVudCA9IF90aGlzLnNjcm9sbHZpZXcuY29udGVudFxuXG5cdFx0XHRfdGhpcy5wb3B1bGF0ZVVwZ3JhZGVkTGF5ZXJzKGxheWVyLmNoaWxkcmVuKVxuXG5cdFx0XHRsYXllci5wYXJlbnQuYWRkQ2hpbGQodGhpcylcblx0XHRcdHRoaXMucGxhY2VCZWhpbmQobGF5ZXIpXG5cdFx0XHRsYXllci5kZXN0cm95KClcblx0XHRlbHNlXG5cdFx0XHRzdXBlcihvcHRpb25zKVxuXHRcdFx0X3RoaXMuc2Nyb2xsdmlldyA9IF90aGlzLm1ha2VTY3JvbGwoKTtcblx0XHRcdF90aGlzLmNvbnRlbnQgPSBfdGhpcy5zY3JvbGx2aWV3LmNvbnRlbnRcblxuXHRcdFxuXG5cdFx0X3RoaXMuY29udGVudC5vbiBcImNoYW5nZTp5XCIsIC0+XG5cdFx0XHRfdGhpcy5vblNjcm9sbChfdGhpcylcblx0XHRcblxuXHRwb3B1bGF0ZVVwZ3JhZGVkTGF5ZXJzOihsYXllcnMpIC0+XG5cdFx0Zm9yIGxheWVyIGluIGxheWVyc1xuXHRcdFx0bGF5ZXIub3JpZ2luYWxJbmRleCA9IGxheWVyLmluZGV4XG5cdFx0XHRpZiBsYXllci5uYW1lLm1hdGNoKC9eaGVhZGVyLykgfHwgbGF5ZXIubmFtZS5tYXRjaCgvXmZvb3Rlci8pXG5cdFx0XHRcdGxheWVyT3B0cyA9IHt9XG5cblx0XHRcdFx0aWYgbGF5ZXIubmFtZS5tYXRjaCgvXmhlYWRlci8pXG5cdFx0XHRcdFx0bGF5ZXJPcHRzLnNjcm9sbERpcmVjdGlvbiA9IFwidXBcIlxuXHRcdFx0XHRlbHNlIGlmIGxheWVyLm5hbWUubWF0Y2goL15mb290ZXIvKVxuXHRcdFx0XHRcdGxheWVyT3B0cy5zY3JvbGxEaXJlY3Rpb24gPSBcImRvd25cIlxuXG5cdFx0XHRcdGlmIGxheWVyLm5hbWUubWF0Y2goLy1hd2F5Lylcblx0XHRcdFx0XHRsYXllck9wdHMuc2Nyb2xsQmVoYXZpb3VyID0gXCJhd2F5XCJcblx0XHRcdFx0ZWxzZSBpZiBsYXllci5uYW1lLm1hdGNoKC8tcmV0dXJuLylcblx0XHRcdFx0XHRsYXllck9wdHMuc2Nyb2xsQmVoYXZpb3VyID0gXCJyZXR1cm5cIlxuXG5cdFx0XHRcdFx0aWYgbGF5ZXIubmFtZS5tYXRjaCgvLXRvcC8pXG5cdFx0XHRcdFx0XHRsYXllck9wdHMucmV0dXJuWSA9IDBcblx0XHRcdFx0XHRlbHNlIGlmIGxheWVyLm5hbWUubWF0Y2goLy1ib3R0b20vKVxuXHRcdFx0XHRcdFx0bGF5ZXJPcHRzLnJldHVyblkgPSB0aGlzLmhlaWdodC1sYXllci5oZWlnaHRcblx0XHRcdFx0XHRlbHNlIGlmIGxheWVyLm5hbWUubWF0Y2goLy1vcmlnaW5hbC8pXG5cdFx0XHRcdFx0XHRsYXllck9wdHMucmV0dXJuWSA9IGxheWVyLnlcblxuXHRcdFx0XHRpZiBsYXllci5uYW1lLm1hdGNoKC8tcGFyYWxsYXgvKVxuXHRcdFx0XHRcdGlmIGxheWVyLm5hbWUubWF0Y2goLy1wYXJhbGxheC1zbG93Lylcblx0XHRcdFx0XHRcdGxheWVyT3B0cy5wYXJhbGxheCA9IHRoaXMucGFyYWxsYXhWYWxzLnNsb3dcblx0XHRcdFx0XHRpZiBsYXllci5uYW1lLm1hdGNoKC8tcGFyYWxsYXgtbWlkLylcblx0XHRcdFx0XHRcdGxheWVyT3B0cy5wYXJhbGxheCA9IHRoaXMucGFyYWxsYXhWYWxzLm1pZFxuXHRcdFx0XHRcdGlmIGxheWVyLm5hbWUubWF0Y2goLy1wYXJhbGxheC1mYXN0Lylcblx0XHRcdFx0XHRcdGxheWVyT3B0cy5wYXJhbGxheCA9IHRoaXMucGFyYWxsYXhWYWxzLmZhc3RcblxuXG5cdFx0XHRcdHRoaXMuYWRkRGVwZW5kYW50Q2hpbGQobGF5ZXIsIGxheWVyT3B0cylcblxuXG5cdFx0XHRlbHNlIGlmIGxheWVyLm5hbWUubWF0Y2goL15zY3JvbGxlci8pXG5cdFx0XHRcdGNvbnRlbnQgPSBsYXllci5jaGlsZHJlbldpdGhOYW1lKFwiY29udGVudFwiKVswXVxuXHRcdFx0XHRjb250ZW50LnggPSAwO1xuXHRcdFx0XHRjb250ZW50LnkgPSAwXG5cdFx0XHRcdGZvciBjaGlsZCBpbiBjb250ZW50LmNoaWxkcmVuXG5cdFx0XHRcdFx0dGhpcy5jb250ZW50LmFkZENoaWxkKGNoaWxkKVxuXHRcdFx0XHRjb250ZW50LmRlc3Ryb3koKVxuXHRcdFx0XHQjIHRoaXMuY29udGVudC5hZGRDaGlsZChsYXllci5jaGlsZHJlbldpdGhOYW1lKFwiY29udGVudFwiKVswXSlcblxuXHRcdFx0XG5cdFx0Zm9yIGxheWVyIGluIGxheWVyc1xuXHRcdFx0aWYgbGF5ZXIubmFtZS5tYXRjaCgvXnNjcm9sbGVyLylcblx0XHRcdFx0dGhpcy5zY3JvbGx2aWV3LmluZGV4ID0gbGF5ZXIub3JpZ2luYWxJbmRleFxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRsYXllci5pbmRleCA9IGxheWVyLm9yaWdpbmFsSW5kZXhcblxuXG5cblxuXHRtYWtlU2Nyb2xsOiAtPlxuXHRcdHNjcm9sbHZpZXcgPSBuZXcgU2Nyb2xsQ29tcG9uZW50XG5cdFx0XHRzaXplOiB0aGlzLnNpemVcblx0XHRcdHNjcm9sbEhvcml6b250YWw6IGZhbHNlXG5cdFx0XHRuYW1lOiBcImNvb3JkaW5hdG9yU2Nyb2xsdmlld1wiXG5cdFx0XHRwYXJlbnQ6IHRoaXNcblxuXHRcdCMgdGhpcyA9IHRoaXNcblx0XHRcblx0XHRyZXR1cm4gc2Nyb2xsdmlld1xuXG5cblxuXHRvblNjcm9sbDooX3RoaXMpIC0+XG5cdFx0XG5cblx0XHRmb3IgbGF5ZXIgaW4gX3RoaXMuZGVwZW5kYW50Q2hpbGRyZW5cblx0XHRcdHNjcm9sbFkgPSBfdGhpcy5zY3JvbGx2aWV3LnNjcm9sbFkqbGF5ZXIucGFyYWxsYXhcblx0XHRcdCMgc2Nyb2xsWSA9IE1hdGgubWF4KE1hdGgubWluKF90aGlzLnNjcm9sbHZpZXcuc2Nyb2xsWSpsYXllci5wYXJhbGxheCwgX3RoaXMuc2Nyb2xsdmlldy5jb250ZW50LmhlaWdodC1fdGhpcy5zY3JvbGx2aWV3LmhlaWdodCksIDApXG5cdFx0XHRkZWx0YVkgPSBzY3JvbGxZIC0gX3RoaXMubGFzdFk7XG5cblx0XHRcdGlmIGxheWVyLnNjcm9sbERpcmVjdGlvbiA9PSBfdGhpcy5kaXJlY3Rpb25zLlVQICYmIGxheWVyLnNjcm9sbEJlaGF2aW91ciA9PSBfdGhpcy5iZWhhdmlvdXJzLlJFVFVSTlxuXHRcdFx0XHRsYXllci55ID0gTWF0aC5taW4oTWF0aC5tYXgobGF5ZXIueS1kZWx0YVksIGxheWVyLnN0aWNreVkpLCBNYXRoLm1heCgtc2Nyb2xsWStsYXllci5zdGFydFksIGxheWVyLnJldHVyblkpKVxuXG5cdFx0XHRlbHNlIGlmIGxheWVyLnNjcm9sbERpcmVjdGlvbiA9PSBfdGhpcy5kaXJlY3Rpb25zLlVQICYmIGxheWVyLnNjcm9sbEJlaGF2aW91ciA9PSBfdGhpcy5iZWhhdmlvdXJzLkFXQVlcblx0XHRcdFx0bGF5ZXIueSA9IE1hdGgubWF4KC1zY3JvbGxZK2xheWVyLnN0YXJ0WSwgbGF5ZXIuc3RpY2t5WSlcdFxuXG5cdFx0XHRlbHNlIGlmIGxheWVyLnNjcm9sbERpcmVjdGlvbiA9PSBfdGhpcy5kaXJlY3Rpb25zLkRPV04gICYmIGxheWVyLnNjcm9sbEJlaGF2aW91ciA9PSBfdGhpcy5iZWhhdmlvdXJzLlJFVFVSTlxuXHRcdFx0XHRsYXllci55ID0gTWF0aC5tYXgoTWF0aC5taW4obGF5ZXIueStkZWx0YVksIGxheWVyLnN0aWNreVkpLCBNYXRoLm1pbihzY3JvbGxZK2xheWVyLnN0YXJ0WSwgbGF5ZXIucmV0dXJuWSkpXHRcblxuXHRcdFx0ZWxzZSBpZiBsYXllci5zY3JvbGxEaXJlY3Rpb24gPT0gX3RoaXMuZGlyZWN0aW9ucy5ET1dOICYmIGxheWVyLnNjcm9sbEJlaGF2aW91ciA9PSBfdGhpcy5iZWhhdmlvdXJzLkFXQVlcblx0XHRcdFx0bGF5ZXIueSA9IE1hdGgubWluKHNjcm9sbFkrbGF5ZXIuc3RhcnRZLCBsYXllci5zdGlja3lZKVx0XG5cblx0XHRcdFxuXHRcdFx0bGF5ZXIuZW1pdChcImNvb3JkaW5hdGVkQ2hpbGQ6Y2hhbmdlOnlcIiwgbGF5ZXIpXG5cblxuXHRcdF90aGlzLmxhc3RZID0gc2Nyb2xsWVxuXG5cblxuXHRjYWxjdWxhdGVEZWZhdWx0U3RpY2t5WToobGF5ZXIsIGRpcmVjdGlvbikgLT5cblx0XHRpZiBkaXJlY3Rpb24gPT0gdGhpcy5kaXJlY3Rpb25zLlVQXG5cdFx0XHRyZXR1cm4gbGF5ZXIuaGVpZ2h0Ki0xXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIHRoaXMuaGVpZ2h0IFxuXG5cblx0YWRkRGVwZW5kYW50Q2hpbGQ6KGxheWVyLCBvcHRpb25zPXt9KSAtPlxuXHRcdGZvciBrZXksIHZhbHVlIG9mIHRoaXMuZGVmYXVsdE9wdHNcblx0XHRcdGlmICFvcHRpb25zLmhhc093blByb3BlcnR5KGtleSlcblx0XHRcdFx0aWYga2V5ID09IFwic3RpY2t5WVwiICYmIHZhbHVlID09IFwiYXV0b1wiXG5cdFx0XHRcdFx0b3B0aW9uc1trZXldID0gdGhpcy5jYWxjdWxhdGVEZWZhdWx0U3RpY2t5WShsYXllciwgb3B0aW9ucy5zY3JvbGxEaXJlY3Rpb24pXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRvcHRpb25zW2tleV0gPSB2YWx1ZVxuXG5cdFx0bGF5ZXIuc2Nyb2xsRGlyZWN0aW9uID0gb3B0aW9ucy5zY3JvbGxEaXJlY3Rpb25cblx0XHRsYXllci5zdGlja3lZID0gb3B0aW9ucy5zdGlja3lZXG5cdFx0bGF5ZXIuc2Nyb2xsQmVoYXZpb3VyID0gb3B0aW9ucy5zY3JvbGxCZWhhdmlvdXJcblx0XHRsYXllci5zdGFydFkgPSBsYXllci55XG5cdFx0bGF5ZXIucmV0dXJuWSA9IG9wdGlvbnMucmV0dXJuWVxuXHRcdGxheWVyLnBhcmFsbGF4ID0gb3B0aW9ucy5wYXJhbGxheFxuXG5cdFx0dGhpcy5kZXBlbmRhbnRDaGlsZHJlbi5wdXNoKGxheWVyKVxuXHRcdHRoaXMuYWRkQ2hpbGQobGF5ZXIpXG5cblx0XHRcblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG4iLCIjIEFkZCB0aGUgZm9sbG93aW5nIGxpbmUgdG8geW91ciBwcm9qZWN0IGluIEZyYW1lciBTdHVkaW8uIFxuIyBteU1vZHVsZSA9IHJlcXVpcmUgXCJteU1vZHVsZVwiXG4jIFJlZmVyZW5jZSB0aGUgY29udGVudHMgYnkgbmFtZSwgbGlrZSBteU1vZHVsZS5teUZ1bmN0aW9uKCkgb3IgbXlNb2R1bGUubXlWYXJcblxuXG5cbmNsYXNzIGV4cG9ydHMuVGFiQ29tcG9uZW50IGV4dGVuZHMgTGF5ZXJcblx0dGFiczogW11cblx0aW5kaWNhdG9ySGVpZ2h0OiA4XG5cdGluZGljYXRvckNvbG9yOiBcIiNGRkZcIlxuXHRzZWxlY3RlZEluZGV4OiAwXG5cblx0Y29uc3RydWN0b3I6IChvcHRpb25zPXt9KSAtPlxuXHRcdGlmICBvcHRpb25zLnVwZ3JhZGVMYXllclxuXHRcdFx0bGF5ZXIgPSBvcHRpb25zLnVwZ3JhZGVMYXllclxuXHRcdFx0b3B0aW9ucy5mcmFtZSA9IGxheWVyLmZyYW1lXG5cdFx0XHRvcHRpb25zLm5hbWUgPSBsYXllci5uYW1lXG5cdFx0XHRvcHRpb25zLnRhYnMgPSBsYXllci5jaGlsZHJlblxuXHRcdFx0c3VwZXIob3B0aW9ucylcblx0XHRcdGxheWVyLnBhcmVudC5hZGRDaGlsZCh0aGlzKVxuXHRcdFx0dGhpcy5wbGFjZUJlaGluZChsYXllcilcblx0XHRcdGxheWVyLmRlc3Ryb3koKVxuXG5cdFx0ZWxzZVxuXHRcdFx0c3VwZXIob3B0aW9ucylcblxuXHRcdHRoaXMudGFicyA9IG9wdGlvbnMudGFic1xuXHRcdHRoaXMuc2Nyb2xsdmlldyA9IHRoaXMubWFrZVNjcm9sbCgpXG5cdFx0dGhpcy5wb3B1bGF0ZVRhYnMoKVxuXG5cdFx0XG5cblx0XHRpZihvcHRpb25zLmhhc093blByb3BlcnR5KFwiaW5kaWNhdG9ySGVpZ2h0XCIpKVxuXHRcdFx0dGhpcy5pbmRpY2F0b3JIZWlnaHQgPSBvcHRpb25zLmluZGljYXRvckhlaWdodFxuXG5cdFx0aWYob3B0aW9ucy5oYXNPd25Qcm9wZXJ0eShcImluZGljYXRvckNvbG9yXCIpKVxuXHRcdFx0dGhpcy5pbmRpY2F0b3JDb2xvciA9IG9wdGlvbnMuaW5kaWNhdG9yQ29sb3JcblxuXHRcdHRoaXMuaW5kaWNhdG9yID0gdGhpcy5tYWtlSW5kaWNhdG9yKClcblxuXG5cblxuXHRtYWtlU2Nyb2xsOiAtPlxuXHRcdHNjcm9sbHZpZXcgPSBuZXcgU2Nyb2xsQ29tcG9uZW50XG5cdFx0XHRzaXplOiB0aGlzLnNpemVcblx0XHRcdHNjcm9sbFZlcnRpY2FsOiBmYWxzZVxuXHRcdFx0c2Nyb2xsSG9yaXpvbnRhbDogdHJ1ZVxuXHRcdFx0bmFtZTogXCJ0YWJTY3JvbGx2aWV3XCJcblx0XHRcdHBhcmVudDogdGhpc1xuXHRcdFxuXHRcdHJldHVybiBzY3JvbGx2aWV3XG5cblx0bWFrZUluZGljYXRvcjogLT5cblx0XHRpbmRpY2F0b3IgPSBuZXcgTGF5ZXJcblx0XHRcdHg6MFxuXHRcdFx0eTp0aGlzLmhlaWdodC10aGlzLmluZGljYXRvckhlaWdodFxuXHRcdFx0d2lkdGg6dGhpcy50YWJzW3RoaXMuc2VsZWN0ZWRJbmRleF0ud2lkdGhcblx0XHRcdGhlaWdodDp0aGlzLmluZGljYXRvckhlaWdodFxuXHRcdFx0YmFja2dyb3VuZENvbG9yOnRoaXMuaW5kaWNhdG9yQ29sb3Jcblx0XHRcdHBhcmVudDogdGhpcy5zY3JvbGx2aWV3LmNvbnRlbnRcblx0XHRyZXR1cm4gaW5kaWNhdG9yXG5cblx0cG9wdWxhdGVUYWJzOiAtPlxuXHRcdHggPSAwXG5cdFx0dGhpcy50YWJzLmZvckVhY2ggKHRhYiwgaSkgPT5cblx0XHRcdGlmIHRhYi5jaGlsZHJlbldpdGhOYW1lKFwiYWN0aXZlXCIpLmxlbmd0aCA+IDAgJiYgdGFiLmNoaWxkcmVuV2l0aE5hbWUoXCJpbmFjdGl2ZVwiKS5sZW5ndGggPiAwXG5cdFx0XHRcdHRhYi5jaGlsZHJlbldpdGhOYW1lKFwiYWN0aXZlXCIpWzBdLnZpc2libGUgPSBmYWxzZVxuXHRcdFx0XHR0YWIuY2hpbGRyZW5XaXRoTmFtZShcImluYWN0aXZlXCIpWzBdLnZpc2libGUgPSB0cnVlXG5cblx0XHRcdHRhYi54ID0geFxuXHRcdFx0dGFiLnRhYkluZGV4ID0gaVxuXHRcdFx0dGFiLm9uVGFwID0+XG5cdFx0XHRcdHRoaXMuc2VsZWN0VGFiKHRhYi50YWJJbmRleClcblxuXHRcdFx0dGhpcy5zY3JvbGx2aWV3LmNvbnRlbnQuYWRkQ2hpbGQodGFiKVxuXHRcdFx0eCA9IHgrdGFiLndpZHRoXG5cblx0XHRpZiB0aGlzLnNjcm9sbHZpZXcuY29udGVudC53aWR0aCA8PSB0aGlzLndpZHRoXG5cdFx0XHR0aGlzLnNjcm9sbHZpZXcuc2Nyb2xsSG9yaXpvbnRhbCA9IGZhbHNlO1xuXG5cdHNlbGVjdFRhYjoodGFiSW5kZXgpIC0+XG5cdFx0b3V0VGFiID0gdGhpcy50YWJzW3RoaXMuc2VsZWN0ZWRJbmRleF1cblx0XHRpblRhYiA9IHRoaXMudGFic1t0YWJJbmRleF1cblx0XHR0aGlzLnNjcm9sbHZpZXcuc2Nyb2xsVG9MYXllcihpblRhYiwgMC41LCAwLjUsIHRpbWU6MC4yKVxuXHRcdGluVGFiLnBsYWNlQmVoaW5kKHRoaXMuaW5kaWNhdG9yKVxuXHRcdCMgcHJpbnQgdGFiLngsIHRoaXMuc2Nyb2xsdmlldy5zY3JvbGxYXG5cdFx0dGhpcy5pbmRpY2F0b3IuYW5pbWF0ZVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0d2lkdGg6IGluVGFiLndpZHRoXG5cdFx0XHRcdHg6IGluVGFiLnhcblx0XHRcdHRpbWU6MC4yXG5cblx0XHRpZiBvdXRUYWIuY2hpbGRyZW5XaXRoTmFtZShcImFjdGl2ZVwiKS5sZW5ndGggPiAwICYmIG91dFRhYi5jaGlsZHJlbldpdGhOYW1lKFwiaW5hY3RpdmVcIikubGVuZ3RoID4gMFxuXHRcdFx0b3V0VGFiLmNoaWxkcmVuV2l0aE5hbWUoXCJhY3RpdmVcIilbMF0udmlzaWJsZSA9IGZhbHNlXG5cdFx0XHRvdXRUYWIuY2hpbGRyZW5XaXRoTmFtZShcImluYWN0aXZlXCIpWzBdLnZpc2libGUgPSB0cnVlXG5cblx0XHRpZiBpblRhYi5jaGlsZHJlbldpdGhOYW1lKFwiYWN0aXZlXCIpLmxlbmd0aCA+IDAgJiYgaW5UYWIuY2hpbGRyZW5XaXRoTmFtZShcImluYWN0aXZlXCIpLmxlbmd0aCA+IDBcblx0XHRcdGluVGFiLmNoaWxkcmVuV2l0aE5hbWUoXCJhY3RpdmVcIilbMF0udmlzaWJsZSA9IHRydWVcblx0XHRcdGluVGFiLmNoaWxkcmVuV2l0aE5hbWUoXCJpbmFjdGl2ZVwiKVswXS52aXNpYmxlID0gZmFsc2VcblxuXG5cdFx0dGhpcy5zZWxlY3RlZEluZGV4ID0gdGFiSW5kZXhcblx0XHR0aGlzLmVtaXQoXCJ0YWJzOmNoYW5nZTp0YWJcIiwgdGhpcy5zZWxlY3RlZEluZGV4KVxuXG5cblx0dXBncmFkZVRvVGFiQ29tcG9uZW50OihsYXllcikgLT5cblx0XHRwcmludCBcImRlcnBcIlxuXG5cblxuIiwiZXhwb3J0cy5hbmltYXRpb25zID1cblx0c2xpZGVSaWdodDpcblx0XHRpbjpcblx0XHRcdHg6MFxuXHRcdG91dDogXG5cdFx0XHR4OlNjcmVlbi53aWR0aFxuXG5cdHNsaWRlTGVmdDpcblx0XHRpbjpcblx0XHRcdHg6MFxuXHRcdG91dDogXG5cdFx0XHR4Oi1TY3JlZW4ud2lkdGhcblxuXHRzbGlkZVVwOlxuXHRcdGluOlxuXHRcdFx0eTowXG5cdFx0b3V0OiBcblx0XHRcdHk6LVNjcmVlbi5oZWlnaHRcblxuXHRzbGlkZURvd246XG5cdFx0aW46XG5cdFx0XHR5OjBcblx0XHRvdXQ6IFxuXHRcdFx0eTpTY3JlZW4uaGVpZ2h0XG5cblx0c2xpZGVGYWRlUmlnaHQ6XG5cdFx0aW46XG5cdFx0XHR4OjBcblx0XHRcdG9wYWNpdHk6MVxuXHRcdG91dDogXG5cdFx0XHR4OicyMCUnXG5cdFx0XHRvcGFjaXR5OjBcblxuXHRzbGlkZUZhZGVMZWZ0OlxuXHRcdGluOlxuXHRcdFx0eDowXG5cdFx0XHRvcGFjaXR5OjFcblx0XHRvdXQ6IFxuXHRcdFx0eDonLTIwJSdcblx0XHRcdG9wYWNpdHk6MFxuXG5cdHNsaWRlRmFkZVVwOlxuXHRcdGluOlxuXHRcdFx0eTowXG5cdFx0XHRvcGFjaXR5OjFcblx0XHRvdXQ6IFxuXHRcdFx0eTonLTIwJSdcblx0XHRcdG9wYWNpdHk6MFxuXG5cdHNsaWRlRmFkZURvd246XG5cdFx0aW46XG5cdFx0XHR5OjBcblx0XHRcdG9wYWNpdHk6MVxuXHRcdG91dDogXG5cdFx0XHR5OicyMCUnXG5cdFx0XHRvcGFjaXR5OjBcbiIsIiMgQWRkIHRoZSBmb2xsb3dpbmcgbGluZSB0byB5b3VyIHByb2plY3QgaW4gRnJhbWVyIFN0dWRpby4gXG4jIG15TW9kdWxlID0gcmVxdWlyZSBcIm15TW9kdWxlXCJcbiMgUmVmZXJlbmNlIHRoZSBjb250ZW50cyBieSBuYW1lLCBsaWtlIG15TW9kdWxlLm15RnVuY3Rpb24oKSBvciBteU1vZHVsZS5teVZhclxuXG5leHBvcnRzLm15VmFyID0gXCJteVZhcmlhYmxlXCJcblxuZXhwb3J0cy5teUZ1bmN0aW9uID0gLT5cblx0cHJpbnQgXCJteUZ1bmN0aW9uIGlzIHJ1bm5pbmdcIlxuXG5leHBvcnRzLm15QXJyYXkgPSBbMSwgMiwgM10iLCJkZWZhdWx0cyA9IFxuXHRjb2xvcjogXCJyZ2JhKDAsMCwwLDAuMSlcIlxuXHRzaGFkb3dDb2xvcjogXCJyZ2JhKDAsMCwwLDAuMylcIlxuXHRzaGFkb3dCbHVyOiAzMFxuXHRyaXBwbGVUaW1lOiAwLjNcblx0ZmFkZVRpbWU6IDAuNlxuXG5leHBvcnRzLnNldERlZmF1bHRzID0gKGNvbG9yID0gZGVmYXVsdHMuY29sb3IsIHNoYWRvd0NvbG9yID0gZGVmYXVsdHMuc2hhZG93Q29sb3IsIHNoYWRvd0JsdXIgPSBkZWZhdWx0cy5zaGFkb3dCbHVyLCByaXBwbGVUaW1lID0gZGVmYXVsdHMucmlwcGxlVGltZSwgZmFkZVRpbWUgPSBkZWZhdWx0cy5mYWRlVGltZSkgLT5cblx0ZGVmYXVsdHMgPSBcblx0XHRjb2xvcjogY29sb3Jcblx0XHRzaGFkb3dDb2xvcjogc2hhZG93Q29sb3Jcblx0XHRzaGFkb3dCbHVyOiBzaGFkb3dCbHVyXG5cdFx0cmlwcGxlVGltZTogcmlwcGxlVGltZVxuXHRcdGZhZGVUaW1lOiBmYWRlVGltZVxuXG5cbmV4cG9ydHMuYWRkUmlwcGxlID0gKGxheWVyLCBjb2xvciA9IGRlZmF1bHRzLmNvbG9yLCBzaGFkb3dDb2xvciA9IGRlZmF1bHRzLnNoYWRvd0NvbG9yLCBzaGFkb3dCbHVyID0gZGVmYXVsdHMuc2hhZG93Qmx1cikgLT5cblxuXHRsYXllci5zaGFkb3dCbHVyID0gMFxuXHRsYXllci5zaGFkb3dDb2xvciA9IHNoYWRvd0NvbG9yXG5cblx0bGF5ZXIub25UYXAgLT5cblx0XHRzID0gKGxheWVyLndpZHRoKjEuNSktbGF5ZXIuYm9yZGVyUmFkaXVzXG5cdFx0cmlwcGxlID0gbmV3IExheWVyXG5cdFx0XHR4OiAwXG5cdFx0XHR5OiAwXG5cdFx0XHR3aWR0aDogc1xuXHRcdFx0aGVpZ2h0OiBzXG5cdFx0XHRib3JkZXJSYWRpdXM6IHMvMlxuXHRcdFx0YmFja2dyb3VuZENvbG9yOiBjb2xvclxuXHRcdFx0c2NhbGU6IDBcblx0XHRcdG9wYWNpdHk6IDBcblxuXHRcdGxheWVyLmFkZENoaWxkKHJpcHBsZSlcblx0XHRsYXllci5jbGlwID0gdHJ1ZVxuXHRcdHJpcHBsZS5jZW50ZXIoKVxuXG5cdFx0cmlwcGxlT3V0ID0gcmlwcGxlLmFuaW1hdGVcblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdHNjYWxlOiAxLFxuXHRcdFx0XHRvcGFjaXR5OiAxLFxuXHRcdFx0dGltZTogZGVmYXVsdHMucmlwcGxlVGltZVxuXG5cdFx0bGF5ZXIuYW5pbWF0ZSBcblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdHNoYWRvd0JsdXI6IHNoYWRvd0JsdXJcblx0XHRcdHRpbWU6IGRlZmF1bHRzLnJpcHBsZVRpbWVcblxuXHRcdHJpcHBsZU91dC5vbiBcImVuZFwiLCAtPlxuXHRcdFx0cmlwcGxlRmFkZSA9IHJpcHBsZS5hbmltYXRlXG5cdFx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdFx0b3BhY2l0eTogMCxcblx0XHRcdFx0dGltZTogZGVmYXVsdHMuZmFkZVRpbWVcblxuXHRcdFx0bGF5ZXIuYW5pbWF0ZSBcblx0XHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0XHRzaGFkb3dCbHVyOiAwXG5cdFx0XHRcdHRpbWU6IGRlZmF1bHRzLmZhZGVUaW1lXG5cblx0XHRcdHJpcHBsZUZhZGUub24gXCJlbmRcIiwgLT5cblx0XHRcdFx0cmlwcGxlLmRlc3Ryb3koKVxuXG5cblxuIl19
