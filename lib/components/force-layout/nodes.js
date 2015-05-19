var IncreaseBuffer = require('../../utils/increase-buffer')
var CreateProgram = require('../../utils/shader-program').createProgram
var Glslify  = require('glslify')
var ShaderConfig = require('gl-shader-config')
var Memoize = require('../../utils/memoize')
var UnPack = require('../../utils/unpack')
var internals = {
	
	createShader : function( gl, currentForceLayout ) {
		
		var currentNodes  = currentForceLayout().nodes
		var extraNodes    = 50
		var floatsPerVec3 = 3
		var bufferSizeVec3 = (currentNodes.length + extraNodes) * floatsPerVec3
		var bufferSizeFloat = (currentNodes.length + extraNodes)
		
		return ShaderConfig( gl, {
			
			program : CreateProgram( gl,
				Glslify('./nodes.vert'),
				Glslify('./nodes.frag')
			),
			
		    uniforms: {
		        dimensions : {
		            value: new Float32Array( 2 ),
		            type: "2fv"
		        },
		    },
			
			attributes : {
				position: {
					value: new Float32Array( bufferSizeVec3 )
				  , size: floatsPerVec3
				  , usage: gl.DYNAMIC_DRAW
				},
				color: {
					value: new Float32Array( bufferSizeVec3 )
				  , size: floatsPerVec3
				  , usage: gl.STATIC_DRAW
				},
				size: {
					value: new Float32Array( bufferSizeFloat )
				  , size: 1
				  , usage: gl.STATIC_DRAW
				}
			}
		})
	},
	
	drawFn : function( currentForceLayout, current, app ) {
		
		var unPackPositions = UnPack.vec3.function( function( values, node, key, i ) {
			
			values[i*3] = node.x * current.settings.scale
			values[i*3+1] = node.y * current.settings.scale
			values[i*3+2] = 0
		})
		
		return function () {
			
			var gl = app.gl
			
			// Pre-set up
			var nodes = currentForceLayout().nodes
			
			gl.disable( gl.DEPTH_TEST )
			
			//Draw nodes
			var shader = current.shader
			shader.bind()
			
			//Update attributes
			unPackPositions( shader.attributes.position, nodes )
			UnPack.vec3.array( shader.attributes.color, nodes, "color" )
			UnPack.float( shader.attributes.size, nodes, "size" )
			
			//Update uniforms
			shader.uniforms.dimensions.value[0] = app.width
			shader.uniforms.dimensions.value[1] = app.height
			
			gl.drawArrays( gl.POINTS, 0, nodes.length )
			
			//Clean up
			shader.unbind()
			
			app.glDefaults()
		}
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
module.exports = function( app, currentForceConfig, currentForceLayout ) {
	
	var current = {
		shader      : internals.createShader( app.gl, currentForceLayout ),
		settings    : currentForceConfig,
	}

	app.emitter.on( 'update',
		internals.onGraphChange( app, current, currentForceLayout )
	)
	
	app.emitter.on( 'draw',
		internals.drawFn( currentForceLayout, current, app )
	)
}