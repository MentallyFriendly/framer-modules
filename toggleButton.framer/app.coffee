# Import file "toggleButton" (sizes and positions are scaled 1:2)

sketch = Framer.Importer.load("imported/toggleButton@2x")

#Import the ripple button module
rippleButton = require "rippleButton"
toggleButton = require "toggleButton"

sketch.button.borderRadius = sketch.button.width/2

#Set up your button so it contains 2 layers, one named contents, and the other named contentsActive (You can do this straight out of sketch if you want)

#To make a button toggleable, call makeToggleable. The args are (layer, highlightColor)
toggleButton.makeToggleable(sketch.button)
rippleButton.addRipple(sketch.button)


sketch.button.onTap ->
	#Calling toggle will switch the current state. 
	#You can also explicitaly activate or deactivate by calling activateButton or deactivateButton
	toggleButton.toggle(sketch.button)
