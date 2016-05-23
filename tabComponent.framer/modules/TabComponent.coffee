# Add the following line to your project in Framer Studio. 
# myModule = require "myModule"
# Reference the contents by name, like myModule.myFunction() or myModule.myVar



class exports.TabComponent extends Layer
	tabs: []
	indicatorHeight: 8
	indicatorColor: "#FFF"
	selectedIndex: 0

	constructor: (options={}) ->
		if  options.upgradeLayer
			layer = options.upgradeLayer
			options.x = layer.x
			options.y = layer.y
			options.height = layer.height
			options.width = Math.min(layer.width, Screen.width)
			options.name = layer.name
			options.tabs = layer.children
			super(options)
			layer.parent.addChild(this)
			this.placeBehind(layer)
			layer.destroy()

		else
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
			size: this.size
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
			if tab.childrenWithName("active").length > 0 && tab.childrenWithName("inactive").length > 0
				tab.childrenWithName("active")[0].visible = false
				tab.childrenWithName("inactive")[0].visible = true

			tab.x = x
			tab.tabIndex = i
			tab.onTap =>
				this.selectTab(tab.tabIndex)

			this.scrollview.content.addChild(tab)
			x = x+tab.width

		if this.scrollview.content.width <= this.width
			this.scrollview.scrollHorizontal = false;

	selectTab:(tabIndex) ->
		outTab = this.tabs[this.selectedIndex]
		inTab = this.tabs[tabIndex]
		this.scrollview.scrollToLayer(inTab, 0.5, 0.5, time:0.2)
		inTab.placeBehind(this.indicator)
		# print tab.x, this.scrollview.scrollX
		this.indicator.animate
			properties:
				width: inTab.width
				x: inTab.x
			time:0.2

		if outTab.childrenWithName("active").length > 0 && outTab.childrenWithName("inactive").length > 0
			outTab.childrenWithName("active")[0].visible = false
			outTab.childrenWithName("inactive")[0].visible = true

		if inTab.childrenWithName("active").length > 0 && inTab.childrenWithName("inactive").length > 0
			inTab.childrenWithName("active")[0].visible = true
			inTab.childrenWithName("inactive")[0].visible = false


		this.selectedIndex = tabIndex
		this.emit("tabs:change:tab", this.selectedIndex)


	upgradeToTabComponent:(layer) ->
		print "derp"



