var IncreaseBuffer = require('../../utils/increase-buffer')
var CreateProgram = require('../../utils/shader-program').createProgram
var Glslify  = require('glslify')
var ShaderConfig = require('gl-shader-config')
var Memoize = require('../../utils/memoize')

var internals = {
	
	createShader : function( gl, currentForceLayout ) {
		
		var currentNodes  = currentForceLayout().nodes
		var extraNodes    = 50
		var floatsPerVec3 = 3
		
		var colorValues = new Float32Array( (currentNodes.length + extraNodes) * floatsPerVec3 )
		
		colorValues[0] = 1
		colorValues[1] = 2
		colorValues[2] = 3
		
		return ShaderConfig( gl, {
			
			program : CreateProgram( gl,
				Glslify('./nodes.vert'),
				Glslify('./nodes.frag')
			),
			
			attributes : {
				position: {
					value: new Float32Array( (currentNodes.length + extraNodes) * floatsPerVec3 )
				  , size: floatsPerVec3
				  , usage: gl.DYNAMIC_DRAW
				},
				color: {
					value: colorValues
				  , size: floatsPerVec3
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
	
	updateBuffers : function( app, current, layout ) {

		var increaseBy = 50
		
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
	},
	
	onGraphChange : function( app, current, currentForceLayout ) {

		var handleGraphChange = Memoize( function( layout ) {
			
			internals.updateBuffers( app, current, layout )
		})
		
		return function() { handleGraphChange( currentForceLayout() ) }
	}
	
	
}
module.exports = function( app, currentForceLayout ) {
	
	var current = {
		shader: internals.createShader( app.gl, currentForceLayout )
	}

	app.emitter.on( 'update',
		internals.onGraphChange( app, current, currentForceLayout )
	)
	
	app.emitter.on( 'draw',
		internals.drawFn( currentForceLayout, current, app )
	)
}