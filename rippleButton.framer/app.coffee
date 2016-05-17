#Import the ripple button module
rippleButton = require "rippleButton"

background = new BackgroundLayer
	backgroundColor: "#FAFAFA"

layerA = new Layer
	width: background.width/2
	height: background.width/2
	borderRadius: background.width/4
	backgroundColor: "#28affa"
	
layerA.center();

#	To make a layer Rippleable, call addRipple with the target layer, and optional args
#	Options are as follows (layer, color, shadowColor, shadowBlur, rippleTime, fadeTime)
#	Default values are as follows
# 		color: "rgba(0,0,0,0.1)"
# 		shadowColor: "rgba(0,0,0,0.3)"
# 		shadowBlur: 30
# 		rippleTime: 0.3
# 		fadeTime: 0.6

#	To override the defaults globally, you can call setDefaults, with the same options
rippleButton.setDefaults("#rgba(255,255,255,0.2)")
rippleButton.addRipple(layerA)