
class exports.AnimatedPages extends Layer
	selectedIndex:0
	defaultInAnimation:
		properties:
			opacity:1
			y:0
		time:0.3

	defaultOutAnimation:
		properties:
			opacity:0
			y:-this.height/5
		time:0.3

	constructor: (options={}) ->
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
			this.setAnimationsForPage(page, this.defaultInAnimation, this.defaultOutAnimation)
			this.addChild(page)


	setAnimationsForPage:(page, inAnimationObj, outAnimationObj) ->
		inAnimation = new Animation
			layer:page
			properties:inAnimationObj.properties
			time:inAnimationObj.time

		outAnimation = new Animation
			layer:page
			properties:outAnimationObj.properties
			time:outAnimationObj.time

		
		inAnimation.on Events.AnimationStart, () ->
			this._target.visible = true;

		outAnimation.on Events.AnimationEnd, () ->
			this._target.visible = false;

		page.inAnimation = inAnimation
		page.outAnimation = outAnimation


	selectPage:(pageIndex)->

		outPage = this.pages[this.selectedIndex]
		inPage = this.pages[pageIndex]

		console.log(inPage)

		outPage.outAnimation.start();
		inPage.inAnimation.start();

		this.selectedIndex = pageIndex
		this.emit("pages:change:page", this.selectedIndex)