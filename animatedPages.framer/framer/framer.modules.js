require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"AnimatedPages":[function(require,module,exports){
var animations,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

exports.animations = {
  fade: {
    "in": {
      opacity: 1
    },
    out: {
      opacity: -1
    }
  },
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
      y: Screen.height
    }
  },
  slideDown: {
    "in": {
      y: 0
    },
    out: {
      y: -Screen.height
    }
  },
  slideFadeRight: {
    "in": {
      x: 0,
      opacity: 1
    },
    out: {
      x: Screen.width / 8,
      opacity: -1
    }
  },
  slideFadeLeft: {
    "in": {
      x: 0,
      opacity: 1
    },
    out: {
      x: -Screen.width / 8,
      opacity: -1
    }
  },
  slideFadeUp: {
    "in": {
      y: 0,
      opacity: 1
    },
    out: {
      y: Screen.height / 8,
      opacity: -1
    }
  },
  slideFadeDown: {
    "in": {
      y: 0,
      opacity: 1
    },
    out: {
      y: -Screen.height / 8,
      opacity: -1
    }
  }
};

animations = exports.animations;

exports.AnimatedPages = (function(superClass) {
  extend(AnimatedPages, superClass);

  AnimatedPages.prototype.selectedIndex = -1;

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
        _this.resetPage(page);
        return _this.addChild(page);
      };
    })(this));
  };

  AnimatedPages.prototype.resetPage = function(page) {
    var animatable, animation, arr, cascade, i, j, k, l, layer, len, ref, results, v;
    page.visible = false;
    ref = page.children;
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      layer = ref[j];
      if (layer.name.match(/animate_/)) {
        arr = layer.name.split('_');
        animation = arr[arr.indexOf("animate") + 1];
        cascade = false;
        if (animation === "cascade") {
          animation = arr[arr.indexOf("cascade") + 1];
          cascade = true;
        }
        if (animations[animation]) {
          animatable = [];
          if (cascade) {
            animatable = layer.children;
          } else {
            animatable.push(layer);
          }
          results.push((function() {
            var len1, m, results1;
            results1 = [];
            for (i = m = 0, len1 = animatable.length; m < len1; i = ++m) {
              l = animatable[i];
              l["in"] = {};
              l.out = {};
              results1.push((function() {
                var ref1, results2;
                ref1 = animations[animation].out;
                results2 = [];
                for (k in ref1) {
                  v = ref1[k];
                  l["in"][k] = l[k];
                  l.out[k] = l[k] + v;
                  l[k] = l.out[k];
                  results2.push(l["delayIndex"] = i);
                }
                return results2;
              })());
            }
            return results1;
          })());
        } else {
          results.push(void 0);
        }
      } else {
        results.push(void 0);
      }
    }
    return results;
  };

  AnimatedPages.prototype.selectPage = function(pageIndex) {
    var inPage, outPage;
    outPage = this.pages[this.selectedIndex];
    inPage = this.pages[pageIndex];
    console.log(inPage);
    inPage.visible = true;
    this.animateChildren(inPage, outPage, "in");
    if (outPage) {
      this.animateChildren(outPage, inPage, "out");
    }
    this.height = inPage.height;
    this.selectedIndex = pageIndex;
    return this.emit("pages:change:page", this.selectedIndex);
  };

  AnimatedPages.prototype.animateChildren = function(pageA, pageB, state) {
    var animatable;
    animatable = this.getAnimatableChildren(pageA);
    return animatable.forEach(function(l) {
      var a, k, properties, ref, v;
      properties = {};
      ref = l[state];
      for (k in ref) {
        v = ref[k];
        properties[k] = v;
        console.log(l);
      }
      a = new Animation({
        layer: l,
        properties: properties,
        time: 0.3
      });
      return Utils.delay(l.delayIndex * 0.02, function() {
        return a.start();
      });
    });
  };

  AnimatedPages.prototype.getAnimatableChildren = function(layer) {
    var animatable, animation, arr, cascade, j, l, len, ref;
    animatable = [];
    ref = layer.children;
    for (j = 0, len = ref.length; j < len; j++) {
      l = ref[j];
      if (l.name.match(/animate_/)) {
        arr = l.name.split('_');
        animation = arr[arr.indexOf("animate") + 1];
        cascade = false;
        if (animation === "cascade") {
          animation = arr[arr.indexOf("cascade") + 1];
          cascade = true;
          animatable = l.children;
        } else {
          animatable.push(l);
        }
      }
    }
    return animatable;
  };

  return AnimatedPages;

})(Layer);


},{}],"TabComponent":[function(require,module,exports){
var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

exports.TabComponent = (function(superClass) {
  extend(TabComponent, superClass);

  TabComponent.prototype.tabs = [];

  TabComponent.prototype.indicatorHeight = 8;

  TabComponent.prototype.indicatorColor = "#FFF";

  TabComponent.prototype.selectedIndex = -1;

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
    this.selectTab(0);
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
      width: 0,
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
    if (this.selectedIndex !== tabIndex) {
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
      if (outTab) {
        if (outTab.childrenWithName("active").length > 0 && outTab.childrenWithName("inactive").length > 0) {
          outTab.childrenWithName("active")[0].visible = false;
          outTab.childrenWithName("inactive")[0].visible = true;
        }
      }
      if (inTab.childrenWithName("active").length > 0 && inTab.childrenWithName("inactive").length > 0) {
        inTab.childrenWithName("active")[0].visible = true;
        inTab.childrenWithName("inactive")[0].visible = false;
      }
      this.selectedIndex = tabIndex;
      return this.emit("tabs:change:tab", this.selectedIndex);
    }
  };

  TabComponent.prototype.upgradeToTabComponent = function(layer) {
    return print("derp");
  };

  return TabComponent;

})(Layer);


},{}],"myModule":[function(require,module,exports){
exports.myVar = "myVariable";

exports.myFunction = function() {
  return print("myFunction is running");
};

exports.myArray = [1, 2, 3];


},{}]},{},[])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMveWFzaW4vU2l0ZXMvRnJhbWVyIE1vZHVsZXMvYW5pbWF0ZWRQYWdlcy5mcmFtZXIvbW9kdWxlcy9BbmltYXRlZFBhZ2VzLmNvZmZlZSIsIi9Vc2Vycy95YXNpbi9TaXRlcy9GcmFtZXIgTW9kdWxlcy9hbmltYXRlZFBhZ2VzLmZyYW1lci9tb2R1bGVzL1RhYkNvbXBvbmVudC5jb2ZmZWUiLCIvVXNlcnMveWFzaW4vU2l0ZXMvRnJhbWVyIE1vZHVsZXMvYW5pbWF0ZWRQYWdlcy5mcmFtZXIvbW9kdWxlcy9teU1vZHVsZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxJQUFBLFVBQUE7RUFBQTs7O0FBQUEsT0FBTyxDQUFDLFVBQVIsR0FDQztFQUFBLElBQUEsRUFDQztJQUFBLElBQUEsRUFDQztNQUFBLE9BQUEsRUFBUSxDQUFSO0tBREQ7SUFFQSxHQUFBLEVBQ0M7TUFBQSxPQUFBLEVBQVEsQ0FBQyxDQUFUO0tBSEQ7R0FERDtFQU1BLFVBQUEsRUFDQztJQUFBLElBQUEsRUFDQztNQUFBLENBQUEsRUFBRSxDQUFGO0tBREQ7SUFFQSxHQUFBLEVBQ0M7TUFBQSxDQUFBLEVBQUUsTUFBTSxDQUFDLEtBQVQ7S0FIRDtHQVBEO0VBWUEsU0FBQSxFQUNDO0lBQUEsSUFBQSxFQUNDO01BQUEsQ0FBQSxFQUFFLENBQUY7S0FERDtJQUVBLEdBQUEsRUFDQztNQUFBLENBQUEsRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFWO0tBSEQ7R0FiRDtFQWtCQSxPQUFBLEVBQ0M7SUFBQSxJQUFBLEVBQ0M7TUFBQSxDQUFBLEVBQUUsQ0FBRjtLQUREO0lBRUEsR0FBQSxFQUNDO01BQUEsQ0FBQSxFQUFFLE1BQU0sQ0FBQyxNQUFUO0tBSEQ7R0FuQkQ7RUF3QkEsU0FBQSxFQUNDO0lBQUEsSUFBQSxFQUNDO01BQUEsQ0FBQSxFQUFFLENBQUY7S0FERDtJQUVBLEdBQUEsRUFDQztNQUFBLENBQUEsRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFWO0tBSEQ7R0F6QkQ7RUE4QkEsY0FBQSxFQUNDO0lBQUEsSUFBQSxFQUNDO01BQUEsQ0FBQSxFQUFFLENBQUY7TUFDQSxPQUFBLEVBQVEsQ0FEUjtLQUREO0lBR0EsR0FBQSxFQUNDO01BQUEsQ0FBQSxFQUFFLE1BQU0sQ0FBQyxLQUFQLEdBQWEsQ0FBZjtNQUNBLE9BQUEsRUFBUSxDQUFDLENBRFQ7S0FKRDtHQS9CRDtFQXNDQSxhQUFBLEVBQ0M7SUFBQSxJQUFBLEVBQ0M7TUFBQSxDQUFBLEVBQUUsQ0FBRjtNQUNBLE9BQUEsRUFBUSxDQURSO0tBREQ7SUFHQSxHQUFBLEVBQ0M7TUFBQSxDQUFBLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBUixHQUFjLENBQWhCO01BQ0EsT0FBQSxFQUFRLENBQUMsQ0FEVDtLQUpEO0dBdkNEO0VBOENBLFdBQUEsRUFDQztJQUFBLElBQUEsRUFDQztNQUFBLENBQUEsRUFBRSxDQUFGO01BQ0EsT0FBQSxFQUFRLENBRFI7S0FERDtJQUdBLEdBQUEsRUFDQztNQUFBLENBQUEsRUFBRSxNQUFNLENBQUMsTUFBUCxHQUFjLENBQWhCO01BQ0EsT0FBQSxFQUFRLENBQUMsQ0FEVDtLQUpEO0dBL0NEO0VBc0RBLGFBQUEsRUFDQztJQUFBLElBQUEsRUFDQztNQUFBLENBQUEsRUFBRSxDQUFGO01BQ0EsT0FBQSxFQUFRLENBRFI7S0FERDtJQUdBLEdBQUEsRUFDQztNQUFBLENBQUEsRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFSLEdBQWUsQ0FBakI7TUFDQSxPQUFBLEVBQVEsQ0FBQyxDQURUO0tBSkQ7R0F2REQ7OztBQWdFRCxVQUFBLEdBQWEsT0FBTyxDQUFDOztBQUdmLE9BQU8sQ0FBQzs7OzBCQUNiLGFBQUEsR0FBYyxDQUFDOztFQWNGLHVCQUFDLE9BQUQ7QUFDWixRQUFBOztNQURhLFVBQVE7O0lBQ3JCLElBQUcsT0FBTyxDQUFDLFlBQVg7TUFDQyxLQUFBLEdBQVEsT0FBTyxDQUFDO01BQ2hCLE9BQU8sQ0FBQyxLQUFSLEdBQWdCLEtBQUssQ0FBQztNQUN0QixPQUFPLENBQUMsSUFBUixHQUFlLEtBQUssQ0FBQztNQUNyQixPQUFPLENBQUMsS0FBUixHQUFnQixLQUFLLENBQUM7TUFDdEIsK0NBQU0sT0FBTjtNQUNBLEtBQUssQ0FBQyxNQUFNLENBQUMsUUFBYixDQUFzQixJQUF0QjtNQUNBLElBQUksQ0FBQyxXQUFMLENBQWlCLEtBQWpCO01BQ0EsS0FBSyxDQUFDLE9BQU4sQ0FBQSxFQVJEO0tBQUEsTUFBQTtNQVVDLCtDQUFNLE9BQU4sRUFWRDs7SUFhQSxJQUFJLENBQUMsS0FBTCxHQUFhLE9BQU8sQ0FBQztJQUNyQixJQUFJLENBQUMsU0FBTCxDQUFBO0lBQ0EsSUFBSSxDQUFDLFVBQUwsQ0FBZ0IsQ0FBaEI7RUFoQlk7OzBCQW1CYixTQUFBLEdBQVUsU0FBQTtXQUNULElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixDQUFBLFNBQUEsS0FBQTthQUFBLFNBQUMsSUFBRCxFQUFPLENBQVA7UUFDbEIsSUFBSSxDQUFDLENBQUwsR0FBUztRQUNULElBQUksQ0FBQyxDQUFMLEdBQVM7UUFJVCxLQUFJLENBQUMsU0FBTCxDQUFlLElBQWY7ZUFDQSxLQUFJLENBQUMsUUFBTCxDQUFjLElBQWQ7TUFQa0I7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQW5CO0VBRFM7OzBCQWtDVixTQUFBLEdBQVUsU0FBQyxJQUFEO0FBQ1QsUUFBQTtJQUFBLElBQUksQ0FBQyxPQUFMLEdBQWU7QUFDZjtBQUFBO1NBQUEscUNBQUE7O01BRUMsSUFBRyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQVgsQ0FBaUIsVUFBakIsQ0FBSDtRQUNDLEdBQUEsR0FBTSxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQVgsQ0FBaUIsR0FBakI7UUFDTixTQUFBLEdBQVksR0FBSSxDQUFBLEdBQUcsQ0FBQyxPQUFKLENBQVksU0FBWixDQUFBLEdBQXVCLENBQXZCO1FBQ2hCLE9BQUEsR0FBVTtRQUVWLElBQUcsU0FBQSxLQUFhLFNBQWhCO1VBQ0MsU0FBQSxHQUFZLEdBQUksQ0FBQSxHQUFHLENBQUMsT0FBSixDQUFZLFNBQVosQ0FBQSxHQUF1QixDQUF2QjtVQUNoQixPQUFBLEdBQVUsS0FGWDs7UUFJQSxJQUFHLFVBQVcsQ0FBQSxTQUFBLENBQWQ7VUFFQyxVQUFBLEdBQWE7VUFDYixJQUFHLE9BQUg7WUFDQyxVQUFBLEdBQWEsS0FBSyxDQUFDLFNBRHBCO1dBQUEsTUFBQTtZQUdDLFVBQVUsQ0FBQyxJQUFYLENBQWdCLEtBQWhCLEVBSEQ7Ozs7QUFLQTtpQkFBQSxzREFBQTs7Y0FDQyxDQUFDLENBQUMsSUFBRCxDQUFELEdBQU87Y0FDUCxDQUFDLENBQUMsR0FBRixHQUFROzs7QUFDUjtBQUFBO3FCQUFBLFNBQUE7O2tCQUtDLENBQUMsQ0FBQyxJQUFELENBQUksQ0FBQSxDQUFBLENBQUwsR0FBVyxDQUFFLENBQUEsQ0FBQTtrQkFDYixDQUFDLENBQUMsR0FBSSxDQUFBLENBQUEsQ0FBTixHQUFXLENBQUUsQ0FBQSxDQUFBLENBQUYsR0FBSztrQkFDaEIsQ0FBRSxDQUFBLENBQUEsQ0FBRixHQUFPLENBQUMsQ0FBQyxHQUFJLENBQUEsQ0FBQTtnQ0FFYixDQUFFLENBQUEsWUFBQSxDQUFGLEdBQWtCO0FBVG5COzs7QUFIRDs7Z0JBUkQ7U0FBQSxNQUFBOytCQUFBO1NBVEQ7T0FBQSxNQUFBOzZCQUFBOztBQUZEOztFQUZTOzswQkFzQ1YsVUFBQSxHQUFXLFNBQUMsU0FBRDtBQUVWLFFBQUE7SUFBQSxPQUFBLEdBQVUsSUFBSSxDQUFDLEtBQU0sQ0FBQSxJQUFJLENBQUMsYUFBTDtJQUNyQixNQUFBLEdBQVMsSUFBSSxDQUFDLEtBQU0sQ0FBQSxTQUFBO0lBRXBCLE9BQU8sQ0FBQyxHQUFSLENBQVksTUFBWjtJQU1BLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0lBQ2pCLElBQUksQ0FBQyxlQUFMLENBQXFCLE1BQXJCLEVBQTZCLE9BQTdCLEVBQXNDLElBQXRDO0lBQ0EsSUFBRyxPQUFIO01BQ0MsSUFBSSxDQUFDLGVBQUwsQ0FBcUIsT0FBckIsRUFBOEIsTUFBOUIsRUFBc0MsS0FBdEMsRUFERDs7SUFJQSxJQUFJLENBQUMsTUFBTCxHQUFjLE1BQU0sQ0FBQztJQUVyQixJQUFJLENBQUMsYUFBTCxHQUFxQjtXQUNyQixJQUFJLENBQUMsSUFBTCxDQUFVLG1CQUFWLEVBQStCLElBQUksQ0FBQyxhQUFwQztFQXBCVTs7MEJBd0JYLGVBQUEsR0FBZ0IsU0FBQyxLQUFELEVBQVEsS0FBUixFQUFlLEtBQWY7QUFFZixRQUFBO0lBQUEsVUFBQSxHQUFhLElBQUksQ0FBQyxxQkFBTCxDQUEyQixLQUEzQjtXQVFiLFVBQVUsQ0FBQyxPQUFYLENBQW1CLFNBQUMsQ0FBRDtBQUVsQixVQUFBO01BQUEsVUFBQSxHQUFhO0FBRWI7QUFBQSxXQUFBLFFBQUE7O1FBQ0MsVUFBVyxDQUFBLENBQUEsQ0FBWCxHQUFnQjtRQUVoQixPQUFPLENBQUMsR0FBUixDQUFZLENBQVo7QUFIRDtNQU9BLENBQUEsR0FBUSxJQUFBLFNBQUEsQ0FDUDtRQUFBLEtBQUEsRUFBTSxDQUFOO1FBQ0EsVUFBQSxFQUFXLFVBRFg7UUFFQSxJQUFBLEVBQUssR0FGTDtPQURPO2FBTVIsS0FBSyxDQUFDLEtBQU4sQ0FBWSxDQUFDLENBQUMsVUFBRixHQUFhLElBQXpCLEVBQStCLFNBQUE7ZUFDOUIsQ0FBQyxDQUFDLEtBQUYsQ0FBQTtNQUQ4QixDQUEvQjtJQWpCa0IsQ0FBbkI7RUFWZTs7MEJBK0JoQixxQkFBQSxHQUFzQixTQUFDLEtBQUQ7QUFDckIsUUFBQTtJQUFBLFVBQUEsR0FBYTtBQUNiO0FBQUEsU0FBQSxxQ0FBQTs7TUFFQyxJQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBUCxDQUFhLFVBQWIsQ0FBSDtRQUNDLEdBQUEsR0FBTSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQVAsQ0FBYSxHQUFiO1FBQ04sU0FBQSxHQUFZLEdBQUksQ0FBQSxHQUFHLENBQUMsT0FBSixDQUFZLFNBQVosQ0FBQSxHQUF1QixDQUF2QjtRQUVoQixPQUFBLEdBQVU7UUFFVixJQUFHLFNBQUEsS0FBYSxTQUFoQjtVQUVDLFNBQUEsR0FBWSxHQUFJLENBQUEsR0FBRyxDQUFDLE9BQUosQ0FBWSxTQUFaLENBQUEsR0FBdUIsQ0FBdkI7VUFDaEIsT0FBQSxHQUFVO1VBQ1YsVUFBQSxHQUFhLENBQUMsQ0FBQyxTQUpoQjtTQUFBLE1BQUE7VUFNQyxVQUFVLENBQUMsSUFBWCxDQUFnQixDQUFoQixFQU5EO1NBTkQ7O0FBRkQ7QUFrQkEsV0FBTztFQXBCYzs7OztHQWpLYTs7OztBQzlEcEMsSUFBQTs7O0FBQU0sT0FBTyxDQUFDOzs7eUJBQ2IsSUFBQSxHQUFNOzt5QkFDTixlQUFBLEdBQWlCOzt5QkFDakIsY0FBQSxHQUFnQjs7eUJBQ2hCLGFBQUEsR0FBZSxDQUFDOztFQUVILHNCQUFDLE9BQUQ7QUFDWixRQUFBOztNQURhLFVBQVE7O0lBQ3JCLElBQUksT0FBTyxDQUFDLFlBQVo7TUFDQyxLQUFBLEdBQVEsT0FBTyxDQUFDO01BQ2hCLE9BQU8sQ0FBQyxDQUFSLEdBQVksS0FBSyxDQUFDO01BQ2xCLE9BQU8sQ0FBQyxDQUFSLEdBQVksS0FBSyxDQUFDO01BQ2xCLE9BQU8sQ0FBQyxNQUFSLEdBQWlCLEtBQUssQ0FBQztNQUN2QixPQUFPLENBQUMsS0FBUixHQUFnQixJQUFJLENBQUMsR0FBTCxDQUFTLEtBQUssQ0FBQyxLQUFmLEVBQXNCLE1BQU0sQ0FBQyxLQUE3QjtNQUNoQixPQUFPLENBQUMsSUFBUixHQUFlLEtBQUssQ0FBQztNQUNyQixPQUFPLENBQUMsSUFBUixHQUFlLEtBQUssQ0FBQztNQUNyQiw4Q0FBTSxPQUFOO01BQ0EsS0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFiLENBQXNCLElBQXRCO01BQ0EsSUFBSSxDQUFDLFdBQUwsQ0FBaUIsS0FBakI7TUFDQSxLQUFLLENBQUMsT0FBTixDQUFBLEVBWEQ7S0FBQSxNQUFBO01BY0MsOENBQU0sT0FBTixFQWREOztJQWdCQSxJQUFJLENBQUMsSUFBTCxHQUFZLE9BQU8sQ0FBQztJQUNwQixJQUFJLENBQUMsVUFBTCxHQUFrQixJQUFJLENBQUMsVUFBTCxDQUFBO0lBQ2xCLElBQUksQ0FBQyxZQUFMLENBQUE7SUFJQSxJQUFHLE9BQU8sQ0FBQyxjQUFSLENBQXVCLGlCQUF2QixDQUFIO01BQ0MsSUFBSSxDQUFDLGVBQUwsR0FBdUIsT0FBTyxDQUFDLGdCQURoQzs7SUFHQSxJQUFHLE9BQU8sQ0FBQyxjQUFSLENBQXVCLGdCQUF2QixDQUFIO01BQ0MsSUFBSSxDQUFDLGNBQUwsR0FBc0IsT0FBTyxDQUFDLGVBRC9COztJQUdBLElBQUksQ0FBQyxTQUFMLEdBQWlCLElBQUksQ0FBQyxhQUFMLENBQUE7SUFFakIsSUFBSSxDQUFDLFNBQUwsQ0FBZSxDQUFmO0VBL0JZOzt5QkFrQ2IsVUFBQSxHQUFZLFNBQUE7QUFDWCxRQUFBO0lBQUEsVUFBQSxHQUFpQixJQUFBLGVBQUEsQ0FDaEI7TUFBQSxJQUFBLEVBQU0sSUFBSSxDQUFDLElBQVg7TUFDQSxjQUFBLEVBQWdCLEtBRGhCO01BRUEsZ0JBQUEsRUFBa0IsSUFGbEI7TUFHQSxJQUFBLEVBQU0sZUFITjtNQUlBLE1BQUEsRUFBUSxJQUpSO0tBRGdCO0FBT2pCLFdBQU87RUFSSTs7eUJBVVosYUFBQSxHQUFlLFNBQUE7QUFDZCxRQUFBO0lBQUEsU0FBQSxHQUFnQixJQUFBLEtBQUEsQ0FDZjtNQUFBLENBQUEsRUFBRSxDQUFGO01BQ0EsQ0FBQSxFQUFFLElBQUksQ0FBQyxNQUFMLEdBQVksSUFBSSxDQUFDLGVBRG5CO01BRUEsS0FBQSxFQUFNLENBRk47TUFHQSxNQUFBLEVBQU8sSUFBSSxDQUFDLGVBSFo7TUFJQSxlQUFBLEVBQWdCLElBQUksQ0FBQyxjQUpyQjtNQUtBLE1BQUEsRUFBUSxJQUFJLENBQUMsVUFBVSxDQUFDLE9BTHhCO0tBRGU7QUFPaEIsV0FBTztFQVJPOzt5QkFVZixZQUFBLEdBQWMsU0FBQTtBQUNiLFFBQUE7SUFBQSxDQUFBLEdBQUk7SUFDSixJQUFJLENBQUMsSUFBSSxDQUFDLE9BQVYsQ0FBa0IsQ0FBQSxTQUFBLEtBQUE7YUFBQSxTQUFDLEdBQUQsRUFBTSxDQUFOO1FBQ2pCLElBQUcsR0FBRyxDQUFDLGdCQUFKLENBQXFCLFFBQXJCLENBQThCLENBQUMsTUFBL0IsR0FBd0MsQ0FBeEMsSUFBNkMsR0FBRyxDQUFDLGdCQUFKLENBQXFCLFVBQXJCLENBQWdDLENBQUMsTUFBakMsR0FBMEMsQ0FBMUY7VUFDQyxHQUFHLENBQUMsZ0JBQUosQ0FBcUIsUUFBckIsQ0FBK0IsQ0FBQSxDQUFBLENBQUUsQ0FBQyxPQUFsQyxHQUE0QztVQUM1QyxHQUFHLENBQUMsZ0JBQUosQ0FBcUIsVUFBckIsQ0FBaUMsQ0FBQSxDQUFBLENBQUUsQ0FBQyxPQUFwQyxHQUE4QyxLQUYvQzs7UUFJQSxHQUFHLENBQUMsQ0FBSixHQUFRO1FBQ1IsR0FBRyxDQUFDLFFBQUosR0FBZTtRQUNmLEdBQUcsQ0FBQyxLQUFKLENBQVUsU0FBQTtpQkFDVCxLQUFJLENBQUMsU0FBTCxDQUFlLEdBQUcsQ0FBQyxRQUFuQjtRQURTLENBQVY7UUFHQSxLQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxRQUF4QixDQUFpQyxHQUFqQztlQUNBLENBQUEsR0FBSSxDQUFBLEdBQUUsR0FBRyxDQUFDO01BWE87SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxCO0lBYUEsSUFBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxLQUF4QixJQUFpQyxJQUFJLENBQUMsS0FBekM7YUFDQyxJQUFJLENBQUMsVUFBVSxDQUFDLGdCQUFoQixHQUFtQyxNQURwQzs7RUFmYTs7eUJBa0JkLFNBQUEsR0FBVSxTQUFDLFFBQUQ7QUFDVCxRQUFBO0lBQUEsSUFBRyxJQUFJLENBQUMsYUFBTCxLQUFzQixRQUF6QjtNQUNDLE1BQUEsR0FBUyxJQUFJLENBQUMsSUFBSyxDQUFBLElBQUksQ0FBQyxhQUFMO01BQ25CLEtBQUEsR0FBUSxJQUFJLENBQUMsSUFBSyxDQUFBLFFBQUE7TUFFbEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFoQixDQUE4QixLQUE5QixFQUFxQyxHQUFyQyxFQUEwQyxHQUExQyxFQUErQztRQUFBLElBQUEsRUFBSyxHQUFMO09BQS9DO01BQ0EsS0FBSyxDQUFDLFdBQU4sQ0FBa0IsSUFBSSxDQUFDLFNBQXZCO01BRUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFmLENBQ0M7UUFBQSxVQUFBLEVBQ0M7VUFBQSxLQUFBLEVBQU8sS0FBSyxDQUFDLEtBQWI7VUFDQSxDQUFBLEVBQUcsS0FBSyxDQUFDLENBRFQ7U0FERDtRQUdBLElBQUEsRUFBSyxHQUhMO09BREQ7TUFNQSxJQUFHLE1BQUg7UUFDQyxJQUFHLE1BQU0sQ0FBQyxnQkFBUCxDQUF3QixRQUF4QixDQUFpQyxDQUFDLE1BQWxDLEdBQTJDLENBQTNDLElBQWdELE1BQU0sQ0FBQyxnQkFBUCxDQUF3QixVQUF4QixDQUFtQyxDQUFDLE1BQXBDLEdBQTZDLENBQWhHO1VBQ0MsTUFBTSxDQUFDLGdCQUFQLENBQXdCLFFBQXhCLENBQWtDLENBQUEsQ0FBQSxDQUFFLENBQUMsT0FBckMsR0FBK0M7VUFDL0MsTUFBTSxDQUFDLGdCQUFQLENBQXdCLFVBQXhCLENBQW9DLENBQUEsQ0FBQSxDQUFFLENBQUMsT0FBdkMsR0FBaUQsS0FGbEQ7U0FERDs7TUFLQSxJQUFHLEtBQUssQ0FBQyxnQkFBTixDQUF1QixRQUF2QixDQUFnQyxDQUFDLE1BQWpDLEdBQTBDLENBQTFDLElBQStDLEtBQUssQ0FBQyxnQkFBTixDQUF1QixVQUF2QixDQUFrQyxDQUFDLE1BQW5DLEdBQTRDLENBQTlGO1FBQ0MsS0FBSyxDQUFDLGdCQUFOLENBQXVCLFFBQXZCLENBQWlDLENBQUEsQ0FBQSxDQUFFLENBQUMsT0FBcEMsR0FBOEM7UUFDOUMsS0FBSyxDQUFDLGdCQUFOLENBQXVCLFVBQXZCLENBQW1DLENBQUEsQ0FBQSxDQUFFLENBQUMsT0FBdEMsR0FBZ0QsTUFGakQ7O01BTUEsSUFBSSxDQUFDLGFBQUwsR0FBcUI7YUFDckIsSUFBSSxDQUFDLElBQUwsQ0FBVSxpQkFBVixFQUE2QixJQUFJLENBQUMsYUFBbEMsRUF6QkQ7O0VBRFM7O3lCQTZCVixxQkFBQSxHQUFzQixTQUFDLEtBQUQ7V0FDckIsS0FBQSxDQUFNLE1BQU47RUFEcUI7Ozs7R0EzR1k7Ozs7QUNGbkMsT0FBTyxDQUFDLEtBQVIsR0FBZ0I7O0FBRWhCLE9BQU8sQ0FBQyxVQUFSLEdBQXFCLFNBQUE7U0FDcEIsS0FBQSxDQUFNLHVCQUFOO0FBRG9COztBQUdyQixPQUFPLENBQUMsT0FBUixHQUFrQixDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJleHBvcnRzLmFuaW1hdGlvbnMgPVxuXHRmYWRlOlxuXHRcdGluOlxuXHRcdFx0b3BhY2l0eToxXG5cdFx0b3V0OiBcblx0XHRcdG9wYWNpdHk6LTFcblxuXHRzbGlkZVJpZ2h0OlxuXHRcdGluOlxuXHRcdFx0eDowXG5cdFx0b3V0OiBcblx0XHRcdHg6U2NyZWVuLndpZHRoXG5cblx0c2xpZGVMZWZ0OlxuXHRcdGluOlxuXHRcdFx0eDowXG5cdFx0b3V0OiBcblx0XHRcdHg6LVNjcmVlbi53aWR0aFxuXG5cdHNsaWRlVXA6XG5cdFx0aW46XG5cdFx0XHR5OjBcblx0XHRvdXQ6IFxuXHRcdFx0eTpTY3JlZW4uaGVpZ2h0XG5cblx0c2xpZGVEb3duOlxuXHRcdGluOlxuXHRcdFx0eTowXG5cdFx0b3V0OiBcblx0XHRcdHk6LVNjcmVlbi5oZWlnaHRcblxuXHRzbGlkZUZhZGVSaWdodDpcblx0XHRpbjpcblx0XHRcdHg6MFxuXHRcdFx0b3BhY2l0eToxXG5cdFx0b3V0OiBcblx0XHRcdHg6U2NyZWVuLndpZHRoLzhcblx0XHRcdG9wYWNpdHk6LTFcblxuXHRzbGlkZUZhZGVMZWZ0OlxuXHRcdGluOlxuXHRcdFx0eDowXG5cdFx0XHRvcGFjaXR5OjFcblx0XHRvdXQ6IFxuXHRcdFx0eDotU2NyZWVuLndpZHRoLzhcblx0XHRcdG9wYWNpdHk6LTFcblxuXHRzbGlkZUZhZGVVcDpcblx0XHRpbjpcblx0XHRcdHk6MFxuXHRcdFx0b3BhY2l0eToxXG5cdFx0b3V0OiBcblx0XHRcdHk6U2NyZWVuLmhlaWdodC84XG5cdFx0XHRvcGFjaXR5Oi0xXG5cblx0c2xpZGVGYWRlRG93bjpcblx0XHRpbjpcblx0XHRcdHk6MFxuXHRcdFx0b3BhY2l0eToxXG5cdFx0b3V0OiBcblx0XHRcdHk6LVNjcmVlbi5oZWlnaHQvOFxuXHRcdFx0b3BhY2l0eTotMVxuXG5cblxuYW5pbWF0aW9ucyA9IGV4cG9ydHMuYW5pbWF0aW9uc1xuXG5cbmNsYXNzIGV4cG9ydHMuQW5pbWF0ZWRQYWdlcyBleHRlbmRzIExheWVyXG5cdHNlbGVjdGVkSW5kZXg6LTFcblx0IyBkZWZhdWx0SW5BbmltYXRpb246XG5cdCMgXHRwcm9wZXJ0aWVzOlxuXHQjIFx0XHRvcGFjaXR5OjFcblx0IyBcdFx0eTowXG5cdCMgXHR0aW1lOjAuM1xuXG5cdCMgZGVmYXVsdE91dEFuaW1hdGlvbjpcblx0IyBcdHByb3BlcnRpZXM6XG5cdCMgXHRcdG9wYWNpdHk6MFxuXHQjIFx0XHR5OiczMyUnXG5cdCMgXHR0aW1lOjAuM1xuXG5cblx0Y29uc3RydWN0b3I6IChvcHRpb25zPXt9KSAtPlxuXHRcdGlmIG9wdGlvbnMudXBncmFkZUxheWVyXG5cdFx0XHRsYXllciA9IG9wdGlvbnMudXBncmFkZUxheWVyXG5cdFx0XHRvcHRpb25zLmZyYW1lID0gbGF5ZXIuZnJhbWVcblx0XHRcdG9wdGlvbnMubmFtZSA9IGxheWVyLm5hbWVcblx0XHRcdG9wdGlvbnMucGFnZXMgPSBsYXllci5jaGlsZHJlblxuXHRcdFx0c3VwZXIob3B0aW9ucylcblx0XHRcdGxheWVyLnBhcmVudC5hZGRDaGlsZCh0aGlzKVxuXHRcdFx0dGhpcy5wbGFjZUJlaGluZChsYXllcilcblx0XHRcdGxheWVyLmRlc3Ryb3koKVxuXHRcdGVsc2Vcblx0XHRcdHN1cGVyKG9wdGlvbnMpXG5cblxuXHRcdHRoaXMucGFnZXMgPSBvcHRpb25zLnBhZ2VzXG5cdFx0dGhpcy5tYWtlUGFnZXMoKVxuXHRcdHRoaXMuc2VsZWN0UGFnZSgwKVxuXG5cblx0bWFrZVBhZ2VzOigpLT5cblx0XHR0aGlzLnBhZ2VzLmZvckVhY2ggKHBhZ2UsIGkpID0+XG5cdFx0XHRwYWdlLnggPSAwXG5cdFx0XHRwYWdlLnkgPSAwXG5cdFx0XHQjIHBhZ2Uub3BhY2l0eSA9IDBcblx0XHRcdCMgcGFnZS52aXNpYmxlID0gZmFsc2U7XG5cdFx0XHQjIHRoaXMuc2V0QW5pbWF0aW9uc0ZvckxheWVyKHBhZ2UsIFwic2xpZGVGYWRlVXBcIiwgXCJzbGlkZUZhZGVEb3duXCIpXG5cdFx0XHR0aGlzLnJlc2V0UGFnZShwYWdlKVxuXHRcdFx0dGhpcy5hZGRDaGlsZChwYWdlKVxuXG5cblx0IyBzZXRBbmltYXRpb25zRm9yTGF5ZXI6KGxheWVyLCBpbkFuaW1hdGlvbk5hbWUsIG91dEFuaW1hdGlvbk5hbWUpIC0+XG5cblx0IyBcdGluQW5pbWF0aW9uID0gbmV3IEFuaW1hdGlvblxuXHQjIFx0XHRsYXllcjpsYXllclxuXHQjIFx0XHRwcm9wZXJ0aWVzOmFuaW1hdGlvbnNbaW5BbmltYXRpb25OYW1lXS5pblxuXHQjIFx0XHR0aW1lOjAuM1xuXG5cdCMgXHRvdXRBbmltYXRpb24gPSBuZXcgQW5pbWF0aW9uXG5cdCMgXHRcdGxheWVyOmxheWVyXG5cdCMgXHRcdHByb3BlcnRpZXM6YW5pbWF0aW9uc1tvdXRBbmltYXRpb25OYW1lXS5vdXRcblx0IyBcdFx0dGltZTowLjNcblxuXHRcdFxuXHQjIFx0aW5BbmltYXRpb24ub24gRXZlbnRzLkFuaW1hdGlvblN0YXJ0LCAoKSAtPlxuXHQjIFx0XHR0aGlzLl90YXJnZXQudmlzaWJsZSA9IHRydWU7XG5cblx0IyBcdG91dEFuaW1hdGlvbi5vbiBFdmVudHMuQW5pbWF0aW9uRW5kLCAoKSAtPlxuXHQjIFx0XHR0aGlzLl90YXJnZXQudmlzaWJsZSA9IGZhbHNlO1xuXG5cdCMgXHRsYXllci5pbkFuaW1hdGlvbiA9IGluQW5pbWF0aW9uXG5cdCMgXHRsYXllci5vdXRBbmltYXRpb24gPSBvdXRBbmltYXRpb25cblxuXG5cdHJlc2V0UGFnZToocGFnZSktPlxuXHRcdHBhZ2UudmlzaWJsZSA9IGZhbHNlO1xuXHRcdGZvciBsYXllciBpbiBwYWdlLmNoaWxkcmVuXG5cblx0XHRcdGlmIGxheWVyLm5hbWUubWF0Y2goL2FuaW1hdGVfLylcblx0XHRcdFx0YXJyID0gbGF5ZXIubmFtZS5zcGxpdCgnXycpXG5cdFx0XHRcdGFuaW1hdGlvbiA9IGFyclthcnIuaW5kZXhPZihcImFuaW1hdGVcIikrMV1cblx0XHRcdFx0Y2FzY2FkZSA9IGZhbHNlXG5cblx0XHRcdFx0aWYgYW5pbWF0aW9uID09IFwiY2FzY2FkZVwiXG5cdFx0XHRcdFx0YW5pbWF0aW9uID0gYXJyW2Fyci5pbmRleE9mKFwiY2FzY2FkZVwiKSsxXVxuXHRcdFx0XHRcdGNhc2NhZGUgPSB0cnVlXG5cblx0XHRcdFx0aWYgYW5pbWF0aW9uc1thbmltYXRpb25dXG5cdFx0XHRcdFx0I3ByaW50IGFuaW1hdGlvbnNbYW5pbWF0aW9uXS5vdXRcblx0XHRcdFx0XHRhbmltYXRhYmxlID0gW11cblx0XHRcdFx0XHRpZiBjYXNjYWRlXG5cdFx0XHRcdFx0XHRhbmltYXRhYmxlID0gbGF5ZXIuY2hpbGRyZW5cblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRhbmltYXRhYmxlLnB1c2gobGF5ZXIpXG5cblx0XHRcdFx0XHRmb3IgbCwgaSBpbiBhbmltYXRhYmxlXG5cdFx0XHRcdFx0XHRsLmluID0ge31cblx0XHRcdFx0XHRcdGwub3V0ID0ge31cblx0XHRcdFx0XHRcdGZvciBrLCB2IG9mIGFuaW1hdGlvbnNbYW5pbWF0aW9uXS5vdXRcblx0XHRcdFx0XHRcdFx0I3ByaW50IGssIHZcblxuXHRcdFx0XHRcdFx0XHRcblxuXHRcdFx0XHRcdFx0XHRsLmluW2tdID0gIGxba11cblx0XHRcdFx0XHRcdFx0bC5vdXRba10gPSBsW2tdK3Zcblx0XHRcdFx0XHRcdFx0bFtrXSA9IGwub3V0W2tdXG5cblx0XHRcdFx0XHRcdFx0bFtcImRlbGF5SW5kZXhcIl0gPSBpXG5cblx0XHRcdFx0XG5cblxuXHRzZWxlY3RQYWdlOihwYWdlSW5kZXgpLT5cblxuXHRcdG91dFBhZ2UgPSB0aGlzLnBhZ2VzW3RoaXMuc2VsZWN0ZWRJbmRleF1cblx0XHRpblBhZ2UgPSB0aGlzLnBhZ2VzW3BhZ2VJbmRleF1cblxuXHRcdGNvbnNvbGUubG9nKGluUGFnZSlcblxuXHRcdCMgb3V0UGFnZS5vdXRBbmltYXRpb24uc3RhcnQoKTtcblx0XHQjIGluUGFnZS5pbkFuaW1hdGlvbi5zdGFydCgpO1xuXHRcdFxuXHRcdCMgdGhpcy5yZXNldFBhZ2UoaW5QYWdlKVxuXHRcdGluUGFnZS52aXNpYmxlID0gdHJ1ZVxuXHRcdHRoaXMuYW5pbWF0ZUNoaWxkcmVuKGluUGFnZSwgb3V0UGFnZSwgXCJpblwiKVxuXHRcdGlmIG91dFBhZ2Vcblx0XHRcdHRoaXMuYW5pbWF0ZUNoaWxkcmVuKG91dFBhZ2UsIGluUGFnZSwgXCJvdXRcIilcblxuXG5cdFx0dGhpcy5oZWlnaHQgPSBpblBhZ2UuaGVpZ2h0XG5cblx0XHR0aGlzLnNlbGVjdGVkSW5kZXggPSBwYWdlSW5kZXhcblx0XHR0aGlzLmVtaXQoXCJwYWdlczpjaGFuZ2U6cGFnZVwiLCB0aGlzLnNlbGVjdGVkSW5kZXgpXG5cblxuXG5cdGFuaW1hdGVDaGlsZHJlbjoocGFnZUEsIHBhZ2VCLCBzdGF0ZSktPlxuXG5cdFx0YW5pbWF0YWJsZSA9IHRoaXMuZ2V0QW5pbWF0YWJsZUNoaWxkcmVuKHBhZ2VBKVxuXHRcdFxuXG5cblx0XHRcdFx0IyBpZiBhcnIuaW5kZXhPZltcInNoYXJlZFwiXVxuXG5cdFx0I3ByaW50IGFuaW1hdGFibGVcblxuXHRcdGFuaW1hdGFibGUuZm9yRWFjaCAobCkgLT5cblx0XHRcdFxuXHRcdFx0cHJvcGVydGllcyA9IHt9XG5cblx0XHRcdGZvciBrLCB2IG9mIGxbc3RhdGVdXG5cdFx0XHRcdHByb3BlcnRpZXNba10gPSB2XG5cblx0XHRcdFx0Y29uc29sZS5sb2cobClcblxuXHRcdFx0IyBwcmludCBwcm9wZXJ0aWVzXG5cblx0XHRcdGEgPSBuZXcgQW5pbWF0aW9uXG5cdFx0XHRcdGxheWVyOmxcblx0XHRcdFx0cHJvcGVydGllczpwcm9wZXJ0aWVzXG5cdFx0XHRcdHRpbWU6MC4zXG5cblxuXHRcdFx0VXRpbHMuZGVsYXkgbC5kZWxheUluZGV4KjAuMDIsIC0+XG5cdFx0XHRcdGEuc3RhcnQoKTtcblx0XHRcdFx0IyBwcmludCBhbmltYXRpb25zW2FuaW1hdGlvbl1bc3RhdGVdXG5cblx0Z2V0QW5pbWF0YWJsZUNoaWxkcmVuOihsYXllcikgLT5cblx0XHRhbmltYXRhYmxlID0gW11cblx0XHRmb3IgbCBpbiBsYXllci5jaGlsZHJlblxuXG5cdFx0XHRpZiBsLm5hbWUubWF0Y2goL2FuaW1hdGVfLylcblx0XHRcdFx0YXJyID0gbC5uYW1lLnNwbGl0KCdfJylcblx0XHRcdFx0YW5pbWF0aW9uID0gYXJyW2Fyci5pbmRleE9mKFwiYW5pbWF0ZVwiKSsxXVxuXHRcdFx0XHRcblx0XHRcdFx0Y2FzY2FkZSA9IGZhbHNlXG5cdFx0XHRcdFxuXHRcdFx0XHRpZiBhbmltYXRpb24gPT0gXCJjYXNjYWRlXCJcblx0XHRcdFx0XHQjIHByaW50IFwic2hvdWxkIGNhc2NhZGVcIlxuXHRcdFx0XHRcdGFuaW1hdGlvbiA9IGFyclthcnIuaW5kZXhPZihcImNhc2NhZGVcIikrMV1cblx0XHRcdFx0XHRjYXNjYWRlID0gdHJ1ZVxuXHRcdFx0XHRcdGFuaW1hdGFibGUgPSBsLmNoaWxkcmVuXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRhbmltYXRhYmxlLnB1c2gobClcblxuXHRcdFx0XHQjIGlmXG5cblx0XHRyZXR1cm4gYW5pbWF0YWJsZVxuXG5cblxuXG5cdFx0XHRcdFx0XG5cblx0XHRcdFx0XHRcblxuXG5cblxuIiwiIyBBZGQgdGhlIGZvbGxvd2luZyBsaW5lIHRvIHlvdXIgcHJvamVjdCBpbiBGcmFtZXIgU3R1ZGlvLiBcbiMgbXlNb2R1bGUgPSByZXF1aXJlIFwibXlNb2R1bGVcIlxuIyBSZWZlcmVuY2UgdGhlIGNvbnRlbnRzIGJ5IG5hbWUsIGxpa2UgbXlNb2R1bGUubXlGdW5jdGlvbigpIG9yIG15TW9kdWxlLm15VmFyXG5cblxuXG5jbGFzcyBleHBvcnRzLlRhYkNvbXBvbmVudCBleHRlbmRzIExheWVyXG5cdHRhYnM6IFtdXG5cdGluZGljYXRvckhlaWdodDogOFxuXHRpbmRpY2F0b3JDb2xvcjogXCIjRkZGXCJcblx0c2VsZWN0ZWRJbmRleDogLTFcblxuXHRjb25zdHJ1Y3RvcjogKG9wdGlvbnM9e30pIC0+XG5cdFx0aWYgIG9wdGlvbnMudXBncmFkZUxheWVyXG5cdFx0XHRsYXllciA9IG9wdGlvbnMudXBncmFkZUxheWVyXG5cdFx0XHRvcHRpb25zLnggPSBsYXllci54XG5cdFx0XHRvcHRpb25zLnkgPSBsYXllci55XG5cdFx0XHRvcHRpb25zLmhlaWdodCA9IGxheWVyLmhlaWdodFxuXHRcdFx0b3B0aW9ucy53aWR0aCA9IE1hdGgubWluKGxheWVyLndpZHRoLCBTY3JlZW4ud2lkdGgpXG5cdFx0XHRvcHRpb25zLm5hbWUgPSBsYXllci5uYW1lXG5cdFx0XHRvcHRpb25zLnRhYnMgPSBsYXllci5jaGlsZHJlblxuXHRcdFx0c3VwZXIob3B0aW9ucylcblx0XHRcdGxheWVyLnBhcmVudC5hZGRDaGlsZCh0aGlzKVxuXHRcdFx0dGhpcy5wbGFjZUJlaGluZChsYXllcilcblx0XHRcdGxheWVyLmRlc3Ryb3koKVxuXG5cdFx0ZWxzZVxuXHRcdFx0c3VwZXIob3B0aW9ucylcblxuXHRcdHRoaXMudGFicyA9IG9wdGlvbnMudGFic1xuXHRcdHRoaXMuc2Nyb2xsdmlldyA9IHRoaXMubWFrZVNjcm9sbCgpXG5cdFx0dGhpcy5wb3B1bGF0ZVRhYnMoKVxuXG5cdFx0XG5cblx0XHRpZihvcHRpb25zLmhhc093blByb3BlcnR5KFwiaW5kaWNhdG9ySGVpZ2h0XCIpKVxuXHRcdFx0dGhpcy5pbmRpY2F0b3JIZWlnaHQgPSBvcHRpb25zLmluZGljYXRvckhlaWdodFxuXG5cdFx0aWYob3B0aW9ucy5oYXNPd25Qcm9wZXJ0eShcImluZGljYXRvckNvbG9yXCIpKVxuXHRcdFx0dGhpcy5pbmRpY2F0b3JDb2xvciA9IG9wdGlvbnMuaW5kaWNhdG9yQ29sb3JcblxuXHRcdHRoaXMuaW5kaWNhdG9yID0gdGhpcy5tYWtlSW5kaWNhdG9yKClcblxuXHRcdHRoaXMuc2VsZWN0VGFiKDApXG5cblxuXHRtYWtlU2Nyb2xsOiAtPlxuXHRcdHNjcm9sbHZpZXcgPSBuZXcgU2Nyb2xsQ29tcG9uZW50XG5cdFx0XHRzaXplOiB0aGlzLnNpemVcblx0XHRcdHNjcm9sbFZlcnRpY2FsOiBmYWxzZVxuXHRcdFx0c2Nyb2xsSG9yaXpvbnRhbDogdHJ1ZVxuXHRcdFx0bmFtZTogXCJ0YWJTY3JvbGx2aWV3XCJcblx0XHRcdHBhcmVudDogdGhpc1xuXHRcdFxuXHRcdHJldHVybiBzY3JvbGx2aWV3XG5cblx0bWFrZUluZGljYXRvcjogLT5cblx0XHRpbmRpY2F0b3IgPSBuZXcgTGF5ZXJcblx0XHRcdHg6MFxuXHRcdFx0eTp0aGlzLmhlaWdodC10aGlzLmluZGljYXRvckhlaWdodFxuXHRcdFx0d2lkdGg6MFxuXHRcdFx0aGVpZ2h0OnRoaXMuaW5kaWNhdG9ySGVpZ2h0XG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6dGhpcy5pbmRpY2F0b3JDb2xvclxuXHRcdFx0cGFyZW50OiB0aGlzLnNjcm9sbHZpZXcuY29udGVudFxuXHRcdHJldHVybiBpbmRpY2F0b3JcblxuXHRwb3B1bGF0ZVRhYnM6IC0+XG5cdFx0eCA9IDBcblx0XHR0aGlzLnRhYnMuZm9yRWFjaCAodGFiLCBpKSA9PlxuXHRcdFx0aWYgdGFiLmNoaWxkcmVuV2l0aE5hbWUoXCJhY3RpdmVcIikubGVuZ3RoID4gMCAmJiB0YWIuY2hpbGRyZW5XaXRoTmFtZShcImluYWN0aXZlXCIpLmxlbmd0aCA+IDBcblx0XHRcdFx0dGFiLmNoaWxkcmVuV2l0aE5hbWUoXCJhY3RpdmVcIilbMF0udmlzaWJsZSA9IGZhbHNlXG5cdFx0XHRcdHRhYi5jaGlsZHJlbldpdGhOYW1lKFwiaW5hY3RpdmVcIilbMF0udmlzaWJsZSA9IHRydWVcblxuXHRcdFx0dGFiLnggPSB4XG5cdFx0XHR0YWIudGFiSW5kZXggPSBpXG5cdFx0XHR0YWIub25UYXAgPT5cblx0XHRcdFx0dGhpcy5zZWxlY3RUYWIodGFiLnRhYkluZGV4KVxuXG5cdFx0XHR0aGlzLnNjcm9sbHZpZXcuY29udGVudC5hZGRDaGlsZCh0YWIpXG5cdFx0XHR4ID0geCt0YWIud2lkdGhcblxuXHRcdGlmIHRoaXMuc2Nyb2xsdmlldy5jb250ZW50LndpZHRoIDw9IHRoaXMud2lkdGhcblx0XHRcdHRoaXMuc2Nyb2xsdmlldy5zY3JvbGxIb3Jpem9udGFsID0gZmFsc2U7XG5cblx0c2VsZWN0VGFiOih0YWJJbmRleCkgLT5cblx0XHRpZiB0aGlzLnNlbGVjdGVkSW5kZXggIT0gdGFiSW5kZXhcblx0XHRcdG91dFRhYiA9IHRoaXMudGFic1t0aGlzLnNlbGVjdGVkSW5kZXhdXG5cdFx0XHRpblRhYiA9IHRoaXMudGFic1t0YWJJbmRleF1cblxuXHRcdFx0dGhpcy5zY3JvbGx2aWV3LnNjcm9sbFRvTGF5ZXIoaW5UYWIsIDAuNSwgMC41LCB0aW1lOjAuMilcblx0XHRcdGluVGFiLnBsYWNlQmVoaW5kKHRoaXMuaW5kaWNhdG9yKVxuXHRcdFx0IyBwcmludCB0YWIueCwgdGhpcy5zY3JvbGx2aWV3LnNjcm9sbFhcblx0XHRcdHRoaXMuaW5kaWNhdG9yLmFuaW1hdGVcblx0XHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0XHR3aWR0aDogaW5UYWIud2lkdGhcblx0XHRcdFx0XHR4OiBpblRhYi54XG5cdFx0XHRcdHRpbWU6MC4yXG5cblx0XHRcdGlmIG91dFRhYlxuXHRcdFx0XHRpZiBvdXRUYWIuY2hpbGRyZW5XaXRoTmFtZShcImFjdGl2ZVwiKS5sZW5ndGggPiAwICYmIG91dFRhYi5jaGlsZHJlbldpdGhOYW1lKFwiaW5hY3RpdmVcIikubGVuZ3RoID4gMFxuXHRcdFx0XHRcdG91dFRhYi5jaGlsZHJlbldpdGhOYW1lKFwiYWN0aXZlXCIpWzBdLnZpc2libGUgPSBmYWxzZVxuXHRcdFx0XHRcdG91dFRhYi5jaGlsZHJlbldpdGhOYW1lKFwiaW5hY3RpdmVcIilbMF0udmlzaWJsZSA9IHRydWVcblxuXHRcdFx0aWYgaW5UYWIuY2hpbGRyZW5XaXRoTmFtZShcImFjdGl2ZVwiKS5sZW5ndGggPiAwICYmIGluVGFiLmNoaWxkcmVuV2l0aE5hbWUoXCJpbmFjdGl2ZVwiKS5sZW5ndGggPiAwXG5cdFx0XHRcdGluVGFiLmNoaWxkcmVuV2l0aE5hbWUoXCJhY3RpdmVcIilbMF0udmlzaWJsZSA9IHRydWVcblx0XHRcdFx0aW5UYWIuY2hpbGRyZW5XaXRoTmFtZShcImluYWN0aXZlXCIpWzBdLnZpc2libGUgPSBmYWxzZVxuXG5cblxuXHRcdFx0dGhpcy5zZWxlY3RlZEluZGV4ID0gdGFiSW5kZXhcblx0XHRcdHRoaXMuZW1pdChcInRhYnM6Y2hhbmdlOnRhYlwiLCB0aGlzLnNlbGVjdGVkSW5kZXgpXG5cblxuXHR1cGdyYWRlVG9UYWJDb21wb25lbnQ6KGxheWVyKSAtPlxuXHRcdHByaW50IFwiZGVycFwiXG5cblxuXG4iLCIjIEFkZCB0aGUgZm9sbG93aW5nIGxpbmUgdG8geW91ciBwcm9qZWN0IGluIEZyYW1lciBTdHVkaW8uIFxuIyBteU1vZHVsZSA9IHJlcXVpcmUgXCJteU1vZHVsZVwiXG4jIFJlZmVyZW5jZSB0aGUgY29udGVudHMgYnkgbmFtZSwgbGlrZSBteU1vZHVsZS5teUZ1bmN0aW9uKCkgb3IgbXlNb2R1bGUubXlWYXJcblxuZXhwb3J0cy5teVZhciA9IFwibXlWYXJpYWJsZVwiXG5cbmV4cG9ydHMubXlGdW5jdGlvbiA9IC0+XG5cdHByaW50IFwibXlGdW5jdGlvbiBpcyBydW5uaW5nXCJcblxuZXhwb3J0cy5teUFycmF5ID0gWzEsIDIsIDNdIl19
