exports.animations =
	fade:
		in:
			opacity:1
		out: 
			opacity:-1

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
			y:Screen.height

	slideDown:
		in:
			y:0
		out: 
			y:-Screen.height

	slideFadeRight:
		in:
			x:0
			opacity:1
		out: 
			x:Screen.width/8
			opacity:-1

	slideFadeLeft:
		in:
			x:0
			opacity:1
		out: 
			x:-Screen.width/8
			opacity:-1

	slideFadeUp:
		in:
			y:0
			opacity:1
		out: 
			y:Screen.height/8
			opacity:-1

	slideFadeDown:
		in:
			y:0
			opacity:1
		out: 
			y:-Screen.height/8
			opacity:-1



animations = exports.animations


class exports.AnimatedPages extends Layer
	selectedIndex:-1
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
			# page.opacity = 0
			# page.visible = false;
			# this.setAnimationsForLayer(page, "slideFadeUp", "slideFadeDown")
			this.resetPage(page)
			this.addChild(page)


	# setAnimationsForLayer:(layer, inAnimationName, outAnimationName) ->

	# 	inAnimation = new Animation
	# 		layer:layer
	# 		properties:animations[inAnimationName].in
	# 		time:0.3

	# 	outAnimation = new Animation
	# 		layer:layer
	# 		properties:animations[outAnimationName].out
	# 		time:0.3

		
	# 	inAnimation.on Events.AnimationStart, () ->
	# 		this._target.visible = true;

	# 	outAnimation.on Events.AnimationEnd, () ->
	# 		this._target.visible = false;

	# 	layer.inAnimation = inAnimation
	# 	layer.outAnimation = outAnimation


	resetPage:(page)->
		page.visible = false;
		for layer in page.children

			if layer.name.match(/animate_/)
				arr = layer.name.split('_')
				animation = arr[arr.indexOf("animate")+1]
				cascade = false

				if animation == "cascade"
					animation = arr[arr.indexOf("cascade")+1]
					cascade = true

				if animations[animation]
					#print animations[animation].out
					animatable = []
					if cascade
						animatable = layer.children
					else
						animatable.push(layer)

					for l, i in animatable
						l.in = {}
						l.out = {}
						for k, v of animations[animation].out
							#print k, v

							

							l.in[k] =  l[k]
							l.out[k] = l[k]+v
							l[k] = l.out[k]

							l["delayIndex"] = i

				


	selectPage:(pageIndex)->

		outPage = this.pages[this.selectedIndex]
		inPage = this.pages[pageIndex]

		console.log(inPage)

		# outPage.outAnimation.start();
		# inPage.inAnimation.start();
		
		# this.resetPage(inPage)
		inPage.visible = true
		this.animateChildren(inPage, outPage, "in")
		if outPage
			this.animateChildren(outPage, inPage, "out")


		this.height = inPage.height

		this.selectedIndex = pageIndex
		this.emit("pages:change:page", this.selectedIndex)



	animateChildren:(pageA, pageB, state)->

		animatable = this.getAnimatableChildren(pageA)
		


				# if arr.indexOf["shared"]

		#print animatable

		animatable.forEach (l) ->
			
			properties = {}

			for k, v of l[state]
				properties[k] = v

				console.log(l)

			# print properties

			a = new Animation
				layer:l
				properties:properties
				time:0.3


			Utils.delay l.delayIndex*0.02, ->
				a.start();
				# print animations[animation][state]

	getAnimatableChildren:(layer) ->
		animatable = []
		for l in layer.children

			if l.name.match(/animate_/)
				arr = l.name.split('_')
				animation = arr[arr.indexOf("animate")+1]
				
				cascade = false
				
				if animation == "cascade"
					# print "should cascade"
					animation = arr[arr.indexOf("cascade")+1]
					cascade = true
					animatable = l.children
				else
					animatable.push(l)

				# if

		return animatable




					

					




