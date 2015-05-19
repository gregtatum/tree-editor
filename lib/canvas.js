var CanvasFit = require('canvas-fit')
  , Mat4 = require('gl-mat4')
  , CreateGlContext = require('gl-context')

var internals = {
	
	createCanvas : function() {
		
		var canvas = document.body.appendChild( document.createElement('canvas') )	
		
		window.addEventListener('resize'
		  , CanvasFit(canvas, window, window.devicePixelRatio )
		  , false
		)
		return canvas
	},
	
	resize : function( app, canvas ) {
		app.width = canvas.width
		app.height = canvas.height
	},
	
	handleResizes : function( app, canvas ) {
		
		var resize = internals.resize.bind( this, app, canvas )
		
		window.addEventListener( 'resize', resize )
		resize()
	}
}

module.exports = function( app, properties ) {
	
	var canvas = internals.createCanvas()
	var gl = CreateGlContext( canvas, properties )
	
	var api = {
		el : canvas
	  , gl : gl
	  , ratio : window.devicePixelRatio > 0 ? window.devicePixelRatio : 1
	}
	
	internals.handleResizes( app, canvas )
	
	return api
}