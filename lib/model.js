var createVAO = require("gl-vao")
var glslify = require('glslify')

var internals = {
	
	init : function( state, gl ) {
		
		var createShader = glslify({
		    vertex: './shaders/model.vert'
		  , fragment: './shaders/model.frag'
		})(gl)
		
		//Create shader object
		state.shader = createShader(gl)
		state.shader.attributes.position.location = 0
		state.shader.attributes.color.location = 1

		//Create vertex array object
		state.vao = createVAO(gl, [
			{
				"buffer": createBuffer(gl, [-1, 0, 0, -1, 1, 1]),
				"type": gl.FLOAT,
				"size": 3
			}
		])
		
	}
	
}

module.exports = function createModel( gl, properties ) {
	
	var config = _.extend({
		
	}, properties)
	
	var state = {
		vao : null,
		shader : null
	}
	
	internals.init( state, gl )
	
	return {
		
	}
}