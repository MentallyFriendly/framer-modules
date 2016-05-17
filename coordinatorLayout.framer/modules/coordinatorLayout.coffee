# Add the following line to your project in Framer Studio. 
# myModule = require "myModule"
# Reference the contents by name, like myModule.myFunction() or myModule.myVar



exports.coordinatorLayout = null
exports.scrollview = null

exports.scrollDirection = 
	UP: 0
	DOWN: 1


exports.make = () ->
	coordinatorLayout = new Layer
		width: Screen.width
		height: Screen.height
		backgroundColor: "transparent"
		name: "coordinatorLayout"

	coordinatorLayout.scrollingChildren = []

	scrollview = new ScrollComponent
		width: Screen.width
		height: Screen.height
		scrollHorizontal: false
		name: "scrollview"
		parent: coordinatorLayout

	coordinatorLayout.scrollview = scrollview;

	scrollview.content.on "change:y", ->
		scrollY = Math.max(Math.min(scrollview.scrollY, scrollview.content.height-scrollview.height), 0)
		for item in coordinatorLayout.scrollingChildren

			if item.scrollDirection == exports.scrollDirection.UP
				item.y = Math.max(-scrollY+item.startY, item.stickyPoint)

	exports.coordinatorLayout = coordinatorLayout
	exports.scrollview = scrollview


exports.addScrollingChild = (item, direction =  exports.scrollDirection.UP, stickyPoint = item.height*-1) ->
	item.scrollDirection = direction
	item.stickyPoint = stickyPoint
	item.startY = item.y
	exports.coordinatorLayout.scrollingChildren.push(item)
	exports.coordinatorLayout.addChild(item)