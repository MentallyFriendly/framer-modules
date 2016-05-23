

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
		parallax: 1

	parallaxVals:
		slow:0.3
		mid:0.6
		fast:0.9

	lastY: 0

	constructor: (options={}) ->
		_this = this
		if options.upgradeLayer
			layer = options.upgradeLayer
			options.frame = layer.frame
			options.name = layer.name
			super(options)

			_this.scrollview = _this.makeScroll();
			_this.content = _this.scrollview.content

			_this.populateUpgradedLayers(layer.children)

			layer.parent.addChild(this)
			this.placeBehind(layer)
			layer.destroy()
		else
			super(options)
			_this.scrollview = _this.makeScroll();
			_this.content = _this.scrollview.content

		

		_this.content.on "change:y", ->
			_this.onScroll(_this)
		

	populateUpgradedLayers:(layers) ->
		for layer in layers
			layer.originalIndex = layer.index
			if layer.name.match(/^header/) || layer.name.match(/^footer/)
				layerOpts = {}

				if layer.name.match(/^header/)
					layerOpts.scrollDirection = "up"
				else if layer.name.match(/^footer/)
					layerOpts.scrollDirection = "down"

				if layer.name.match(/-away/)
					layerOpts.scrollBehaviour = "away"
				else if layer.name.match(/-return/)
					layerOpts.scrollBehaviour = "return"

					if layer.name.match(/-top/)
						layerOpts.returnY = 0
					else if layer.name.match(/-bottom/)
						layerOpts.returnY = this.height-layer.height
					else if layer.name.match(/-original/)
						layerOpts.returnY = layer.y

				if layer.name.match(/-parallax/)
					if layer.name.match(/-parallax-slow/)
						layerOpts.parallax = this.parallaxVals.slow
					if layer.name.match(/-parallax-mid/)
						layerOpts.parallax = this.parallaxVals.mid
					if layer.name.match(/-parallax-fast/)
						layerOpts.parallax = this.parallaxVals.fast


				this.addDependantChild(layer, layerOpts)


			else if layer.name.match(/^scroller/)
				content = layer.childrenWithName("content")[0]
				content.x = 0;
				content.y = 0
				for child in content.children
					this.content.addChild(child)
				content.destroy()
				# this.content.addChild(layer.childrenWithName("content")[0])

			
		for layer in layers
			if layer.name.match(/^scroller/)
				this.scrollview.index = layer.originalIndex
			else
				layer.index = layer.originalIndex




	makeScroll: ->
		scrollview = new ScrollComponent
			size: this.size
			scrollHorizontal: false
			name: "coordinatorScrollview"
			parent: this

		# this = this
		
		return scrollview



	onScroll:(_this) ->
		

		for layer in _this.dependantChildren
			scrollY = _this.scrollview.scrollY*layer.parallax
			# scrollY = Math.max(Math.min(_this.scrollview.scrollY*layer.parallax, _this.scrollview.content.height-_this.scrollview.height), 0)
			deltaY = scrollY - _this.lastY;

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
		layer.parallax = options.parallax

		this.dependantChildren.push(layer)
		this.addChild(layer)

		














