defaults = 
	highlightColor: "#F50057"

exports.makeToggleable = (layer,  highlightColor = defaults.highlightColor) ->
	if layer.childrenWithName("highlight").length == 0
		highlight = createHighlight(layer, highlightColor, 0)
	
	contentsActive = layer.childrenWithName("contentsActive")[0]
	contents = layer.childrenWithName("contents")[0]

	contentsActive.opacity = 0;
	contents.opacity = 1;

	layer.clip = true
	layer.toggleState = false;


exports.toggle = (layer) ->
	if layer.toggleState
		exports.deactivateButton(layer)
	else
		exports.activateButton(layer)


exports.activateButton = (layer) ->
	highlight = layer.childrenWithName("highlight")[0]
	contentsActive = layer.childrenWithName("contentsActive")[0]
	contents = layer.childrenWithName("contents")[0]
	
	highlight.animate
		properties:
			opacity: 1
		time: 0.3
		
	contentsActive.animate
		properties:
			opacity: 1
		time: 0.3

	contents.animate
		properties:
			opacity: 0
		time: 0.3

	layer.toggleState = true

		

exports.deactivateButton = (layer) ->
	highlight = layer.childrenWithName("highlight")[0]
	contentsActive = layer.childrenWithName("contentsActive")[0]
	contents = layer.childrenWithName("contents")[0]
	
	highlight.animate
		properties:
			opacity: 0
		time: 0.3
		
	contentsActive.animate
		properties:
			opacity: 0
		time: 0.3

	contents.animate
		properties:
			opacity: 1
		time: 0.3

	layer.toggleState = false


createHighlight = (layer, highlightColor, border) ->
	highlight = new Layer
		x: 0
		y: 0
		width: layer.width
		height: layer.width
		borderRadius: layer.borderRadius
		backgroundColor: highlightColor
		name:"highlight"
		opacity: 0
		
	layer.addChild(highlight);
	highlight.center()
	highlight.sendToBack();
	
	return highlight