# Add the following line to your project in Framer Studio. 
# myModule = require "myModule"
# Reference the contents by name, like myModule.myFunction() or myModule.myVar



exports.coordinatorLayout = null
exports.scrollview = null

exports.scrollDirection = 
	UP: "up"
	DOWN: "down"

exports.scrollBehaviour = 
	AWAY: 0
	RETURN: 1



lastY = 0

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
		deltaY = scrollY - lastY;

		for item in coordinatorLayout.scrollingChildren

			if item.scrollDirection == exports.scrollDirection.UP && item.scrollBehaviour == exports.scrollBehaviour.RETURN
				item.y = Math.min(Math.max(item.y-deltaY, item.stickyPoint), Math.max(-scrollY+item.startY, item.returnY))

			else if item.scrollDirection == exports.scrollDirection.UP && item.scrollBehaviour == exports.scrollBehaviour.AWAY
				item.y = Math.max(-scrollY+item.startY, item.stickyPoint)	

			else if item.scrollDirection == exports.scrollDirection.DOWN && item.scrollBehaviour == exports.scrollBehaviour.RETURN
				# print Math.max(scrollY-item.startY, item.returnY), scrollY+item.startY
				item.y = Math.max(Math.min(item.y+deltaY, item.stickyPoint), Math.min(scrollY+item.startY, item.returnY))	

			else if item.scrollDirection == exports.scrollDirection.DOWN && item.scrollBehaviour == exports.scrollBehaviour.AWAY
				item.y = Math.min(scrollY+item.startY, item.stickyPoint)	




		lastY = scrollY




	exports.coordinatorLayout = coordinatorLayout
	exports.scrollview = scrollview


exports.addScrollingChild = (item, direction =  exports.scrollDirection.UP, stickyPoint = item.height*-1, scrollBehaviour = exports.scrollBehaviour.AWAY, returnY = 0) ->
	item.scrollDirection = direction
	item.stickyPoint = stickyPoint
	item.scrollBehaviour = scrollBehaviour
	item.startY = item.y
	item.returnY = returnY
	exports.coordinatorLayout.scrollingChildren.push(item)
	exports.coordinatorLayout.addChild(item)

