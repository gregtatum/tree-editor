var Memoize = require('../utils/memoize')
var Node = require('immutable-graph/lib/node')()
var _ = require('lodash')
var CreateShader = require('gl-shader')
var Glslify  = require('glslify')
var ShaderConfig = require('gl-shader-config')
var EventEmitter = require('events').EventEmitter
var D3 = require('d3')

var internals = {
	
	getNodeStatesFn : function( graph, getState, emitter ) {
		
		return Memoize(function () {
			
			var state = {
				nodes : []
			  , links : []
			}
	
			var nodes = graph.traverse.each(function( path, node ) {
				
				var nodeState = getState( node )
				
				if( !nodeState.loaded ) internals.initState( nodeState )
				state.nodes.push( nodeState )
					
				var downPath = graph.traverse.downAll( path )
				
				graph.root().getIn( downPath ).forEach(function( childNode ) {
					
					state.links.push({
						source: nodeState
					  , target: getState( childNode )
					})
				})
			})
			
			emitter.emit( "nodestatechange", state )
			
			return state
		})
	},
	
	resizePositionBufferFn : function( gl, state, shaderKey, elementsKey ) {
		
		return function( elements ) {

			var position = state[shaderKey].attributes.position.value
			var size = state[shaderKey].attributes.position.size
		
			if( elements[elementsKey].length > position.length / size ) {
			
				var newBuffer = new Float32Array( position.length + 50 * size )
			
				for( var i=0; i < position.length; i++ ) newBuffer[i] = position[i]
				
				state[shaderKey] = ShaderConfig( gl, state[shaderKey], {
					attributes : {
						position : {
							value: newBuffer
						}
					}
				})
			}
		}
	},
	
	makeNodeShader : function( gl, getNodeStates ) {
		
		var existingNodes = getNodeStates().nodes.length
		var extraNodes    = 50
		var floatsPerVec  = 3
		
		return ShaderConfig( gl, {
			
			program : CreateShader( gl,
				Glslify('./nodes.vert'),
				Glslify('./nodes.frag')
			).program,
			
			attributes : {
				position: {
					value: new Float32Array( (existingNodes+extraNodes) * floatsPerVec )
				  , size: floatsPerVec
				  , usage: gl.DYNAMIC_DRAW
				}
			}
		})
	},
	
	makeLinkShader : function( gl, getNodeStates ) {

		var existingLinks = getNodeStates().links.length
		var extraLinks    = 50
		var floatsPerLine = 4
		
		return ShaderConfig( gl, {
			
			program : CreateShader( gl,
				Glslify('./links.vert'),
				Glslify('./links.frag')
			).program,
			
			attributes : {
				position: {
					value: new Float32Array( (existingLinks+extraLinks) * floatsPerLine )
				  , size: 2
				  , usage: gl.DYNAMIC_DRAW
				}
			},
			
			drawing : {
				mode : gl.LINES
			}
		})
	},
	
	initState : function( nodeState ) {
		
		nodeState.loaded = true
		nodeState.x = _.random(-100,100,true)
		nodeState.y = _.random(-100,100,true)
		nodeState.uvx = 0
		nodeState.uvy = 0
	},
	
	initForce : function( nodeStates ) {
		
		return D3.layout.force()
			.size([1, 1])
			.nodes(nodeStates.nodes) // initialize with a single node
			.links(nodeStates.links)
			.linkDistance(function(d) {

				return 0.05

			})
			.start()
			
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
			
			// Pre-set up
			var nodeStates = getNodeStates()
			gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA )
			gl.enable( gl.BLEND )
			// gl.enable( gl.DEPTH_TEST )
			
			gl.enable( gl.BLEND );
			gl.blendEquation( gl.FUNC_ADD );
			gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA );
			
			
			//Draw links
			
			var linkShader = state.linkShader
			linkShader.bind()
							
			internals.unPackLinkStates( linkShader, nodeStates.links )
			
			gl.drawArrays( gl.LINES, 0, nodeStates.links.length * 2 )
			
			linkShader.unbind()
			
			
			//Draw nodes
			var nodeShader = state.nodeShader
			nodeShader.bind()
				
			internals.unPackNodes( nodeShader, nodeStates.nodes )
			
			gl.drawArrays( gl.POINTS, 0, nodeStates.nodes.length )
			
			nodeShader.unbind()
			
		}
	},
	
	unPackNodes : function( nodeShader, nodes ) {
		
		var values = nodeShader.attributes.position.value
		
		//Update the shader positions			
		for( let i=0; i < nodes.length; i++ ) {
			let node = nodes[i]
			
			values[i*3] = node.x * 0.005
			values[i*3+1] = node.y * 0.005
			values[i*3+2] = i / nodes.length * 0.1
		}
		
		nodeShader.attributes.position.bufferData()
	},
	
	unPackLinkStates : function( linkShader, links ) {
		
		var values = linkShader.attributes.position.value
		
		//Update the shader positions			
		for( let i=0; i < links.length; i++ ) {
			let link = links[i]
			
			values[i*4]   = link.source.x     * 0.005
			values[i*4+1] = link.source.y     * 0.005
			values[i*4+2] = link.target.x     * 0.005
			values[i*4+3] = link.target.y     * 0.005
		}
		
		linkShader.attributes.position.bufferData()
	}
	
}

module.exports = function( app ) {
	
	var [slug, getState] = Node.registerStateType("tree-editor")
	var emitter = new EventEmitter()
	var getNodeStates = internals.getNodeStatesFn( app.graph, getState, emitter	)
	
	var state = {
		nodeShader: internals.makeNodeShader( app.gl, getNodeStates )
	  , linkShader: internals.makeLinkShader( app.gl, getNodeStates )
	}
	
	internals.initForce( getNodeStates() )
	
	emitter.on('nodestatechange', internals.resizePositionBufferFn( app.gl, state, "nodeShader", "nodes" ))
	emitter.on('nodestatechange', internals.resizePositionBufferFn( app.gl, state, "linkShader", "links" ))
	
	// app.emitter.on('update', internals.updateFn( getNodeStates ))
	app.emitter.on('draw', internals.drawFn( getNodeStates, state, app.gl ))
}