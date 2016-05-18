require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"TabComponent":[function(require,module,exports){
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


},{}]},{},[])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMveWFzaW4vU2l0ZXMvRnJhbWVyIE1vZHVsZXMvdGFiQ29tcG9uZW50LmZyYW1lci9tb2R1bGVzL1RhYkNvbXBvbmVudC5jb2ZmZWUiLCIvVXNlcnMveWFzaW4vU2l0ZXMvRnJhbWVyIE1vZHVsZXMvdGFiQ29tcG9uZW50LmZyYW1lci9tb2R1bGVzL215TW9kdWxlLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ01BLElBQUE7OztBQUFNLE9BQU8sQ0FBQzs7O3lCQUNiLElBQUEsR0FBTTs7eUJBQ04sZUFBQSxHQUFpQjs7eUJBQ2pCLGNBQUEsR0FBZ0I7O3lCQUNoQixhQUFBLEdBQWU7O0VBRUYsc0JBQUMsT0FBRDs7TUFBQyxVQUFROztJQUNyQiw4Q0FBTSxPQUFOO0lBQ0EsSUFBSSxDQUFDLElBQUwsR0FBWSxPQUFPLENBQUM7SUFDcEIsSUFBSSxDQUFDLFVBQUwsR0FBa0IsSUFBSSxDQUFDLFVBQUwsQ0FBQTtJQUNsQixJQUFJLENBQUMsWUFBTCxDQUFBO0lBR0EsSUFBRyxPQUFPLENBQUMsY0FBUixDQUF1QixpQkFBdkIsQ0FBSDtNQUNDLElBQUksQ0FBQyxlQUFMLEdBQXVCLE9BQU8sQ0FBQyxnQkFEaEM7O0lBR0EsSUFBRyxPQUFPLENBQUMsY0FBUixDQUF1QixnQkFBdkIsQ0FBSDtNQUNDLElBQUksQ0FBQyxjQUFMLEdBQXNCLE9BQU8sQ0FBQyxlQUQvQjs7SUFHQSxJQUFJLENBQUMsU0FBTCxHQUFpQixJQUFJLENBQUMsYUFBTCxDQUFBO0VBYkw7O3lCQWViLFVBQUEsR0FBWSxTQUFBO0FBQ1gsUUFBQTtJQUFBLFVBQUEsR0FBaUIsSUFBQSxlQUFBLENBQ2hCO01BQUEsS0FBQSxFQUFPLElBQUksQ0FBQyxLQUFaO01BQ0EsY0FBQSxFQUFnQixLQURoQjtNQUVBLGdCQUFBLEVBQWtCLElBRmxCO01BR0EsSUFBQSxFQUFNLGVBSE47TUFJQSxNQUFBLEVBQVEsSUFKUjtLQURnQjtBQU9qQixXQUFPO0VBUkk7O3lCQVVaLGFBQUEsR0FBZSxTQUFBO0FBQ2QsUUFBQTtJQUFBLFNBQUEsR0FBZ0IsSUFBQSxLQUFBLENBQ2Y7TUFBQSxDQUFBLEVBQUUsQ0FBRjtNQUNBLENBQUEsRUFBRSxJQUFJLENBQUMsTUFBTCxHQUFZLElBQUksQ0FBQyxlQURuQjtNQUVBLEtBQUEsRUFBTSxJQUFJLENBQUMsSUFBSyxDQUFBLElBQUksQ0FBQyxhQUFMLENBQW1CLENBQUMsS0FGcEM7TUFHQSxNQUFBLEVBQU8sSUFBSSxDQUFDLGVBSFo7TUFJQSxlQUFBLEVBQWdCLElBQUksQ0FBQyxjQUpyQjtNQUtBLE1BQUEsRUFBUSxJQUFJLENBQUMsVUFBVSxDQUFDLE9BTHhCO0tBRGU7QUFPaEIsV0FBTztFQVJPOzt5QkFVZixZQUFBLEdBQWMsU0FBQTtBQUNiLFFBQUE7SUFBQSxDQUFBLEdBQUk7V0FDSixJQUFJLENBQUMsSUFBSSxDQUFDLE9BQVYsQ0FBa0IsQ0FBQSxTQUFBLEtBQUE7YUFBQSxTQUFDLEdBQUQsRUFBTSxDQUFOO1FBQ2pCLEdBQUcsQ0FBQyxDQUFKLEdBQVE7UUFDUixHQUFHLENBQUMsUUFBSixHQUFlO1FBQ2YsR0FBRyxDQUFDLEtBQUosQ0FBVSxTQUFBO2lCQUNULEtBQUksQ0FBQyxTQUFMLENBQWUsR0FBRyxDQUFDLFFBQW5CO1FBRFMsQ0FBVjtRQUdBLEtBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLFFBQXhCLENBQWlDLEdBQWpDO2VBQ0EsQ0FBQSxHQUFJLENBQUEsR0FBRSxHQUFHLENBQUM7TUFQTztJQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEI7RUFGYTs7eUJBV2QsU0FBQSxHQUFVLFNBQUMsUUFBRDtBQUNULFFBQUE7SUFBQSxJQUFJLENBQUMsYUFBTCxHQUFxQjtJQUNyQixHQUFBLEdBQU0sSUFBSSxDQUFDLElBQUssQ0FBQSxJQUFJLENBQUMsYUFBTDtJQUNoQixJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWhCLENBQThCLEdBQTlCLEVBQW1DLEdBQW5DLEVBQXdDLEdBQXhDLEVBQTZDO01BQUEsSUFBQSxFQUFLLEdBQUw7S0FBN0M7SUFFQSxLQUFBLENBQU0sR0FBRyxDQUFDLENBQVYsRUFBYSxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQTdCO0lBQ0EsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFmLENBQ0M7TUFBQSxVQUFBLEVBQ0M7UUFBQSxLQUFBLEVBQU8sR0FBRyxDQUFDLEtBQVg7UUFDQSxDQUFBLEVBQUcsR0FBRyxDQUFDLENBRFA7T0FERDtNQUdBLElBQUEsRUFBSyxHQUhMO0tBREQ7V0FPQSxJQUFJLENBQUMsSUFBTCxDQUFVLGlCQUFWLEVBQTZCLElBQUksQ0FBQyxhQUFsQztFQWJTOzs7O0dBcER3Qjs7OztBQ0ZuQyxPQUFPLENBQUMsS0FBUixHQUFnQjs7QUFFaEIsT0FBTyxDQUFDLFVBQVIsR0FBcUIsU0FBQTtTQUNwQixLQUFBLENBQU0sdUJBQU47QUFEb0I7O0FBR3JCLE9BQU8sQ0FBQyxPQUFSLEdBQWtCLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIiMgQWRkIHRoZSBmb2xsb3dpbmcgbGluZSB0byB5b3VyIHByb2plY3QgaW4gRnJhbWVyIFN0dWRpby4gXG4jIG15TW9kdWxlID0gcmVxdWlyZSBcIm15TW9kdWxlXCJcbiMgUmVmZXJlbmNlIHRoZSBjb250ZW50cyBieSBuYW1lLCBsaWtlIG15TW9kdWxlLm15RnVuY3Rpb24oKSBvciBteU1vZHVsZS5teVZhclxuXG5cblxuY2xhc3MgZXhwb3J0cy5UYWJDb21wb25lbnQgZXh0ZW5kcyBMYXllclxuXHR0YWJzOiBbXVxuXHRpbmRpY2F0b3JIZWlnaHQ6IDhcblx0aW5kaWNhdG9yQ29sb3I6IFwiI0ZGRlwiXG5cdHNlbGVjdGVkSW5kZXg6IDBcblxuXHRjb25zdHJ1Y3RvcjogKG9wdGlvbnM9e30pIC0+XG5cdFx0c3VwZXIob3B0aW9ucylcblx0XHR0aGlzLnRhYnMgPSBvcHRpb25zLnRhYnNcblx0XHR0aGlzLnNjcm9sbHZpZXcgPSB0aGlzLm1ha2VTY3JvbGwoKVxuXHRcdHRoaXMucG9wdWxhdGVUYWJzKClcblx0XHRcblxuXHRcdGlmKG9wdGlvbnMuaGFzT3duUHJvcGVydHkoXCJpbmRpY2F0b3JIZWlnaHRcIikpXG5cdFx0XHR0aGlzLmluZGljYXRvckhlaWdodCA9IG9wdGlvbnMuaW5kaWNhdG9ySGVpZ2h0XG5cblx0XHRpZihvcHRpb25zLmhhc093blByb3BlcnR5KFwiaW5kaWNhdG9yQ29sb3JcIikpXG5cdFx0XHR0aGlzLmluZGljYXRvckNvbG9yID0gb3B0aW9ucy5pbmRpY2F0b3JDb2xvclxuXG5cdFx0dGhpcy5pbmRpY2F0b3IgPSB0aGlzLm1ha2VJbmRpY2F0b3IoKVxuXG5cdG1ha2VTY3JvbGw6IC0+XG5cdFx0c2Nyb2xsdmlldyA9IG5ldyBTY3JvbGxDb21wb25lbnRcblx0XHRcdGZyYW1lOiB0aGlzLmZyYW1lXG5cdFx0XHRzY3JvbGxWZXJ0aWNhbDogZmFsc2Vcblx0XHRcdHNjcm9sbEhvcml6b250YWw6IHRydWVcblx0XHRcdG5hbWU6IFwidGFiU2Nyb2xsdmlld1wiXG5cdFx0XHRwYXJlbnQ6IHRoaXNcblx0XHRcblx0XHRyZXR1cm4gc2Nyb2xsdmlld1xuXG5cdG1ha2VJbmRpY2F0b3I6IC0+XG5cdFx0aW5kaWNhdG9yID0gbmV3IExheWVyXG5cdFx0XHR4OjBcblx0XHRcdHk6dGhpcy5oZWlnaHQtdGhpcy5pbmRpY2F0b3JIZWlnaHRcblx0XHRcdHdpZHRoOnRoaXMudGFic1t0aGlzLnNlbGVjdGVkSW5kZXhdLndpZHRoXG5cdFx0XHRoZWlnaHQ6dGhpcy5pbmRpY2F0b3JIZWlnaHRcblx0XHRcdGJhY2tncm91bmRDb2xvcjp0aGlzLmluZGljYXRvckNvbG9yXG5cdFx0XHRwYXJlbnQ6IHRoaXMuc2Nyb2xsdmlldy5jb250ZW50XG5cdFx0cmV0dXJuIGluZGljYXRvclxuXG5cdHBvcHVsYXRlVGFiczogLT5cblx0XHR4ID0gMFxuXHRcdHRoaXMudGFicy5mb3JFYWNoICh0YWIsIGkpID0+XG5cdFx0XHR0YWIueCA9IHhcblx0XHRcdHRhYi50YWJJbmRleCA9IGlcblx0XHRcdHRhYi5vblRhcCA9PlxuXHRcdFx0XHR0aGlzLnNlbGVjdFRhYih0YWIudGFiSW5kZXgpXG5cblx0XHRcdHRoaXMuc2Nyb2xsdmlldy5jb250ZW50LmFkZENoaWxkKHRhYilcblx0XHRcdHggPSB4K3RhYi53aWR0aFxuXG5cdHNlbGVjdFRhYjoodGFiSW5kZXgpIC0+XG5cdFx0dGhpcy5zZWxlY3RlZEluZGV4ID0gdGFiSW5kZXhcblx0XHR0YWIgPSB0aGlzLnRhYnNbdGhpcy5zZWxlY3RlZEluZGV4XVxuXHRcdHRoaXMuc2Nyb2xsdmlldy5zY3JvbGxUb0xheWVyKHRhYiwgMC41LCAwLjUsIHRpbWU6MC4yKVxuXG5cdFx0cHJpbnQgdGFiLngsIHRoaXMuc2Nyb2xsdmlldy5zY3JvbGxYXG5cdFx0dGhpcy5pbmRpY2F0b3IuYW5pbWF0ZVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0d2lkdGg6IHRhYi53aWR0aFxuXHRcdFx0XHR4OiB0YWIueFxuXHRcdFx0dGltZTowLjJcblxuXG5cdFx0dGhpcy5lbWl0KFwidGFiczpjaGFuZ2U6dGFiXCIsIHRoaXMuc2VsZWN0ZWRJbmRleClcblxuXG5cbiIsIiMgQWRkIHRoZSBmb2xsb3dpbmcgbGluZSB0byB5b3VyIHByb2plY3QgaW4gRnJhbWVyIFN0dWRpby4gXG4jIG15TW9kdWxlID0gcmVxdWlyZSBcIm15TW9kdWxlXCJcbiMgUmVmZXJlbmNlIHRoZSBjb250ZW50cyBieSBuYW1lLCBsaWtlIG15TW9kdWxlLm15RnVuY3Rpb24oKSBvciBteU1vZHVsZS5teVZhclxuXG5leHBvcnRzLm15VmFyID0gXCJteVZhcmlhYmxlXCJcblxuZXhwb3J0cy5teUZ1bmN0aW9uID0gLT5cblx0cHJpbnQgXCJteUZ1bmN0aW9uIGlzIHJ1bm5pbmdcIlxuXG5leHBvcnRzLm15QXJyYXkgPSBbMSwgMiwgM10iXX0=
