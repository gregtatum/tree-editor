var Memoize = require('../utils/memoize')
var Node = require('immutable-graph/lib/node')()
var _ = require('lodash')
var CreateShader = require('gl-shader')
var Glslify  = require('glslify')
var ShaderConfig = require('gl-shader-config')
var EventEmitter = require('events').EventEmitter

var internals = {
	
	getNodeStatesFn : function( graph, getState, emitter ) {
		
		return Memoize(function () {
	
			var nodeStates = graph.traverse.reduce(function( memo, node ) {
				
				var nodeState = getState( node )
				
				if( !nodeState.loaded ) internals.initState( nodeState )
				memo.push( nodeState )
				return memo
				
			}, [])
			
			emitter.emit( "nodestatechange", nodeStates )
			
			return nodeStates
		})
	},
	
	resizeBufferFn : function( gl, state ) {
		
		return function( nodeStates ) {
			
			var position = state.shader.attributes.position.value
		
			if( nodeStates.length > position.length ) {
			
				var newBuffer = new Float32Array( position.length + 100 )
			
				for( var i=0; i < position.length; i++ ) newBuffer[i] = position[i]
				
				shader.config = ShaderConfig( gl, shader.config, {
					attributes : {
						position : {
							value: newBuffer
						}
					}
				})
			}
			
		}
	},
	
	makeShaderConfig : function( gl ) {
		
		window.b = new Float32Array(100)
		window.b[0] = 0.5
		window.b[1] = 0.5
		
		
		return ShaderConfig( gl, {
			
			program : CreateShader( gl,
				Glslify('./node-tree-editor.vert'),
				Glslify('./node-tree-editor.frag')
			).program,
			
			attributes : {
				position: {
					value: window.b // 50 nodes
				  , size: 2
				  , usage: gl.DYNAMIC_DRAW
				}
			}
		})
	},
	
	initState : function( nodeState ) {
		
		nodeState.loaded = true
		nodeState.x = 0
		nodeState.y = 0
		nodeState.uvx = 0
		nodeState.uvy = 0
	},
	
	updateFn : function( getNodeStates ) {
		
		return function() {
			var nodeStates = getNodeStates()
			
			for( var i=0; i < nodeStates.length; i++ ) {
				var nodeState = nodeStates[i]
				
				nodeState.x += Math.random() * 0.01 - 0.005
				nodeState.y += Math.random() * 0.01 - 0.005
			}
		}
	},
	
	drawFn : function( getNodeStates, state, gl ) {
		
		return function () {
			
			var shader = state.shader
			var nodeStates = getNodeStates()
			
			
			shader.bind()
			
			gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA )
			gl.enable( gl.BLEND )
			
			internals.unPackNodeStates( shader, nodeStates )
			
			gl.drawArrays( gl.POINTS, 0, nodeStates.length )
			
			shader.unbind()
		}
	},
	
	unPackNodeStates : function( shader, nodeStates ) {
		
		var values = shader.attributes.position.value
		
		//Update the shader positions			
		for( let i=0; i < nodeStates.length; i++ ) {
			let nodeState = nodeStates[i]
			
			values[i*2] = nodeState.x
			values[i*2+1] = nodeState.y
		}
		
		shader.attributes.position.bufferData()
	}
	
}

module.exports = function( app ) {
	
	var [slug, getState] = Node.registerStateType("tree-editor")
	
	var state = {
		shader: internals.makeShaderConfig( app.gl )
	}
	var emitter = new EventEmitter()
	var getNodeStates = internals.getNodeStatesFn( app.graph, getState, emitter	)
	
	emitter.on('nodestatechange', internals.resizeBufferFn( app.gl, state ))
	app.emitter.on('update', internals.updateFn( getNodeStates ))
	app.emitter.on('draw', internals.drawFn( getNodeStates, state, app.gl ))
}