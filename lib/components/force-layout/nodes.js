var IncreaseBuffer = require('../../utils/increase-buffer')
var CreateShader = require('gl-shader')
var Glslify  = require('glslify')
var ShaderConfig = require('gl-shader-config')
var Memoize = require('../../utils/memoize')

var internals = {
	
	createShader : function( gl, currentForceLayout ) {
		
		var currentNodes = currentForceLayout().nodes
		var extraNodes    = 50
		var floatsPerVec  = 3
		
		return ShaderConfig( gl, {
			
			program : CreateShader( gl,
				Glslify('./nodes.vert'),
				Glslify('./nodes.frag')
			).program,
			
			attributes : {
				position: {
					value: new Float32Array( (currentNodes.length + extraNodes) * floatsPerVec )
				  , size: floatsPerVec
				  , usage: gl.DYNAMIC_DRAW
				}
			}
		})
	},
	
	drawFn : function( currentForceLayout, current, app ) {
		
		return function () {
			var gl = app.gl
			
			// Pre-set up
			var nodes = currentForceLayout().nodes
			
			gl.disable( gl.DEPTH_TEST )
			
			//Draw nodes
			var shader = current.shader
			shader.bind()
			
			internals.unPackNodes( shader, nodes )
			
			gl.drawArrays( gl.POINTS, 0, nodes.length )
			
			//Clean up
			shader.unbind()
			
			app.glDefaults()
		}
	},
	
	unPackNodes : function( shader, nodes ) {
		
		var values = shader.attributes.position.value
		
		//Update the shader positions			
		for( let i=0; i < nodes.length; i++ ) {
			let node = nodes[i]
			
			values[i*3] = node.x * 0.005
			values[i*3+1] = node.y * 0.005
			values[i*3+2] = i / nodes.length * 0.1
		}
		
		shader.attributes.position.bufferData()
	},
	
	updateBuffersFn : function( gl, current, currentForceLayout ) {

		var increaseBy = 50
		
		var updateBuffers = Memoize( function( layout ) {
			
			var attrs = current.shader.attributes
			var currrentBufferSize = attrs.position.value.length / attrs.position.size
		
			if( layout.nodes.length > currrentBufferSize ) {
				
				current.shader = ShaderConfig( gl, state[shaderKey], {
					attributes : {
						position : {
							value: IncreaseBuffer( attrs.position, increaseBy )
						}
					}
				})
			}
		})
		
		return function() { updateBuffers( currentForceLayout() ) }
	}
	
	
}
module.exports = function( app, currentForceLayout ) {
	
	var current = {
		shader: internals.createShader( app.gl, currentForceLayout )
	}
	
	app.emitter.on( 'draw',
		internals.updateBuffersFn( app.gl, current, currentForceLayout )
	)
	
	app.emitter.on( 'draw',
		internals.drawFn( currentForceLayout, current, app )
	)
}