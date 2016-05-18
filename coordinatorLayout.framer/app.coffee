coordinatorLayout = require "coordinatorLayout"
rippleButton = require "rippleButton"

#Utils
dpToPx = (v) ->
	return v*2

background = new BackgroundLayer
	backgroundColor: "#FAFAFA"
	
#Creates a coordinatorLayout. This contains an overall frame, and an empty scrollview with all the necessary events hooked up. You can populate it like normal
coordinatorLayout.make();

#The scrollview is accessed at coordinatorLayout.scrollview
#Fill it w crap so we can scroll
for i in [0..10]
	layerA = new Layer
		width: coordinatorLayout.scrollview.width-dpToPx(16), height: background.height/3.5
		x: dpToPx(8), y: dpToPx(8) + ((background.height/3.5)+dpToPx(8)) * i 
		backgroundColor: "#fff"
		parent: coordinatorLayout.scrollview.content
		borderRadius: dpToPx(2)
		shadowBlur: dpToPx(3)
		shadowY: dpToPx(1)
		
# 	rippleButton.addRipple(layerA)

#To add a scroll dependant child, create it like normal
toolbarA = new Layer
	width: background.width
	height: dpToPx(56*3)
	backgroundColor: "#3949AB"

	
#Then call the addScrollingChild method. It takes 2 args, the layer, and the options.
#The options object has the following properties
# scrollDirection	- dictates whether the element moves up or down on scroll. Set it using the constants coordinatorLayout.scrollDirection.UP, and coordinatorLayout.scrollDirection.DOWN. Default UP
# stickyY - The point at which the element should stop scrolling & become fixed. Default to just offscreen either up or down
# scrollBehaviour - dictates whether the element returns on a reverse scroll, or stays in it's natural position. Set it using the constants coordinatorLayout.scrollBehaviour.AWAY, or coordinatorLayout.scrollBehaviour.RETURN. Default AWAY
#returnY - the point that the element will return to, if scrollBehaviour is set to RETURN. Ignored if set to AWAY. Default 0
#onYChanged - Called when an element moves, passes in the element and the current scroll, The element will have the custom properties startY, stickyY, returnY

coordinatorLayout.addScrollingChild(toolbarA,
	{
		onYChanged:(item) ->
	}
)

toolbarACollapsed = new Layer
	y: dpToPx(56*2)
	width: background.width
	height: dpToPx(56)
	backgroundColor: "#3949AB"

coordinatorLayout.addScrollingChild(toolbarACollapsed, {
	scrollBehaviour:coordinatorLayout.scrollBehaviour.RETURN,
	returnY: 0
})


toolbarB = new Layer
	y: dpToPx(56*3)
	width: background.width
	height: dpToPx(56*1)
	backgroundColor: "#303F9F"
	
coordinatorLayout.addScrollingChild(toolbarB, {
	stickyY: 0
	scrollBehaviour:coordinatorLayout.scrollBehaviour.RETURN, 
	returnY: dpToPx(56)
})


footerA = new Layer
	y: Screen.height - dpToPx(56)
	width: background.width
	height: dpToPx(56*1)
	backgroundColor: "#303F9F"
	
coordinatorLayout.addScrollingChild(footerA, {
	scrollDirection:coordinatorLayout.scrollDirection.DOWN,
	scrollBehaviour:coordinatorLayout.scrollBehaviour.RETURN,
	returnY: Screen.height - dpToPx(56)
})


footerB = new Layer
	x: Screen.width - dpToPx(56) - dpToPx(16)
	y: Screen.height - dpToPx(56*2) - dpToPx(16)
	width: dpToPx(56)
	height: dpToPx(56)
	borderRadius: dpToPx(56/2)
	backgroundColor: "#F50057"
	
coordinatorLayout.addScrollingChild(footerB, {
	scrollDirection:coordinatorLayout.scrollDirection.DOWN
	stickyY: Screen.height - dpToPx(56) - dpToPx(16)
	scrollBehaviour:coordinatorLayout.scrollBehaviour.RETURN
	returnY: Screen.height - dpToPx(56*2) - dpToPx(16)
})


coordinatorLayout.scrollview.contentInset =
	top: dpToPx(56*4)
	right: 0
	bottom: dpToPx(56*2)
	left: 0
	

		
		


