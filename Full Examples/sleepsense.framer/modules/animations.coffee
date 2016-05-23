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
