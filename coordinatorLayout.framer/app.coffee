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

	
#Then call the addScrollingChild method. It takes 5 args (layer, scrollDirection, stickyPoint, scrollBehaviour, returnPoint)
# Layer - the target layer
# scrollDirection	- dictates whether the element moves up or down on scroll. Set it using the constants coordinatorLayout.scrollDirection.UP, and coordinatorLayout.scrollDirection.DOWN
# stickyPoint - The point at which the element should stop scrolling & become fixed. By default, it's the inverse of the element's height
# scrollBehaviour - dictates whether the element returns on a reverse scroll, or stays in it's natural position. Set it using the constants coordinatorLayout.scrollBehaviour.AWAY, or coordinatorLayout.scrollBehaviour.RETURN
#returnPoint - the point that the element will return to, if scrollBehaviour is set to RETURN. Ignored if set to AWAY

coordinatorLayout.addScrollingChild(toolbarA, coordinatorLayout.scrollDirection.UP, -dpToPx(56*3), coordinatorLayout.scrollBehaviour.AWAY, 0)

toolbarACollapsed = new Layer
	y: dpToPx(56*2)
	width: background.width
	height: dpToPx(56)
	backgroundColor: "#3949AB"
	
coordinatorLayout.addScrollingChild(toolbarACollapsed, coordinatorLayout.scrollDirection.UP, -dpToPx(56*1), coordinatorLayout.scrollBehaviour.RETURN, 0)


toolbarB = new Layer
	y: dpToPx(56*3)
	width: background.width
	height: dpToPx(56*1)
	backgroundColor: "#303F9F"
	
coordinatorLayout.addScrollingChild(toolbarB, coordinatorLayout.scrollDirection.UP, -dpToPx(0), coordinatorLayout.scrollBehaviour.RETURN, dpToPx(56))


footerA = new Layer
	y: Screen.height - dpToPx(56)
	width: background.width
	height: dpToPx(56*1)
	backgroundColor: "#303F9F"

#When adding elements where scrollDirection is set to DOWN, you must define stickyPoint, or it'll fuck up for now
coordinatorLayout.addScrollingChild(footerA, coordinatorLayout.scrollDirection.DOWN, Screen.height, coordinatorLayout.scrollBehaviour.RETURN, Screen.height - dpToPx(56))

footerB = new Layer
	x: Screen.width - dpToPx(56) - dpToPx(16)
	y: Screen.height - dpToPx(56*2) - dpToPx(16)
	width: dpToPx(56)
	height: dpToPx(56)
	borderRadius: dpToPx(56/2)
	backgroundColor: "#F50057"
	
rippleButton.addRipple(footerB)

#When adding elements where scrollDirection is set to DOWN, and scrollBehaviour is set to return, you must define both stickyPoint & returnPoint, or it'll be a disaster
coordinatorLayout.addScrollingChild(footerB, coordinatorLayout.scrollDirection.DOWN, Screen.height - dpToPx(56) - dpToPx(16), coordinatorLayout.scrollBehaviour.RETURN, Screen.height - dpToPx(56*2) - dpToPx(16))



coordinatorLayout.scrollview.contentInset = 
	top: dpToPx(56*4)
	right: 0
	bottom: dpToPx(56*1)+dpToPx(8)
	left: 0

	



	
	

		
		


