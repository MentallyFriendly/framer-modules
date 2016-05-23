exports.animations =
	slideRight:
		in:
			x:0
		out: 
			x:Screen.width

	slideLeft:
		in:
			x:0
		out: 
			x:-Screen.width

	slideUp:
		in:
			y:0
		out: 
			y:-Screen.height

	slideDown:
		in:
			y:0
		out: 
			y:Screen.height

	slideFadeRight:
		in:
			x:0
			opacity:1
		out: 
			x:'20%'
			opacity:0

	slideFadeLeft:
		in:
			x:0
			opacity:1
		out: 
			x:'-20%'
			opacity:0

	slideFadeUp:
		in:
			y:0
			opacity:1
		out: 
			y:'-20%'
			opacity:0

	slideFadeDown:
		in:
			y:0
			opacity:1
		out: 
			y:'20%'
			opacity:0



animations = exports.animations


class exports.AnimatedPages extends Layer
	selectedIndex:0
	# defaultInAnimation:
	# 	properties:
	# 		opacity:1
	# 		y:0
	# 	time:0.3

	# defaultOutAnimation:
	# 	properties:
	# 		opacity:0
	# 		y:'33%'
	# 	time:0.3


	constructor: (options={}) ->
		if options.upgradeLayer
			layer = options.upgradeLayer
			options.frame = layer.frame
			options.name = layer.name
			options.pages = layer.children
			super(options)
			layer.parent.addChild(this)
			this.placeBehind(layer)
			layer.destroy()
		else
			super(options)


		this.pages = options.pages
		this.makePages()
		this.selectPage(0)


	makePages:()->
		this.pages.forEach (page, i) =>
			page.x = 0
			page.y = 0
			page.opacity = 0
			page.visible = false;
			this.setAnimationsForLayer(page, "slideFadeUp", "slideFadeDown")
			this.addChild(page)


	setAnimationsForLayer:(layer, inAnimationName, outAnimationName) ->

		inAnimation = new Animation
			layer:layer
			properties:animations[inAnimationName].in
			time:0.3

		outAnimation = new Animation
			layer:layer
			properties:animations[outAnimationName].out
			time:0.3

		
		inAnimation.on Events.AnimationStart, () ->
			this._target.visible = true;

		outAnimation.on Events.AnimationEnd, () ->
			this._target.visible = false;

		layer.inAnimation = inAnimation
		layer.outAnimation = outAnimation




	selectPage:(pageIndex)->

		outPage = this.pages[this.selectedIndex]
		inPage = this.pages[pageIndex]

		console.log(inPage)

		outPage.outAnimation.start();
		inPage.inAnimation.start();
		this.height = inPage.height

		this.selectedIndex = pageIndex
		this.emit("pages:change:page", this.selectedIndex)

	animateChildren:()->


