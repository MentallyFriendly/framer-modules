# Import file "sleepsense"
# Import file "sleepsense" (sizes and positions are scaled 1:2)

this.TabComponent = (require "TabComponent").TabComponent
this.AnimatedPages = (require "AnimatedPages").AnimatedPages
this.CoordinatorLayout = (require "CoordinatorLayout").CoordinatorLayout

rippleButton = (require "rippleButton")

# Import file "bottomTabs" (sizes and positions are scaled 1:2)
$ = Framer.Importer.load("imported/sleepsense@1x")
Framer.Device.contentScale = 2;
	
for k, v of $
	v.name = v.name.replace(/[0-9]/g, '')
	if v.name.match(/-ripple/)
		rippleButton.addRipple(v)
		
	if v.name.match(/-round/)
		v.borderRadius = v.width/2
		
	if v.name.match(/tabset/)
		$[k] = new TabComponent
			upgradeLayer:v
			indicatorHeight:2
			backgroundColor: "transparent"
			
	if v.name.match(/^animatedPages/)
		$[k] = new AnimatedPages
			upgradeLayer:v
			backgroundColor:"transparent"
		
# 	if v.name.match(/^frame$/)
# 		v.parent.size = v.size
		
	


	 
#Convert our tabs into a TabComponent

	
# Convert our screens into an AnimatedPages Set
# $.animatedPages_mainScreens = new AnimatedPages
# 	upgradeLayer: $.animatedPages_mainScreens
# 	backgroundColor: "transparent"

$.coordinator = new CoordinatorLayout
	upgradeLayer: $.coordinator
	backgroundColor: "transparent"
	
$.tabset_bottomTabs.backgroundColor = "#FFF"

$.tabset_bottomTabs.on "tabs:change:tab", (tabIndex) ->
	$.animatedPages_mainScreens.selectPage(tabIndex)
	
$.tabset_dashboardTabs.on "tabs:change:tab", (tabIndex) ->
	$.animatedPages_graph.selectPage(tabIndex)
	$.animatedPages_list.selectPage(tabIndex)
	$.coordinator.scrollview.updateContent();



# upgradeCoordinator = (layer) ->
# 	for child in layer.children
# 		if child.name.match(/^header/)
# 			print "header" 
