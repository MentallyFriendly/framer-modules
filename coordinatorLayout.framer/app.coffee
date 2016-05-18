coordinatorLayout = require "coordinatorLayout"

#Scroll Actions
scrollDirection = 
	UP: 0
	DOWN: 1

#Utils
dpToPx = (v) ->
	return v*4



background = new BackgroundLayer
	backgroundColor: "#FAFAFA"
	
coordinatorLayout.make();

# Fill our scrollview w useless crap
for i in [0..10]
	layerA = new Layer
		width: coordinatorLayout.scrollview.width-dpToPx(16), height: background.height/3.5
		x: dpToPx(8), y: dpToPx(8) + ((background.height/3.5)+dpToPx(8)) * i 
		backgroundColor: "#fff"
		parent: coordinatorLayout.scrollview.content
		borderRadius: dpToPx(2)
		shadowBlur: dpToPx(3)
		shadowY: dpToPx(1)


toolbarA = new Layer
	width: background.width
	height: dpToPx(56*3)
	backgroundColor: "#3949AB"
	
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
	
coordinatorLayout.addScrollingChild(footerA, coordinatorLayout.scrollDirection.DOWN, Screen.height, coordinatorLayout.scrollBehaviour.AWAY, Screen.height - dpToPx(56))

footerB = new Layer
	y: Screen.height - dpToPx(56*2)
	width: background.width
	height: dpToPx(56*1)
	backgroundColor: "#283593"
	
coordinatorLayout.addScrollingChild(footerB, coordinatorLayout.scrollDirection.DOWN, Screen.height - dpToPx(56), coordinatorLayout.scrollBehaviour.RETURN, Screen.height - dpToPx(56))





	
# toolbar = new Layer
# 	width: background.width
# 	height: dpToPx(56*3)
# 	backgroundColor: "#3949AB"
# 	
# # addScrollingChild(toolbar, scrollDirection.UP)
# 
# # coordinatorLayout.addChild(toolbar)
# 	
# 	
# extraStrip = new Layer
# 	y: dpToPx(56*4)
# 	width: background.width
# 	height: dpToPx(56*2)
# 	backgroundColor: "#283593"
# 	
# # addScrollingChild(extraStrip, scrollDirection.UP)
# 
# tabStrip = new Layer
# 	y: dpToPx(56*3)
# 	width: background.width
# 	height: dpToPx(56)
# 	backgroundColor: "#3D5AFE"
# 	
# # addScrollingChild(tabStrip, scrollDirection.UP, 0)
# 
# anotherStrip = new Layer
# 	y: dpToPx(56*6)
# 	width: background.width
# 	height: dpToPx(56)
# 	backgroundColor: "#9FA8DA"
# 	
# # addScrollingChild(anotherStrip, scrollDirection.UP, dpToPx(56))



	

# coordinatorLayout.addChild(tabStrip)

	



	
	

		
		


