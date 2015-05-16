module.exports = function glClearFn( app ) {
	
	return function() {
		
		var gl = app.gl
		
		gl.clearColor( 1, 1, 1, 1 )
		gl.clearDepth( 1 )
		gl.clearStencil( 0 )

		gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT )
		
		gl.viewport( 0, 0, app.width, app.height );
		
	}
}