#Scroll Actions
scrollDirection = 
	UP: 0
	DOWN: 1

#Utils
dpToPx = (v) ->
	return v*2

coordinatorLayout = require "coordinatorLayout"

background = new BackgroundLayer
	backgroundColor: "#FAFAFA"


coordinatorLayout.make();


#Co-Ordinator Layout Utils
# chilrenChanged = (e) ->
# 	e.added.forEach (item, i) ->
# 		if item.hasOwnProperty("scrollAction")
# 			coordinatorLayout.scrollActionItems.push(item)
# 	e.removed.forEach (item, i) ->
# 		if coordinatorLayout.scrollActionItems.indexOf(item) > -1
# 			coordinatorLayout.scrollActionItems.splice(coordinatorLayout.scrollActionItems.indexOf(item), 1)

# addScrollingChild = (item, direction =  scrollDirection.UP, stickyPoint = item.height*-1) ->
# 	item.scrollDirection = direction
# 	item.stickyPoint = stickyPoint
# 	item.startY = item.y
# 	coordinatorLayout.scrollingChildren.push(item)
# 	coordinatorLayout.addChild(item)
# 
# 

# 
# #The coordinator layout is a base layout - it contains a scrollview, and probably some other views that react to scrolling... maybe.
# coordinatorLayout = new Layer
# 	width: background.width
# 	height: background.height
# 	backgroundColor: "transparent"
# 
# coordinatorLayout.scrollingChildren = []
# 	
# # coordinatorLayout.on "change:children", (e, d) ->
# # 	chilrenChanged(e)
# 	
# 
# # Create scrollview
# scrollview = new ScrollComponent
# 	width: background.width
# 	height: background.height
# 	scrollHorizontal: false
# 	name: "scrollview"
# 	parent: coordinatorLayout
# 
# # Fill our scrollview w useless crap
# for i in [0..10]
# 	layerA = new Layer
# 		width: scrollview.width-dpToPx(16), height: background.height/3.5
# 		x: dpToPx(8), y: dpToPx(8) + ((background.height/3.5)+dpToPx(8)) * i 
# 		backgroundColor: "#fff"
# 		parent: scrollview.content
# 		borderRadius: dpToPx(2)
# 		shadowBlur: dpToPx(3)
# 		shadowY: dpToPx(1)
# 		
# 		
# 
# scrollview.content.on "change:y", ->
# 	scrollY = Math.max(Math.min(scrollview.scrollY, scrollview.content.height-scrollview.height), 0)
# # 	print scrollY
# 	
# 	for item in coordinatorLayout.scrollingChildren
# 		if item.scrollDirection == scrollDirection.UP
# # 			print item.stickyPoint, "foo"
# 			item.y = Math.max(-scrollY+item.startY, item.stickyPoint)
# 			





	
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

	



	
	

		
		


