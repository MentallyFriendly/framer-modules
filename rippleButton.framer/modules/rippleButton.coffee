defaults = 
	color: "rgba(0,0,0,0.1)"
	shadowColor: "rgba(0,0,0,0.3)"
	shadowBlur: 30
	rippleTime: 0.3
	fadeTime: 0.6

exports.setDefaults = (color = defaults.color, shadowColor = defaults.shadowColor, shadowBlur = defaults.shadowBlur, rippleTime = defaults.rippleTime, fadeTime = defaults.fadeTime) ->
	defaults = 
		color: color
		shadowColor: shadowColor
		shadowBlur: shadowBlur
		rippleTime: rippleTime
		fadeTime: fadeTime


exports.addRipple = (layer, color = defaults.color, shadowColor = defaults.shadowColor, shadowBlur = defaults.shadowBlur) ->

	layer.shadowBlur = 0
	layer.shadowColor = shadowColor

	layer.onTap ->
		s = (layer.width*1.5)-layer.borderRadius
		ripple = new Layer
			x: 0
			y: 0
			width: s
			height: s
			borderRadius: s/2
			backgroundColor: color
			scale: 0
			opacity: 0

		layer.addChild(ripple)
		layer.clip = true
		ripple.center()

		rippleOut = ripple.animate
			properties:
				scale: 1,
				opacity: 1,
			time: defaults.rippleTime

		layer.animate 
			properties:
				shadowBlur: shadowBlur
			time: defaults.rippleTime

		rippleOut.on "end", ->
			rippleFade = ripple.animate
				properties:
					opacity: 0,
				time: defaults.fadeTime

			layer.animate 
				properties:
					shadowBlur: 0
				time: defaults.fadeTime

			rippleFade.on "end", ->
				ripple.destroy()



