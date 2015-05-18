var internals = {
	
	compileShader : function( gl, source, type ) {

		var shader = gl.createShader( type )
		gl.shaderSource( shader, source )
		gl.compileShader( shader )

		if (! gl.getShaderParameter(shader, gl.COMPILE_STATUS) ) {
		
			var typeName = type === gl.VERTEX_SHADER ? "vertex" : "fragment"
			throw `Could not compile WebGL ${typeName} shader. \n\n ${gl.getShaderInfoLog( shader )}`
		}

		return shader
	},

	linkProgram : function( gl, vertexShader, fragmentShader ) {
	
		var program = gl.createProgram()
	
		gl.attachShader( program, vertexShader )
		gl.attachShader( program, fragmentShader )
	
		gl.linkProgram( program )
	
		if ( !gl.getProgramParameter( program, gl.LINK_STATUS) ) {
			throw `Could not compile WebGL program. \n\n ${gl.getShaderInfoLog( shader )}`
		}
		return program
	},

	createProgram : function( gl, vertexSource, fragmentSource ) {
	
		var vertexShader = internals.compileShader( gl, vertexSource, gl.VERTEX_SHADER )
		var fragmentShader = internals.compileShader( gl, fragmentSource, gl.FRAGMENT_SHADER )
	
		return internals.linkProgram( gl, vertexShader, fragmentShader )
	}
}

module.exports = {
	compileShader  : internals.compileShader
  , linkProgram    : internals.linkProgram
  , createProgram  : internals.createProgram
}