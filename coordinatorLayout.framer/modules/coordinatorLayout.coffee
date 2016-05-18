

class exports.CoordinatorLayout extends Layer
	dependantChildren:[]
	directions:
		UP:"up"
		DOWN:"down"

	behaviours:
		AWAY:"away"
		RETURN:"return"

	defaultOpts:
		scrollDirection: "up"
		stickyY: "auto"
		scrollBehaviour: "away"
		returnY: 0

	lastY: 0

	constructor: (options={}) ->
		_this = this
		super(options)
		_this.scrollview = _this.makeScroll();
		_this.content = _this.scrollview.content
		_this.content.on "change:y", ->
			_this.onScroll(_this)
		


	makeScroll: ->
		scrollview = new ScrollComponent
			frame: this.frame
			scrollHorizontal: false
			name: "coordinatorScrollview"
			parent: this

		# this = this
		
		return scrollview



	onScroll:(_this) ->
		scrollY = Math.max(Math.min(_this.scrollview.scrollY, _this.scrollview.content.height-_this.scrollview.height), 0)
		deltaY = scrollY - _this.lastY;

		for layer in _this.dependantChildren

			if layer.scrollDirection == _this.directions.UP && layer.scrollBehaviour == _this.behaviours.RETURN
				layer.y = Math.min(Math.max(layer.y-deltaY, layer.stickyY), Math.max(-scrollY+layer.startY, layer.returnY))

			else if layer.scrollDirection == _this.directions.UP && layer.scrollBehaviour == _this.behaviours.AWAY
				layer.y = Math.max(-scrollY+layer.startY, layer.stickyY)	

			else if layer.scrollDirection == _this.directions.DOWN  && layer.scrollBehaviour == _this.behaviours.RETURN
				layer.y = Math.max(Math.min(layer.y+deltaY, layer.stickyY), Math.min(scrollY+layer.startY, layer.returnY))	

			else if layer.scrollDirection == _this.directions.DOWN && layer.scrollBehaviour == _this.behaviours.AWAY
				layer.y = Math.min(scrollY+layer.startY, layer.stickyY)	

			
			layer.emit("change:y", layer)


		_this.lastY = scrollY



	calculateDefaultStickyY:(layer, direction) ->
		if direction == this.directions.UP
			return layer.height*-1
		else
			return this.height 


	addDependantChild:(layer, options={}) ->
		for key, value of this.defaultOpts
			if !options.hasOwnProperty(key)
				if key == "stickyY" && value == "auto"
					options[key] = this.calculateDefaultStickyY(layer, options.scrollDirection)
				else
					options[key] = value

		layer.scrollDirection = options.scrollDirection
		layer.stickyY = options.stickyY
		layer.scrollBehaviour = options.scrollBehaviour
		layer.startY = layer.y
		layer.returnY = options.returnY

		# if options.hasOwnProperty("onYChanged")
		# 	layer.onYChanged = options.onYChanged


		this.dependantChildren.push(layer)
		this.addChild(layer)

		




# # Add the following line to your project in Framer Studio. 
# # myModule = require "myModule"
# # Reference the contents by name, like myModule.myFunction() or myModule.myVar



# exports.coordinatorLayout = null
# exports.scrollview = null

# exports.scrollDirection = 
# 	UP: "up"
# 	DOWN: "down"

# exports.scrollBehaviour = 
# 	AWAY: 0
# 	RETURN: 1


# defaultOpts = 
# 	scrollDirection: exports.scrollDirection.UP
# 	stickyY: "auto"
# 	scrollBehaviour: exports.scrollBehaviour.AWAY
# 	returnY: 0




# calculateDefaultStickyY = (layer, direction) ->
# 	if direction == exports.scrollDirection.UP
# 		return layer.height*-1
# 	else
# 		return exports.coordinatorLayout.height 


# isFunction = (obj) ->
#   return !!(obj && obj.constructor && obj.call && obj.apply)


# lastY = 0

# exports.make = () ->
# 	coordinatorLayout = new Layer
# 		width: Screen.width
# 		height: Screen.height
# 		backgroundColor: "transparent"
# 		name: "coordinatorLayout"

# 	coordinatorLayout.scrollingChildren = []

# 	scrollview = new ScrollComponent
# 		width: Screen.width
# 		height: Screen.height
# 		scrollHorizontal: false
# 		name: "scrollview"
# 		parent: coordinatorLayout

# 	coordinatorLayout.scrollview = scrollview;

# 	scrollview.content.on "change:y", ->
# 		scrollY = Math.max(Math.min(scrollview.scrollY, scrollview.content.height-scrollview.height), 0)
# 		deltaY = scrollY - lastY;

# 		for item in coordinatorLayout.scrollingChildren

# 			if item.scrollDirection == exports.scrollDirection.UP && item.scrollBehaviour == exports.scrollBehaviour.RETURN
# 				item.y = Math.min(Math.max(item.y-deltaY, item.stickyY), Math.max(-scrollY+item.startY, item.returnY))

# 			else if item.scrollDirection == exports.scrollDirection.UP && item.scrollBehaviour == exports.scrollBehaviour.AWAY
# 				item.y = Math.max(-scrollY+item.startY, item.stickyY)	

# 			else if item.scrollDirection == exports.scrollDirection.DOWN && item.scrollBehaviour == exports.scrollBehaviour.RETURN
# 				item.y = Math.max(Math.min(item.y+deltaY, item.stickyY), Math.min(scrollY+item.startY, item.returnY))	

# 			else if item.scrollDirection == exports.scrollDirection.DOWN && item.scrollBehaviour == exports.scrollBehaviour.AWAY
# 				item.y = Math.min(scrollY+item.startY, item.stickyY)	


# 			lastIsStuck = item.isStuck;
# 			if item.y == item.stickyY
# 				item.isStuck == true
# 			else
# 				item.isStuck == false

# 			lastIsReturned = item.isReturned;
# 			if item.y == item.returnY
# 				item.isReturned = true
# 			else
# 				item.isReturned = false

# 			if item.hasOwnProperty("onStickChanged") && lastIsStuck != item.isStuck
# 				item.onStickChanged(item, scrollY);

# 			if item.hasOwnProperty("onYChanged")
# 				item.onYChanged(item, scrollY)


# 		lastY = scrollY




# 	exports.coordinatorLayout = coordinatorLayout
# 	exports.scrollview = scrollview


# exports.addScrollingChild = (item, opts = {}) ->

# 	for key, value of defaultOpts
# 		if !opts.hasOwnProperty(key)
# 			if key == "stickyY" && value == "auto"
# 				opts[key] = calculateDefaultStickyY(item, opts.scrollDirection)
# 			else
# 				opts[key] = value

# 	item.scrollDirection = opts.scrollDirection
# 	item.stickyY = opts.stickyY
# 	item.scrollBehaviour = opts.scrollBehaviour
# 	item.startY = item.y
# 	item.returnY = opts.returnY

# 	if opts.hasOwnProperty("onYChanged")
# 		item.onYChanged = opts.onYChanged

# 	if opts.hasOwnProperty("onStickChanged")
# 		item.onStickChanged = opts.onStickChanged


# 	exports.coordinatorLayout.scrollingChildren.push(item)
# 	exports.coordinatorLayout.addChild(item)














