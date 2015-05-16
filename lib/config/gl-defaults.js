module.exports = function glDefaultsFn( gl ) {
	
	return function() {
		
		gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA )
		gl.enable( gl.BLEND )
		gl.enable( gl.DEPTH_TEST )
	}
}