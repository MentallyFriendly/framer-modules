Events.derp = "derp"

this.CoordinatorLayout = (require "coordinatorLayout").CoordinatorLayout

#Utils
dpToPx = (v) ->
	return v*2
	
background = new BackgroundLayer
	backgroundColor: "#FAFAFA"

coordinatorLayout = new CoordinatorLayout
	width: Screen.width
	height: Screen.height
	backgroundColor: "transparent"
	
#Fill it w crap so we can scroll
for i in [0..10]
	layerA = new Layer
		width: coordinatorLayout.width-dpToPx(16), height: coordinatorLayout.height/3.5
		x: dpToPx(8), y: dpToPx(8) + ((coordinatorLayout.height/3.5)+dpToPx(8)) * i 
		backgroundColor: "#fff"
		parent: coordinatorLayout.content
		borderRadius: dpToPx(2)
		shadowBlur: dpToPx(3)
		shadowY: dpToPx(1)

toolbarA = new Layer
	width: coordinatorLayout.width
	height: dpToPx(56*3)
	backgroundColor: "#3949AB"
# 
# 	
# #Then call the addScrollingChild method. It takes 2 args, the layer, and the options.
# #The options object has the following properties
# # scrollDirection	- dictates whether the element moves up or down on scroll. Possible values are "up" or "down". Default is "up"
# # stickyY - The point at which the element should stop scrolling & become fixed. Default to just offscreen either up or down
# # scrollBehaviour - dictates whether the element returns on a reverse scroll, or stays in it's natural position. Set it using the constants coordinatorLayout.scrollBehaviour.AWAY, or coordinatorLayout.scrollBehaviour.RETURN. Default AWAY
# #returnY - the point that the element will return to, if scrollBehaviour is set to RETURN. Ignored if set to AWAY. Default 0
# #onYChanged - Called when an element moves, passes in the element and the current scroll, The element will have the custom properties startY, stickyY, returnY
# 

toolbarA.on "coordinatedChild:change:y", (layer) ->
	print layer.returnY
	
coordinatorLayout.addDependantChild(toolbarA)

toolbarACollapsed = new Layer
	y: dpToPx(56*2)
	width: coordinatorLayout.width
	height: dpToPx(56)
	backgroundColor: "#3949AB"

coordinatorLayout.addDependantChild(toolbarACollapsed, {
	scrollBehaviour:"return",
	returnY: 0
})


toolbarB = new Layer
	y: dpToPx(56*3)
	width: coordinatorLayout.width
	height: dpToPx(56*1)
	backgroundColor: "#303F9F"
	
coordinatorLayout.addDependantChild(toolbarB, {
	stickyY: 0
	scrollBehaviour:"return", 
	returnY: dpToPx(56)
})


footerA = new Layer
	y: Screen.height - dpToPx(56)
	width: coordinatorLayout.width
	height: dpToPx(56*1)
	backgroundColor: "#303F9F"
	
coordinatorLayout.addDependantChild(footerA, {
	scrollDirection:"down",
	scrollBehaviour:"return",
	returnY: Screen.height - dpToPx(56)
})


footerB = new Layer
	x: Screen.width - dpToPx(56) - dpToPx(16)
	y: Screen.height - dpToPx(56*2) - dpToPx(16)
	width: dpToPx(56)
	height: dpToPx(56)
	borderRadius: dpToPx(56/2)
	backgroundColor: "#F50057"
	
coordinatorLayout.addDependantChild(footerB, {
	scrollDirection:"down"
	stickyY: Screen.height - dpToPx(56) - dpToPx(16)
	scrollBehaviour:"return"
	returnY: Screen.height - dpToPx(56*2) - dpToPx(16)
})


coordinatorLayout.scrollview.contentInset =
	top: dpToPx(56*4)
	right: 0
	bottom: dpToPx(56*2)
	left: 0
