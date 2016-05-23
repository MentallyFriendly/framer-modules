# Import file "Animated Pages" (sizes and positions are scaled 1:4)
# $ = Framer.Importer.load("imported/Animated Pages@4x")
# Import file "Animated Pages" (sizes and positions are scaled 1:3)
$ = Framer.Importer.load("imported/Animated Pages@3x")
this.TabComponent = (require "TabComponent").TabComponent
this.AnimatedPages = (require "AnimatedPages").AnimatedPages

# Import file "Animated Pages" (sizes and positions are scaled 1:2)
# $ = Framer.Importer.load("imported/Animated Pages@2x")

index = 0


for k, v of $
	v.name = v.name.replace(/[0-9]/g, '')
	if v.name.match(/-ripple/)
		rippleButton.addRipple(v)
		
	if v.name.match(/-round/)
		v.borderRadius = v.width/2
		
	if v.name.match(/^tabComponent/)
		$[k] = new TabComponent
			upgradeLayer:v
			indicatorHeight:2
			
	if v.name.match(/^animatedPages/)
		$[k] = new AnimatedPages
			upgradeLayer:v
			backgroundColor:"transparent"
			

$.tabComponent.shadowBlur = 30

$.tabComponent.on "tabs:change:tab", (tabIndex) ->
	$.animatedPages_content.selectPage(tabIndex)
	$.animatedPages_navbar.selectPage(tabIndex)
	

