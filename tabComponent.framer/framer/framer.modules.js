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
      options.x = layer.x;
      options.y = layer.y;
      options.height = layer.height;
      options.width = Math.min(layer.width, Screen.width);
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMveWFzaW4vU2l0ZXMvRnJhbWVyIE1vZHVsZXMvdGFiQ29tcG9uZW50LmZyYW1lci9tb2R1bGVzL0FuaW1hdGVkUGFnZXMuY29mZmVlIiwiL1VzZXJzL3lhc2luL1NpdGVzL0ZyYW1lciBNb2R1bGVzL3RhYkNvbXBvbmVudC5mcmFtZXIvbW9kdWxlcy9Db29yZGluYXRvckxheW91dC5jb2ZmZWUiLCIvVXNlcnMveWFzaW4vU2l0ZXMvRnJhbWVyIE1vZHVsZXMvdGFiQ29tcG9uZW50LmZyYW1lci9tb2R1bGVzL1RhYkNvbXBvbmVudC5jb2ZmZWUiLCIvVXNlcnMveWFzaW4vU2l0ZXMvRnJhbWVyIE1vZHVsZXMvdGFiQ29tcG9uZW50LmZyYW1lci9tb2R1bGVzL2FuaW1hdGlvbnMuY29mZmVlIiwiL1VzZXJzL3lhc2luL1NpdGVzL0ZyYW1lciBNb2R1bGVzL3RhYkNvbXBvbmVudC5mcmFtZXIvbW9kdWxlcy9teU1vZHVsZS5jb2ZmZWUiLCIvVXNlcnMveWFzaW4vU2l0ZXMvRnJhbWVyIE1vZHVsZXMvdGFiQ29tcG9uZW50LmZyYW1lci9tb2R1bGVzL3JpcHBsZUJ1dHRvbi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxJQUFBLFVBQUE7RUFBQTs7O0FBQUEsT0FBTyxDQUFDLFVBQVIsR0FDQztFQUFBLFVBQUEsRUFDQztJQUFBLElBQUEsRUFDQztNQUFBLENBQUEsRUFBRSxDQUFGO0tBREQ7SUFFQSxHQUFBLEVBQ0M7TUFBQSxDQUFBLEVBQUUsTUFBTSxDQUFDLEtBQVQ7S0FIRDtHQUREO0VBTUEsU0FBQSxFQUNDO0lBQUEsSUFBQSxFQUNDO01BQUEsQ0FBQSxFQUFFLENBQUY7S0FERDtJQUVBLEdBQUEsRUFDQztNQUFBLENBQUEsRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFWO0tBSEQ7R0FQRDtFQVlBLE9BQUEsRUFDQztJQUFBLElBQUEsRUFDQztN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QUMsVUFGZjtLQUREO1dBS0EsU0FBUyxDQUFDLEVBQVYsQ0FBYSxLQUFiLEVBQW9CLFNBQUE7QUFDbkIsVUFBQTtNQUFBLFVBQUEsR0FBYSxNQUFNLENBQUMsT0FBUCxDQUNaO1FBQUEsVUFBQSxFQUNDO1VBQUEsT0FBQSxFQUFTLENBQVQ7U0FERDtRQUVBLElBQUEsRUFBTSxRQUFRLENBQUMsUUFGZjtPQURZO01BS2IsS0FBSyxDQUFDLE9BQU4sQ0FDQztRQUFBLFVBQUEsRUFDQztVQUFBLFVBQUEsRUFBWSxDQUFaO1NBREQ7UUFFQSxJQUFBLEVBQU0sUUFBUSxDQUFDLFFBRmY7T0FERDthQUtBLFVBQVUsQ0FBQyxFQUFYLENBQWMsS0FBZCxFQUFxQixTQUFBO2VBQ3BCLE1BQU0sQ0FBQyxPQUFQLENBQUE7TUFEb0IsQ0FBckI7SUFYbUIsQ0FBcEI7RUEzQlcsQ0FBWjtBQUxtQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJleHBvcnRzLmFuaW1hdGlvbnMgPVxuXHRzbGlkZVJpZ2h0OlxuXHRcdGluOlxuXHRcdFx0eDowXG5cdFx0b3V0OiBcblx0XHRcdHg6U2NyZWVuLndpZHRoXG5cblx0c2xpZGVMZWZ0OlxuXHRcdGluOlxuXHRcdFx0eDowXG5cdFx0b3V0OiBcblx0XHRcdHg6LVNjcmVlbi53aWR0aFxuXG5cdHNsaWRlVXA6XG5cdFx0aW46XG5cdFx0XHR5OjBcblx0XHRvdXQ6IFxuXHRcdFx0eTotU2NyZWVuLmhlaWdodFxuXG5cdHNsaWRlRG93bjpcblx0XHRpbjpcblx0XHRcdHk6MFxuXHRcdG91dDogXG5cdFx0XHR5OlNjcmVlbi5oZWlnaHRcblxuXHRzbGlkZUZhZGVSaWdodDpcblx0XHRpbjpcblx0XHRcdHg6MFxuXHRcdFx0b3BhY2l0eToxXG5cdFx0b3V0OiBcblx0XHRcdHg6JzIwJSdcblx0XHRcdG9wYWNpdHk6MFxuXG5cdHNsaWRlRmFkZUxlZnQ6XG5cdFx0aW46XG5cdFx0XHR4OjBcblx0XHRcdG9wYWNpdHk6MVxuXHRcdG91dDogXG5cdFx0XHR4OictMjAlJ1xuXHRcdFx0b3BhY2l0eTowXG5cblx0c2xpZGVGYWRlVXA6XG5cdFx0aW46XG5cdFx0XHR5OjBcblx0XHRcdG9wYWNpdHk6MVxuXHRcdG91dDogXG5cdFx0XHR5OictMjAlJ1xuXHRcdFx0b3BhY2l0eTowXG5cblx0c2xpZGVGYWRlRG93bjpcblx0XHRpbjpcblx0XHRcdHk6MFxuXHRcdFx0b3BhY2l0eToxXG5cdFx0b3V0OiBcblx0XHRcdHk6JzIwJSdcblx0XHRcdG9wYWNpdHk6MFxuXG5cblxuYW5pbWF0aW9ucyA9IGV4cG9ydHMuYW5pbWF0aW9uc1xuXG5cbmNsYXNzIGV4cG9ydHMuQW5pbWF0ZWRQYWdlcyBleHRlbmRzIExheWVyXG5cdHNlbGVjdGVkSW5kZXg6MFxuXHQjIGRlZmF1bHRJbkFuaW1hdGlvbjpcblx0IyBcdHByb3BlcnRpZXM6XG5cdCMgXHRcdG9wYWNpdHk6MVxuXHQjIFx0XHR5OjBcblx0IyBcdHRpbWU6MC4zXG5cblx0IyBkZWZhdWx0T3V0QW5pbWF0aW9uOlxuXHQjIFx0cHJvcGVydGllczpcblx0IyBcdFx0b3BhY2l0eTowXG5cdCMgXHRcdHk6JzMzJSdcblx0IyBcdHRpbWU6MC4zXG5cblxuXHRjb25zdHJ1Y3RvcjogKG9wdGlvbnM9e30pIC0+XG5cdFx0aWYgb3B0aW9ucy51cGdyYWRlTGF5ZXJcblx0XHRcdGxheWVyID0gb3B0aW9ucy51cGdyYWRlTGF5ZXJcblx0XHRcdG9wdGlvbnMuZnJhbWUgPSBsYXllci5mcmFtZVxuXHRcdFx0b3B0aW9ucy5uYW1lID0gbGF5ZXIubmFtZVxuXHRcdFx0b3B0aW9ucy5wYWdlcyA9IGxheWVyLmNoaWxkcmVuXG5cdFx0XHRzdXBlcihvcHRpb25zKVxuXHRcdFx0bGF5ZXIucGFyZW50LmFkZENoaWxkKHRoaXMpXG5cdFx0XHR0aGlzLnBsYWNlQmVoaW5kKGxheWVyKVxuXHRcdFx0bGF5ZXIuZGVzdHJveSgpXG5cdFx0ZWxzZVxuXHRcdFx0c3VwZXIob3B0aW9ucylcblxuXG5cdFx0dGhpcy5wYWdlcyA9IG9wdGlvbnMucGFnZXNcblx0XHR0aGlzLm1ha2VQYWdlcygpXG5cdFx0dGhpcy5zZWxlY3RQYWdlKDApXG5cblxuXHRtYWtlUGFnZXM6KCktPlxuXHRcdHRoaXMucGFnZXMuZm9yRWFjaCAocGFnZSwgaSkgPT5cblx0XHRcdHBhZ2UueCA9IDBcblx0XHRcdHBhZ2UueSA9IDBcblx0XHRcdHBhZ2Uub3BhY2l0eSA9IDBcblx0XHRcdHBhZ2UudmlzaWJsZSA9IGZhbHNlO1xuXHRcdFx0dGhpcy5zZXRBbmltYXRpb25zRm9yTGF5ZXIocGFnZSwgXCJzbGlkZUZhZGVVcFwiLCBcInNsaWRlRmFkZURvd25cIilcblx0XHRcdHRoaXMuYWRkQ2hpbGQocGFnZSlcblxuXG5cdHNldEFuaW1hdGlvbnNGb3JMYXllcjoobGF5ZXIsIGluQW5pbWF0aW9uTmFtZSwgb3V0QW5pbWF0aW9uTmFtZSkgLT5cblxuXHRcdGluQW5pbWF0aW9uID0gbmV3IEFuaW1hdGlvblxuXHRcdFx0bGF5ZXI6bGF5ZXJcblx0XHRcdHByb3BlcnRpZXM6YW5pbWF0aW9uc1tpbkFuaW1hdGlvbk5hbWVdLmluXG5cdFx0XHR0aW1lOjAuM1xuXG5cdFx0b3V0QW5pbWF0aW9uID0gbmV3IEFuaW1hdGlvblxuXHRcdFx0bGF5ZXI6bGF5ZXJcblx0XHRcdHByb3BlcnRpZXM6YW5pbWF0aW9uc1tvdXRBbmltYXRpb25OYW1lXS5vdXRcblx0XHRcdHRpbWU6MC4zXG5cblx0XHRcblx0XHRpbkFuaW1hdGlvbi5vbiBFdmVudHMuQW5pbWF0aW9uU3RhcnQsICgpIC0+XG5cdFx0XHR0aGlzLl90YXJnZXQudmlzaWJsZSA9IHRydWU7XG5cblx0XHRvdXRBbmltYXRpb24ub24gRXZlbnRzLkFuaW1hdGlvbkVuZCwgKCkgLT5cblx0XHRcdHRoaXMuX3RhcmdldC52aXNpYmxlID0gZmFsc2U7XG5cblx0XHRsYXllci5pbkFuaW1hdGlvbiA9IGluQW5pbWF0aW9uXG5cdFx0bGF5ZXIub3V0QW5pbWF0aW9uID0gb3V0QW5pbWF0aW9uXG5cblxuXG5cblx0c2VsZWN0UGFnZToocGFnZUluZGV4KS0+XG5cblx0XHRvdXRQYWdlID0gdGhpcy5wYWdlc1t0aGlzLnNlbGVjdGVkSW5kZXhdXG5cdFx0aW5QYWdlID0gdGhpcy5wYWdlc1twYWdlSW5kZXhdXG5cblx0XHRjb25zb2xlLmxvZyhpblBhZ2UpXG5cblx0XHRvdXRQYWdlLm91dEFuaW1hdGlvbi5zdGFydCgpO1xuXHRcdGluUGFnZS5pbkFuaW1hdGlvbi5zdGFydCgpO1xuXHRcdHRoaXMuaGVpZ2h0ID0gaW5QYWdlLmhlaWdodFxuXG5cdFx0dGhpcy5zZWxlY3RlZEluZGV4ID0gcGFnZUluZGV4XG5cdFx0dGhpcy5lbWl0KFwicGFnZXM6Y2hhbmdlOnBhZ2VcIiwgdGhpcy5zZWxlY3RlZEluZGV4KVxuXG5cdGFuaW1hdGVDaGlsZHJlbjooKS0+XG5cblxuIiwiXG5cbmNsYXNzIGV4cG9ydHMuQ29vcmRpbmF0b3JMYXlvdXQgZXh0ZW5kcyBMYXllclxuXHRkZXBlbmRhbnRDaGlsZHJlbjpbXVxuXHRkaXJlY3Rpb25zOlxuXHRcdFVQOlwidXBcIlxuXHRcdERPV046XCJkb3duXCJcblxuXHRiZWhhdmlvdXJzOlxuXHRcdEFXQVk6XCJhd2F5XCJcblx0XHRSRVRVUk46XCJyZXR1cm5cIlxuXG5cdGRlZmF1bHRPcHRzOlxuXHRcdHNjcm9sbERpcmVjdGlvbjogXCJ1cFwiXG5cdFx0c3RpY2t5WTogXCJhdXRvXCJcblx0XHRzY3JvbGxCZWhhdmlvdXI6IFwiYXdheVwiXG5cdFx0cmV0dXJuWTogMFxuXHRcdHBhcmFsbGF4OiAxXG5cblx0cGFyYWxsYXhWYWxzOlxuXHRcdHNsb3c6MC4zXG5cdFx0bWlkOjAuNlxuXHRcdGZhc3Q6MC45XG5cblx0bGFzdFk6IDBcblxuXHRjb25zdHJ1Y3RvcjogKG9wdGlvbnM9e30pIC0+XG5cdFx0X3RoaXMgPSB0aGlzXG5cdFx0aWYgb3B0aW9ucy51cGdyYWRlTGF5ZXJcblx0XHRcdGxheWVyID0gb3B0aW9ucy51cGdyYWRlTGF5ZXJcblx0XHRcdG9wdGlvbnMuZnJhbWUgPSBsYXllci5mcmFtZVxuXHRcdFx0b3B0aW9ucy5uYW1lID0gbGF5ZXIubmFtZVxuXHRcdFx0c3VwZXIob3B0aW9ucylcblxuXHRcdFx0X3RoaXMuc2Nyb2xsdmlldyA9IF90aGlzLm1ha2VTY3JvbGwoKTtcblx0XHRcdF90aGlzLmNvbnRlbnQgPSBfdGhpcy5zY3JvbGx2aWV3LmNvbnRlbnRcblxuXHRcdFx0X3RoaXMucG9wdWxhdGVVcGdyYWRlZExheWVycyhsYXllci5jaGlsZHJlbilcblxuXHRcdFx0bGF5ZXIucGFyZW50LmFkZENoaWxkKHRoaXMpXG5cdFx0XHR0aGlzLnBsYWNlQmVoaW5kKGxheWVyKVxuXHRcdFx0bGF5ZXIuZGVzdHJveSgpXG5cdFx0ZWxzZVxuXHRcdFx0c3VwZXIob3B0aW9ucylcblx0XHRcdF90aGlzLnNjcm9sbHZpZXcgPSBfdGhpcy5tYWtlU2Nyb2xsKCk7XG5cdFx0XHRfdGhpcy5jb250ZW50ID0gX3RoaXMuc2Nyb2xsdmlldy5jb250ZW50XG5cblx0XHRcblxuXHRcdF90aGlzLmNvbnRlbnQub24gXCJjaGFuZ2U6eVwiLCAtPlxuXHRcdFx0X3RoaXMub25TY3JvbGwoX3RoaXMpXG5cdFx0XG5cblx0cG9wdWxhdGVVcGdyYWRlZExheWVyczoobGF5ZXJzKSAtPlxuXHRcdGZvciBsYXllciBpbiBsYXllcnNcblx0XHRcdGxheWVyLm9yaWdpbmFsSW5kZXggPSBsYXllci5pbmRleFxuXHRcdFx0aWYgbGF5ZXIubmFtZS5tYXRjaCgvXmhlYWRlci8pIHx8IGxheWVyLm5hbWUubWF0Y2goL15mb290ZXIvKVxuXHRcdFx0XHRsYXllck9wdHMgPSB7fVxuXG5cdFx0XHRcdGlmIGxheWVyLm5hbWUubWF0Y2goL15oZWFkZXIvKVxuXHRcdFx0XHRcdGxheWVyT3B0cy5zY3JvbGxEaXJlY3Rpb24gPSBcInVwXCJcblx0XHRcdFx0ZWxzZSBpZiBsYXllci5uYW1lLm1hdGNoKC9eZm9vdGVyLylcblx0XHRcdFx0XHRsYXllck9wdHMuc2Nyb2xsRGlyZWN0aW9uID0gXCJkb3duXCJcblxuXHRcdFx0XHRpZiBsYXllci5uYW1lLm1hdGNoKC8tYXdheS8pXG5cdFx0XHRcdFx0bGF5ZXJPcHRzLnNjcm9sbEJlaGF2aW91ciA9IFwiYXdheVwiXG5cdFx0XHRcdGVsc2UgaWYgbGF5ZXIubmFtZS5tYXRjaCgvLXJldHVybi8pXG5cdFx0XHRcdFx0bGF5ZXJPcHRzLnNjcm9sbEJlaGF2aW91ciA9IFwicmV0dXJuXCJcblxuXHRcdFx0XHRcdGlmIGxheWVyLm5hbWUubWF0Y2goLy10b3AvKVxuXHRcdFx0XHRcdFx0bGF5ZXJPcHRzLnJldHVyblkgPSAwXG5cdFx0XHRcdFx0ZWxzZSBpZiBsYXllci5uYW1lLm1hdGNoKC8tYm90dG9tLylcblx0XHRcdFx0XHRcdGxheWVyT3B0cy5yZXR1cm5ZID0gdGhpcy5oZWlnaHQtbGF5ZXIuaGVpZ2h0XG5cdFx0XHRcdFx0ZWxzZSBpZiBsYXllci5uYW1lLm1hdGNoKC8tb3JpZ2luYWwvKVxuXHRcdFx0XHRcdFx0bGF5ZXJPcHRzLnJldHVyblkgPSBsYXllci55XG5cblx0XHRcdFx0aWYgbGF5ZXIubmFtZS5tYXRjaCgvLXBhcmFsbGF4Lylcblx0XHRcdFx0XHRpZiBsYXllci5uYW1lLm1hdGNoKC8tcGFyYWxsYXgtc2xvdy8pXG5cdFx0XHRcdFx0XHRsYXllck9wdHMucGFyYWxsYXggPSB0aGlzLnBhcmFsbGF4VmFscy5zbG93XG5cdFx0XHRcdFx0aWYgbGF5ZXIubmFtZS5tYXRjaCgvLXBhcmFsbGF4LW1pZC8pXG5cdFx0XHRcdFx0XHRsYXllck9wdHMucGFyYWxsYXggPSB0aGlzLnBhcmFsbGF4VmFscy5taWRcblx0XHRcdFx0XHRpZiBsYXllci5uYW1lLm1hdGNoKC8tcGFyYWxsYXgtZmFzdC8pXG5cdFx0XHRcdFx0XHRsYXllck9wdHMucGFyYWxsYXggPSB0aGlzLnBhcmFsbGF4VmFscy5mYXN0XG5cblxuXHRcdFx0XHR0aGlzLmFkZERlcGVuZGFudENoaWxkKGxheWVyLCBsYXllck9wdHMpXG5cblxuXHRcdFx0ZWxzZSBpZiBsYXllci5uYW1lLm1hdGNoKC9ec2Nyb2xsZXIvKVxuXHRcdFx0XHRjb250ZW50ID0gbGF5ZXIuY2hpbGRyZW5XaXRoTmFtZShcImNvbnRlbnRcIilbMF1cblx0XHRcdFx0Y29udGVudC54ID0gMDtcblx0XHRcdFx0Y29udGVudC55ID0gMFxuXHRcdFx0XHRmb3IgY2hpbGQgaW4gY29udGVudC5jaGlsZHJlblxuXHRcdFx0XHRcdHRoaXMuY29udGVudC5hZGRDaGlsZChjaGlsZClcblx0XHRcdFx0Y29udGVudC5kZXN0cm95KClcblx0XHRcdFx0IyB0aGlzLmNvbnRlbnQuYWRkQ2hpbGQobGF5ZXIuY2hpbGRyZW5XaXRoTmFtZShcImNvbnRlbnRcIilbMF0pXG5cblx0XHRcdFxuXHRcdGZvciBsYXllciBpbiBsYXllcnNcblx0XHRcdGlmIGxheWVyLm5hbWUubWF0Y2goL15zY3JvbGxlci8pXG5cdFx0XHRcdHRoaXMuc2Nyb2xsdmlldy5pbmRleCA9IGxheWVyLm9yaWdpbmFsSW5kZXhcblx0XHRcdGVsc2Vcblx0XHRcdFx0bGF5ZXIuaW5kZXggPSBsYXllci5vcmlnaW5hbEluZGV4XG5cblxuXG5cblx0bWFrZVNjcm9sbDogLT5cblx0XHRzY3JvbGx2aWV3ID0gbmV3IFNjcm9sbENvbXBvbmVudFxuXHRcdFx0c2l6ZTogdGhpcy5zaXplXG5cdFx0XHRzY3JvbGxIb3Jpem9udGFsOiBmYWxzZVxuXHRcdFx0bmFtZTogXCJjb29yZGluYXRvclNjcm9sbHZpZXdcIlxuXHRcdFx0cGFyZW50OiB0aGlzXG5cblx0XHQjIHRoaXMgPSB0aGlzXG5cdFx0XG5cdFx0cmV0dXJuIHNjcm9sbHZpZXdcblxuXG5cblx0b25TY3JvbGw6KF90aGlzKSAtPlxuXHRcdFxuXG5cdFx0Zm9yIGxheWVyIGluIF90aGlzLmRlcGVuZGFudENoaWxkcmVuXG5cdFx0XHRzY3JvbGxZID0gX3RoaXMuc2Nyb2xsdmlldy5zY3JvbGxZKmxheWVyLnBhcmFsbGF4XG5cdFx0XHQjIHNjcm9sbFkgPSBNYXRoLm1heChNYXRoLm1pbihfdGhpcy5zY3JvbGx2aWV3LnNjcm9sbFkqbGF5ZXIucGFyYWxsYXgsIF90aGlzLnNjcm9sbHZpZXcuY29udGVudC5oZWlnaHQtX3RoaXMuc2Nyb2xsdmlldy5oZWlnaHQpLCAwKVxuXHRcdFx0ZGVsdGFZID0gc2Nyb2xsWSAtIF90aGlzLmxhc3RZO1xuXG5cdFx0XHRpZiBsYXllci5zY3JvbGxEaXJlY3Rpb24gPT0gX3RoaXMuZGlyZWN0aW9ucy5VUCAmJiBsYXllci5zY3JvbGxCZWhhdmlvdXIgPT0gX3RoaXMuYmVoYXZpb3Vycy5SRVRVUk5cblx0XHRcdFx0bGF5ZXIueSA9IE1hdGgubWluKE1hdGgubWF4KGxheWVyLnktZGVsdGFZLCBsYXllci5zdGlja3lZKSwgTWF0aC5tYXgoLXNjcm9sbFkrbGF5ZXIuc3RhcnRZLCBsYXllci5yZXR1cm5ZKSlcblxuXHRcdFx0ZWxzZSBpZiBsYXllci5zY3JvbGxEaXJlY3Rpb24gPT0gX3RoaXMuZGlyZWN0aW9ucy5VUCAmJiBsYXllci5zY3JvbGxCZWhhdmlvdXIgPT0gX3RoaXMuYmVoYXZpb3Vycy5BV0FZXG5cdFx0XHRcdGxheWVyLnkgPSBNYXRoLm1heCgtc2Nyb2xsWStsYXllci5zdGFydFksIGxheWVyLnN0aWNreVkpXHRcblxuXHRcdFx0ZWxzZSBpZiBsYXllci5zY3JvbGxEaXJlY3Rpb24gPT0gX3RoaXMuZGlyZWN0aW9ucy5ET1dOICAmJiBsYXllci5zY3JvbGxCZWhhdmlvdXIgPT0gX3RoaXMuYmVoYXZpb3Vycy5SRVRVUk5cblx0XHRcdFx0bGF5ZXIueSA9IE1hdGgubWF4KE1hdGgubWluKGxheWVyLnkrZGVsdGFZLCBsYXllci5zdGlja3lZKSwgTWF0aC5taW4oc2Nyb2xsWStsYXllci5zdGFydFksIGxheWVyLnJldHVyblkpKVx0XG5cblx0XHRcdGVsc2UgaWYgbGF5ZXIuc2Nyb2xsRGlyZWN0aW9uID09IF90aGlzLmRpcmVjdGlvbnMuRE9XTiAmJiBsYXllci5zY3JvbGxCZWhhdmlvdXIgPT0gX3RoaXMuYmVoYXZpb3Vycy5BV0FZXG5cdFx0XHRcdGxheWVyLnkgPSBNYXRoLm1pbihzY3JvbGxZK2xheWVyLnN0YXJ0WSwgbGF5ZXIuc3RpY2t5WSlcdFxuXG5cdFx0XHRcblx0XHRcdGxheWVyLmVtaXQoXCJjb29yZGluYXRlZENoaWxkOmNoYW5nZTp5XCIsIGxheWVyKVxuXG5cblx0XHRfdGhpcy5sYXN0WSA9IHNjcm9sbFlcblxuXG5cblx0Y2FsY3VsYXRlRGVmYXVsdFN0aWNreVk6KGxheWVyLCBkaXJlY3Rpb24pIC0+XG5cdFx0aWYgZGlyZWN0aW9uID09IHRoaXMuZGlyZWN0aW9ucy5VUFxuXHRcdFx0cmV0dXJuIGxheWVyLmhlaWdodCotMVxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiB0aGlzLmhlaWdodCBcblxuXG5cdGFkZERlcGVuZGFudENoaWxkOihsYXllciwgb3B0aW9ucz17fSkgLT5cblx0XHRmb3Iga2V5LCB2YWx1ZSBvZiB0aGlzLmRlZmF1bHRPcHRzXG5cdFx0XHRpZiAhb3B0aW9ucy5oYXNPd25Qcm9wZXJ0eShrZXkpXG5cdFx0XHRcdGlmIGtleSA9PSBcInN0aWNreVlcIiAmJiB2YWx1ZSA9PSBcImF1dG9cIlxuXHRcdFx0XHRcdG9wdGlvbnNba2V5XSA9IHRoaXMuY2FsY3VsYXRlRGVmYXVsdFN0aWNreVkobGF5ZXIsIG9wdGlvbnMuc2Nyb2xsRGlyZWN0aW9uKVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0b3B0aW9uc1trZXldID0gdmFsdWVcblxuXHRcdGxheWVyLnNjcm9sbERpcmVjdGlvbiA9IG9wdGlvbnMuc2Nyb2xsRGlyZWN0aW9uXG5cdFx0bGF5ZXIuc3RpY2t5WSA9IG9wdGlvbnMuc3RpY2t5WVxuXHRcdGxheWVyLnNjcm9sbEJlaGF2aW91ciA9IG9wdGlvbnMuc2Nyb2xsQmVoYXZpb3VyXG5cdFx0bGF5ZXIuc3RhcnRZID0gbGF5ZXIueVxuXHRcdGxheWVyLnJldHVyblkgPSBvcHRpb25zLnJldHVybllcblx0XHRsYXllci5wYXJhbGxheCA9IG9wdGlvbnMucGFyYWxsYXhcblxuXHRcdHRoaXMuZGVwZW5kYW50Q2hpbGRyZW4ucHVzaChsYXllcilcblx0XHR0aGlzLmFkZENoaWxkKGxheWVyKVxuXG5cdFx0XG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuIiwiIyBBZGQgdGhlIGZvbGxvd2luZyBsaW5lIHRvIHlvdXIgcHJvamVjdCBpbiBGcmFtZXIgU3R1ZGlvLiBcbiMgbXlNb2R1bGUgPSByZXF1aXJlIFwibXlNb2R1bGVcIlxuIyBSZWZlcmVuY2UgdGhlIGNvbnRlbnRzIGJ5IG5hbWUsIGxpa2UgbXlNb2R1bGUubXlGdW5jdGlvbigpIG9yIG15TW9kdWxlLm15VmFyXG5cblxuXG5jbGFzcyBleHBvcnRzLlRhYkNvbXBvbmVudCBleHRlbmRzIExheWVyXG5cdHRhYnM6IFtdXG5cdGluZGljYXRvckhlaWdodDogOFxuXHRpbmRpY2F0b3JDb2xvcjogXCIjRkZGXCJcblx0c2VsZWN0ZWRJbmRleDogMFxuXG5cdGNvbnN0cnVjdG9yOiAob3B0aW9ucz17fSkgLT5cblx0XHRpZiAgb3B0aW9ucy51cGdyYWRlTGF5ZXJcblx0XHRcdGxheWVyID0gb3B0aW9ucy51cGdyYWRlTGF5ZXJcblx0XHRcdG9wdGlvbnMueCA9IGxheWVyLnhcblx0XHRcdG9wdGlvbnMueSA9IGxheWVyLnlcblx0XHRcdG9wdGlvbnMuaGVpZ2h0ID0gbGF5ZXIuaGVpZ2h0XG5cdFx0XHRvcHRpb25zLndpZHRoID0gTWF0aC5taW4obGF5ZXIud2lkdGgsIFNjcmVlbi53aWR0aClcblx0XHRcdG9wdGlvbnMubmFtZSA9IGxheWVyLm5hbWVcblx0XHRcdG9wdGlvbnMudGFicyA9IGxheWVyLmNoaWxkcmVuXG5cdFx0XHRzdXBlcihvcHRpb25zKVxuXHRcdFx0bGF5ZXIucGFyZW50LmFkZENoaWxkKHRoaXMpXG5cdFx0XHR0aGlzLnBsYWNlQmVoaW5kKGxheWVyKVxuXHRcdFx0bGF5ZXIuZGVzdHJveSgpXG5cblx0XHRlbHNlXG5cdFx0XHRzdXBlcihvcHRpb25zKVxuXG5cdFx0dGhpcy50YWJzID0gb3B0aW9ucy50YWJzXG5cdFx0dGhpcy5zY3JvbGx2aWV3ID0gdGhpcy5tYWtlU2Nyb2xsKClcblx0XHR0aGlzLnBvcHVsYXRlVGFicygpXG5cblx0XHRcblxuXHRcdGlmKG9wdGlvbnMuaGFzT3duUHJvcGVydHkoXCJpbmRpY2F0b3JIZWlnaHRcIikpXG5cdFx0XHR0aGlzLmluZGljYXRvckhlaWdodCA9IG9wdGlvbnMuaW5kaWNhdG9ySGVpZ2h0XG5cblx0XHRpZihvcHRpb25zLmhhc093blByb3BlcnR5KFwiaW5kaWNhdG9yQ29sb3JcIikpXG5cdFx0XHR0aGlzLmluZGljYXRvckNvbG9yID0gb3B0aW9ucy5pbmRpY2F0b3JDb2xvclxuXG5cdFx0dGhpcy5pbmRpY2F0b3IgPSB0aGlzLm1ha2VJbmRpY2F0b3IoKVxuXG5cblxuXG5cdG1ha2VTY3JvbGw6IC0+XG5cdFx0c2Nyb2xsdmlldyA9IG5ldyBTY3JvbGxDb21wb25lbnRcblx0XHRcdHNpemU6IHRoaXMuc2l6ZVxuXHRcdFx0c2Nyb2xsVmVydGljYWw6IGZhbHNlXG5cdFx0XHRzY3JvbGxIb3Jpem9udGFsOiB0cnVlXG5cdFx0XHRuYW1lOiBcInRhYlNjcm9sbHZpZXdcIlxuXHRcdFx0cGFyZW50OiB0aGlzXG5cdFx0XG5cdFx0cmV0dXJuIHNjcm9sbHZpZXdcblxuXHRtYWtlSW5kaWNhdG9yOiAtPlxuXHRcdGluZGljYXRvciA9IG5ldyBMYXllclxuXHRcdFx0eDowXG5cdFx0XHR5OnRoaXMuaGVpZ2h0LXRoaXMuaW5kaWNhdG9ySGVpZ2h0XG5cdFx0XHR3aWR0aDp0aGlzLnRhYnNbdGhpcy5zZWxlY3RlZEluZGV4XS53aWR0aFxuXHRcdFx0aGVpZ2h0OnRoaXMuaW5kaWNhdG9ySGVpZ2h0XG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6dGhpcy5pbmRpY2F0b3JDb2xvclxuXHRcdFx0cGFyZW50OiB0aGlzLnNjcm9sbHZpZXcuY29udGVudFxuXHRcdHJldHVybiBpbmRpY2F0b3JcblxuXHRwb3B1bGF0ZVRhYnM6IC0+XG5cdFx0eCA9IDBcblx0XHR0aGlzLnRhYnMuZm9yRWFjaCAodGFiLCBpKSA9PlxuXHRcdFx0aWYgdGFiLmNoaWxkcmVuV2l0aE5hbWUoXCJhY3RpdmVcIikubGVuZ3RoID4gMCAmJiB0YWIuY2hpbGRyZW5XaXRoTmFtZShcImluYWN0aXZlXCIpLmxlbmd0aCA+IDBcblx0XHRcdFx0dGFiLmNoaWxkcmVuV2l0aE5hbWUoXCJhY3RpdmVcIilbMF0udmlzaWJsZSA9IGZhbHNlXG5cdFx0XHRcdHRhYi5jaGlsZHJlbldpdGhOYW1lKFwiaW5hY3RpdmVcIilbMF0udmlzaWJsZSA9IHRydWVcblxuXHRcdFx0dGFiLnggPSB4XG5cdFx0XHR0YWIudGFiSW5kZXggPSBpXG5cdFx0XHR0YWIub25UYXAgPT5cblx0XHRcdFx0dGhpcy5zZWxlY3RUYWIodGFiLnRhYkluZGV4KVxuXG5cdFx0XHR0aGlzLnNjcm9sbHZpZXcuY29udGVudC5hZGRDaGlsZCh0YWIpXG5cdFx0XHR4ID0geCt0YWIud2lkdGhcblxuXHRcdGlmIHRoaXMuc2Nyb2xsdmlldy5jb250ZW50LndpZHRoIDw9IHRoaXMud2lkdGhcblx0XHRcdHRoaXMuc2Nyb2xsdmlldy5zY3JvbGxIb3Jpem9udGFsID0gZmFsc2U7XG5cblx0c2VsZWN0VGFiOih0YWJJbmRleCkgLT5cblx0XHRvdXRUYWIgPSB0aGlzLnRhYnNbdGhpcy5zZWxlY3RlZEluZGV4XVxuXHRcdGluVGFiID0gdGhpcy50YWJzW3RhYkluZGV4XVxuXHRcdHRoaXMuc2Nyb2xsdmlldy5zY3JvbGxUb0xheWVyKGluVGFiLCAwLjUsIDAuNSwgdGltZTowLjIpXG5cdFx0aW5UYWIucGxhY2VCZWhpbmQodGhpcy5pbmRpY2F0b3IpXG5cdFx0IyBwcmludCB0YWIueCwgdGhpcy5zY3JvbGx2aWV3LnNjcm9sbFhcblx0XHR0aGlzLmluZGljYXRvci5hbmltYXRlXG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHR3aWR0aDogaW5UYWIud2lkdGhcblx0XHRcdFx0eDogaW5UYWIueFxuXHRcdFx0dGltZTowLjJcblxuXHRcdGlmIG91dFRhYi5jaGlsZHJlbldpdGhOYW1lKFwiYWN0aXZlXCIpLmxlbmd0aCA+IDAgJiYgb3V0VGFiLmNoaWxkcmVuV2l0aE5hbWUoXCJpbmFjdGl2ZVwiKS5sZW5ndGggPiAwXG5cdFx0XHRvdXRUYWIuY2hpbGRyZW5XaXRoTmFtZShcImFjdGl2ZVwiKVswXS52aXNpYmxlID0gZmFsc2Vcblx0XHRcdG91dFRhYi5jaGlsZHJlbldpdGhOYW1lKFwiaW5hY3RpdmVcIilbMF0udmlzaWJsZSA9IHRydWVcblxuXHRcdGlmIGluVGFiLmNoaWxkcmVuV2l0aE5hbWUoXCJhY3RpdmVcIikubGVuZ3RoID4gMCAmJiBpblRhYi5jaGlsZHJlbldpdGhOYW1lKFwiaW5hY3RpdmVcIikubGVuZ3RoID4gMFxuXHRcdFx0aW5UYWIuY2hpbGRyZW5XaXRoTmFtZShcImFjdGl2ZVwiKVswXS52aXNpYmxlID0gdHJ1ZVxuXHRcdFx0aW5UYWIuY2hpbGRyZW5XaXRoTmFtZShcImluYWN0aXZlXCIpWzBdLnZpc2libGUgPSBmYWxzZVxuXG5cblx0XHR0aGlzLnNlbGVjdGVkSW5kZXggPSB0YWJJbmRleFxuXHRcdHRoaXMuZW1pdChcInRhYnM6Y2hhbmdlOnRhYlwiLCB0aGlzLnNlbGVjdGVkSW5kZXgpXG5cblxuXHR1cGdyYWRlVG9UYWJDb21wb25lbnQ6KGxheWVyKSAtPlxuXHRcdHByaW50IFwiZGVycFwiXG5cblxuXG4iLCJleHBvcnRzLmFuaW1hdGlvbnMgPVxuXHRzbGlkZVJpZ2h0OlxuXHRcdGluOlxuXHRcdFx0eDowXG5cdFx0b3V0OiBcblx0XHRcdHg6U2NyZWVuLndpZHRoXG5cblx0c2xpZGVMZWZ0OlxuXHRcdGluOlxuXHRcdFx0eDowXG5cdFx0b3V0OiBcblx0XHRcdHg6LVNjcmVlbi53aWR0aFxuXG5cdHNsaWRlVXA6XG5cdFx0aW46XG5cdFx0XHR5OjBcblx0XHRvdXQ6IFxuXHRcdFx0eTotU2NyZWVuLmhlaWdodFxuXG5cdHNsaWRlRG93bjpcblx0XHRpbjpcblx0XHRcdHk6MFxuXHRcdG91dDogXG5cdFx0XHR5OlNjcmVlbi5oZWlnaHRcblxuXHRzbGlkZUZhZGVSaWdodDpcblx0XHRpbjpcblx0XHRcdHg6MFxuXHRcdFx0b3BhY2l0eToxXG5cdFx0b3V0OiBcblx0XHRcdHg6JzIwJSdcblx0XHRcdG9wYWNpdHk6MFxuXG5cdHNsaWRlRmFkZUxlZnQ6XG5cdFx0aW46XG5cdFx0XHR4OjBcblx0XHRcdG9wYWNpdHk6MVxuXHRcdG91dDogXG5cdFx0XHR4OictMjAlJ1xuXHRcdFx0b3BhY2l0eTowXG5cblx0c2xpZGVGYWRlVXA6XG5cdFx0aW46XG5cdFx0XHR5OjBcblx0XHRcdG9wYWNpdHk6MVxuXHRcdG91dDogXG5cdFx0XHR5OictMjAlJ1xuXHRcdFx0b3BhY2l0eTowXG5cblx0c2xpZGVGYWRlRG93bjpcblx0XHRpbjpcblx0XHRcdHk6MFxuXHRcdFx0b3BhY2l0eToxXG5cdFx0b3V0OiBcblx0XHRcdHk6JzIwJSdcblx0XHRcdG9wYWNpdHk6MFxuIiwiIyBBZGQgdGhlIGZvbGxvd2luZyBsaW5lIHRvIHlvdXIgcHJvamVjdCBpbiBGcmFtZXIgU3R1ZGlvLiBcbiMgbXlNb2R1bGUgPSByZXF1aXJlIFwibXlNb2R1bGVcIlxuIyBSZWZlcmVuY2UgdGhlIGNvbnRlbnRzIGJ5IG5hbWUsIGxpa2UgbXlNb2R1bGUubXlGdW5jdGlvbigpIG9yIG15TW9kdWxlLm15VmFyXG5cbmV4cG9ydHMubXlWYXIgPSBcIm15VmFyaWFibGVcIlxuXG5leHBvcnRzLm15RnVuY3Rpb24gPSAtPlxuXHRwcmludCBcIm15RnVuY3Rpb24gaXMgcnVubmluZ1wiXG5cbmV4cG9ydHMubXlBcnJheSA9IFsxLCAyLCAzXSIsImRlZmF1bHRzID0gXG5cdGNvbG9yOiBcInJnYmEoMCwwLDAsMC4xKVwiXG5cdHNoYWRvd0NvbG9yOiBcInJnYmEoMCwwLDAsMC4zKVwiXG5cdHNoYWRvd0JsdXI6IDMwXG5cdHJpcHBsZVRpbWU6IDAuM1xuXHRmYWRlVGltZTogMC42XG5cbmV4cG9ydHMuc2V0RGVmYXVsdHMgPSAoY29sb3IgPSBkZWZhdWx0cy5jb2xvciwgc2hhZG93Q29sb3IgPSBkZWZhdWx0cy5zaGFkb3dDb2xvciwgc2hhZG93Qmx1ciA9IGRlZmF1bHRzLnNoYWRvd0JsdXIsIHJpcHBsZVRpbWUgPSBkZWZhdWx0cy5yaXBwbGVUaW1lLCBmYWRlVGltZSA9IGRlZmF1bHRzLmZhZGVUaW1lKSAtPlxuXHRkZWZhdWx0cyA9IFxuXHRcdGNvbG9yOiBjb2xvclxuXHRcdHNoYWRvd0NvbG9yOiBzaGFkb3dDb2xvclxuXHRcdHNoYWRvd0JsdXI6IHNoYWRvd0JsdXJcblx0XHRyaXBwbGVUaW1lOiByaXBwbGVUaW1lXG5cdFx0ZmFkZVRpbWU6IGZhZGVUaW1lXG5cblxuZXhwb3J0cy5hZGRSaXBwbGUgPSAobGF5ZXIsIGNvbG9yID0gZGVmYXVsdHMuY29sb3IsIHNoYWRvd0NvbG9yID0gZGVmYXVsdHMuc2hhZG93Q29sb3IsIHNoYWRvd0JsdXIgPSBkZWZhdWx0cy5zaGFkb3dCbHVyKSAtPlxuXG5cdGxheWVyLnNoYWRvd0JsdXIgPSAwXG5cdGxheWVyLnNoYWRvd0NvbG9yID0gc2hhZG93Q29sb3JcblxuXHRsYXllci5vblRhcCAtPlxuXHRcdHMgPSAobGF5ZXIud2lkdGgqMS41KS1sYXllci5ib3JkZXJSYWRpdXNcblx0XHRyaXBwbGUgPSBuZXcgTGF5ZXJcblx0XHRcdHg6IDBcblx0XHRcdHk6IDBcblx0XHRcdHdpZHRoOiBzXG5cdFx0XHRoZWlnaHQ6IHNcblx0XHRcdGJvcmRlclJhZGl1czogcy8yXG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IGNvbG9yXG5cdFx0XHRzY2FsZTogMFxuXHRcdFx0b3BhY2l0eTogMFxuXG5cdFx0bGF5ZXIuYWRkQ2hpbGQocmlwcGxlKVxuXHRcdGxheWVyLmNsaXAgPSB0cnVlXG5cdFx0cmlwcGxlLmNlbnRlcigpXG5cblx0XHRyaXBwbGVPdXQgPSByaXBwbGUuYW5pbWF0ZVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0c2NhbGU6IDEsXG5cdFx0XHRcdG9wYWNpdHk6IDEsXG5cdFx0XHR0aW1lOiBkZWZhdWx0cy5yaXBwbGVUaW1lXG5cblx0XHRsYXllci5hbmltYXRlIFxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0c2hhZG93Qmx1cjogc2hhZG93Qmx1clxuXHRcdFx0dGltZTogZGVmYXVsdHMucmlwcGxlVGltZVxuXG5cdFx0cmlwcGxlT3V0Lm9uIFwiZW5kXCIsIC0+XG5cdFx0XHRyaXBwbGVGYWRlID0gcmlwcGxlLmFuaW1hdGVcblx0XHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0XHRvcGFjaXR5OiAwLFxuXHRcdFx0XHR0aW1lOiBkZWZhdWx0cy5mYWRlVGltZVxuXG5cdFx0XHRsYXllci5hbmltYXRlIFxuXHRcdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRcdHNoYWRvd0JsdXI6IDBcblx0XHRcdFx0dGltZTogZGVmYXVsdHMuZmFkZVRpbWVcblxuXHRcdFx0cmlwcGxlRmFkZS5vbiBcImVuZFwiLCAtPlxuXHRcdFx0XHRyaXBwbGUuZGVzdHJveSgpXG5cblxuXG4iXX0=
