# Import file "tabs" (sizes and positions are scaled 1:2)
sketch = Framer.Importer.load("imported/tabs@2x")
this.TabComponent = (require "TabComponent").TabComponent

dpToPx = (v) ->
	return v*2




tabComponent = new TabComponent
	width: Screen.width
	height: dpToPx(48)
	tabs: sketch.tabs.children
	indicatorHeight: dpToPx(2)
	indicatorColor: "#FFF"
	
tabComponent.on "tabs:change:tab", (tabIndex) ->
	print tabIndex
	
