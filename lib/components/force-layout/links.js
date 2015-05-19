var IncreaseBuffer = require('../../utils/increase-buffer')
var CreateProgram = require('../../utils/shader-program').createProgram
var Glslify  = require('glslify')
var ShaderConfig = require('gl-shader-config')
var Memoize = require('../../utils/memoize')

var internals = {
	
	createShader : function( gl, currentForceLayout ) {
		
		var currentLinks  = currentForceLayout().links
		var extraLinks    = 50
		var floatsPerVec  = 3
		var floatsPerLine = 2 * floatsPerVec
		
		return ShaderConfig( gl, {
			
			program : CreateProgram( gl,
				Glslify('./links.vert'),
				Glslify('./links.frag')
			),
			
			attributes : {
				position: {
					value: new Float32Array( (currentLinks.length + extraLinks) * floatsPerLine )
				  , size: floatsPerVec
				  , usage: gl.DYNAMIC_DRAW
				}
			},
			
			drawing : {
				mode : gl.LINES
			}
		})
	},
	
	drawFn : function( currentForceLayout, current, gl ) {
		
		return function () {
			
			// Pre-set up
			var links = currentForceLayout().links

			
			
			var shader = current.shader
			
			internals.unPackLinks( shader, links )
			
			shader.bind()
			
							
			
			var vecsPerLink = 2
			
			gl.drawArrays( gl.LINES, 0, links.length * vecsPerLink )
			
			shader.unbind()
		}
	},
	
	unPackLinks : function( shader, links ) {
		
		var values = shader.attributes.position.value
		
		//Update the shader positions			
		for( let i=0; i < links.length; i++ ) {
			let link = links[i]
			
			values[i*6]   = link.source.x     * 0.005
			values[i*6+1] = link.source.y     * 0.005
			
			values[i*6+2] = -0.001
			
			values[i*6+3] = link.target.x     * 0.005
			values[i*6+4] = link.target.y     * 0.005
			values[i*6+5] = -0.001
		}
		
		shader.attributes.position.bufferData()
		
	},
	
	updateBuffersFn : function( gl, current, currentForceLayout ) {

		var increaseBy = 50
		
		var updateBuffers = Memoize( function( layout ) {
			
			var attrs = current.shader.attributes
			var currrentBufferSize = attrs.position.value.length / attrs.position.size
		
			if( layout.links.length > currrentBufferSize ) {
				
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
		internals.drawFn( currentForceLayout, current, app.gl )
	)
}