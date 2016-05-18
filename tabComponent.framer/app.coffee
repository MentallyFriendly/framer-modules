this.TabComponent = (require "TabComponent").TabComponent

dpToPx = (v) ->
	return v*2



		
		


randomTabs = []
for i in [0..5]
	tab = new Layer
		width: Utils.randomNumber(dpToPx(100), Screen.width*0.75)
		height: dpToPx(56)
		backgroundColor: Utils.randomColor()
	randomTabs.push(tab)

tabComponent = new TabComponent
	width: Screen.width
	height: dpToPx(56)
	tabs: randomTabs
	indicatorHeight: dpToPx(2)
	indicatorColor: "#FFF"
	
