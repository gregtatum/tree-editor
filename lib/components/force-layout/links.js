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
			
		    uniforms: {
		        dimensions : {
		            value: new Float32Array( 2 ),
		            type: "2fv"
		        },
		    },
			
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
	
	drawFn : function( currentForceLayout, current, app ) {
		
		return function () {
			
			var gl = app.gl
			// Pre-set up
			var links = currentForceLayout().links

			
			
			var shader = current.shader
			
			internals.unPackLinks( shader, links, current.settings.scale )
			shader.uniforms.dimensions.value[0] = app.width
			shader.uniforms.dimensions.value[1] = app.height
			
			shader.bind()
			
							
			
			var vecsPerLink = 2
			
			gl.drawArrays( gl.LINES, 0, links.length * vecsPerLink )
			
			shader.unbind()
		}
	},
	
	unPackLinks : function( shader, links, scale ) {
		
		var values = shader.attributes.position.value
		
		//Update the shader positions			
		for( let i=0; i < links.length; i++ ) {
			let link = links[i]
			
			values[i*6]   = link.source.x     * scale
			values[i*6+1] = link.source.y     * scale
			
			values[i*6+2] = -0.001
			
			values[i*6+3] = link.target.x     * scale
			values[i*6+4] = link.target.y     * scale
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
module.exports = function( app, currentForceConfig, currentForceLayout ) {

	var current = {
		shader   : internals.createShader( app.gl, currentForceLayout ),
		settings : currentForceConfig
	}
	
	app.emitter.on( 'draw',
		internals.updateBuffersFn( app.gl, current, currentForceLayout )
	)
	
	app.emitter.on( 'draw',
		internals.drawFn( currentForceLayout, current, app )
	)
}