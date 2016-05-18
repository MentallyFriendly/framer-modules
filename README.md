# Framer Modules
A Collection of reusable modules for Framer.js
For instructions on how to use modules, check the [docs](http://framerjs.com/docs/#modules.modules)

## Usage
Given we don't have private NPM, there's a couple of ways to install a module.
* Download the repo, look at the example you want, and then copy the appropriate files from the example's /modules folder to yours.
* Check the share link of the module, open it into Framer, then copy the module files into your projects /modules folder.

## Modules
This repo contains the following modules

#### Ripple Button
[Example](http://share.framerjs.com/22p5l14xffco/)

Applies a ripple effect to any layer. You can customise the colour, element shadow, and timing.
* TODO: Allow a ripple to be called manually, rather than just firing on tap
* TODO: Allow the ripple to spawn from the tap point, rather than the center of the layer
* TODO: Allow overriding the default easing


#### Toggle Button
[Example](http://share.framerjs.com/mowa59op63q2/)

Makes any layer a toggle-able button. You can customise it's active state colour.
* TODO: Allow for custom hooks into activate & deactivate methods
* TODO: Allow overriding the default animations


#### Coordinator Layout
[Example](http://share.framerjs.com/65xtvbd3eduw/)

A base layout that controls collapsable/scrolling headers & footers. A crude approximation of Android's coordinatorLayout
* TODO: Make the module spawn unique instances, so multiple layouts can exist in the same document


