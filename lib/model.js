var	Glslify		  = require('glslify')
var CreateVAO	  =	require('gl-vao')
  , CreateBuffer  =	require('gl-buffer')
  , GlShader	  =	require('gl-shader')
  , Extend		  =	require('xtend')
  , Mat4		  =	require('gl-mat4')

var internals = {
	
	init : function( gl ) {
		
		var shader = GlShader(gl,
			Glslify('./shaders/model.vert'),
			Glslify('./shaders/model.frag')
		)
		
		shader.attributes.position.location = 0

		//Create vertex array object
		var vao = CreateVAO(gl, [{
			buffer: CreateBuffer(gl, [
				-1,  0, 0,
				 0, -1, 0,
				 1,  1, 0
			]),
			type: gl.FLOAT,
			size: 3
		}])
		
		return [ shader, vao ]
	},
	
	updateFn : function( gl, shader, vao ) {
		
		return function() {
			
			debugger
			Mat4.identity(shader.uniforms.model)
			
			shader.uniforms.model = Mat4.create()
			console.log( shader.uniforms.model )
			
			shader.bind()
			vao.bind()
			vao.draw(gl.TRIANGLES, 3)
			vao.unbind()
		}
	}
	
}

module.exports = function createModel( app, properties ) {
	
	var config = Extend({
		
	}, properties)
	
	var [ shader, vao ] = internals.init( app.gl )
	
	app.emitter.on('draw',
		internals.updateFn( app.gl, shader, vao )
	)
	
}