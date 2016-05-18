

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

			
			layer.emit("coordinatedChild:change:y", layer)


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

		this.dependantChildren.push(layer)
		this.addChild(layer)

		














