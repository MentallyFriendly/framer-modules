# Add the following line to your project in Framer Studio. 
# myModule = require "myModule"
# Reference the contents by name, like myModule.myFunction() or myModule.myVar



class exports.TabComponent extends Layer
	tabs: []
	indicatorHeight: 8
	indicatorColor: "#FFF"
	selectedIndex: 0

	constructor: (options={}) ->
		super(options)
		this.tabs = options.tabs
		this.scrollview = this.makeScroll()
		this.populateTabs()
		

		if(options.hasOwnProperty("indicatorHeight"))
			this.indicatorHeight = options.indicatorHeight

		if(options.hasOwnProperty("indicatorColor"))
			this.indicatorColor = options.indicatorColor

		this.indicator = this.makeIndicator()

	makeScroll: ->
		scrollview = new ScrollComponent
			frame: this.frame
			scrollVertical: false
			scrollHorizontal: true
			name: "tabScrollview"
			parent: this
		
		return scrollview

	makeIndicator: ->
		indicator = new Layer
			x:0
			y:this.height-this.indicatorHeight
			width:this.tabs[this.selectedIndex].width
			height:this.indicatorHeight
			backgroundColor:this.indicatorColor
			parent: this.scrollview.content
		return indicator

	populateTabs: ->
		x = 0
		this.tabs.forEach (tab, i) =>
			tab.x = x
			tab.tabIndex = i
			tab.onTap =>
				this.selectTab(tab.tabIndex)

			this.scrollview.content.addChild(tab)
			x = x+tab.width

	selectTab:(tabIndex) ->
		this.selectedIndex = tabIndex
		tab = this.tabs[this.selectedIndex]
		this.scrollview.scrollToLayer(tab, 0.5, 0.5, time:0.2)

		print tab.x, this.scrollview.scrollX
		this.indicator.animate
			properties:
				width: tab.width
				x: tab.x
			time:0.2


		this.emit("tabs:change:tab", this.selectedIndex)



