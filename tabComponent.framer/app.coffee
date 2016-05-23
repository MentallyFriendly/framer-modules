this.TabComponent = (require "TabComponent").TabComponent
this.AnimatedPages = (require "AnimatedPages").AnimatedPages

# Import file "tabs" (sizes and positions are scaled 1:2)
background = new BackgroundLayer
	backgroundColor: "#FAFAFA"
	
sketch = Framer.Importer.load("imported/tabs@2x")


dpToPx = (v) ->
	return v*2


randomPages =[]
for i in [0..5]
	page = new Layer
		width: Screen.width
		height: Screen.height
		backgroundColor: Utils.randomColor();
	randomPages.push(page)
	
	
pages = new AnimatedPages
	width: Screen.width
	height: Screen.height-dpToPx(48)
	y: dpToPx(48)
	pages: randomPages
	

tabComponent = new TabComponent
	upgradeLayer:sketch.tabs1
	indicatorHeight: dpToPx(2)
	
tabComponent.on "tabs:change:tab", (tabIndex) ->
	print tabIndex
	pages.selectPage(tabIndex)
	


