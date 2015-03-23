var CanvasFit = require('canvas-fit')
  , Mat4 = require('gl-mat4')
  , CreateGlContext = require('gl-context')

var internals = {
	
	createCanvas : function() {
		
		var canvas = document.body.appendChild( document.createElement('canvas') )	
		window.addEventListener( 'resize', CanvasFit(canvas), false )
		return canvas
	},
	
	createCamera : function() {
		
		var perspective = Mat4.perspective([], fovy, aspect, near, far)
		
		return {
			perspective: 
		}
	},
	
}

module.exports = function() {
	
	var canvas = internals.createCanvas()
	var camera = internals.createCamera()
	
	var gl = CreateGlContext( canvas, render )

}