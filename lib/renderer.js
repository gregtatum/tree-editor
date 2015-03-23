var CanvasFit = require('canvas-fit')
  , Mat4 = require('gl-mat4')
  , CreateGlContext = require('gl-context')

var internals = {
	
	createCanvas : function() {
		
		var canvas = document.body.appendChild( document.createElement('canvas') )	
		window.addEventListener( 'resize', CanvasFit(canvas), false )
		return canvas
	}
}

module.exports = function( loop ) {
	
	var canvas = internals.createCanvas()
	
	var gl = CreateGlContext( canvas )
	
	return {
		el : canvas
	  , gl : gl
	}
}