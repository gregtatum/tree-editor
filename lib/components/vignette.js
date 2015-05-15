var CreateBackground = require('gl-vignette-background')

module.exports = function( app, properties ) {
	
	var width = app.width
	var height = app.height
	
	var background = CreateBackground( app.gl )
	
    var radius = width * 1.05

    //optional styling 
	background.style({
		scale: [ 1/width * radius, 1/height * radius],
		aspect: 1,
		color1: [0.3, 0.3, 0.3],
		color2: [0.1, 0.1, 0.1],
		smoothing: [ -0.5, 1.0 ],
		noiseAlpha: 0.1,
	})
	
	app.emitter.on( 'draw', function() {
		background.draw()
	})
}