var Memoize = require('../../utils/memoize')
var Node = require('immutable-graph/lib/node')()
var _ = require('lodash')
var EventEmitter = require('events').EventEmitter
var D3 = require('d3')
var LayoutLinks = require('./links')
var LayoutNodes = require('./nodes')

var internals = {
	
	currentForceLayoutFn : function( graph, getForceLayoutNode ) {
		
		return Memoize(function () {
			
			var state = {
				nodes : []
			  , links : []
			}
	
			var nodes = graph.traverse.each(function( path, graphNode ) {
				
				var layoutNode = getForceLayoutNode( graphNode )
				
				if( !layoutNode.loaded ) internals.initLayoutNode( layoutNode )
				state.nodes.push( layoutNode )
					
				var downPath = graph.traverse.downAll( path )
				
				graph.root().getIn( downPath ).forEach(function( childNode ) {
					
					state.links.push({
						source: layoutNode
					  , target: getForceLayoutNode( childNode )
					})
				})
			})
			
			return state
		})
	},
		
	initLayoutNode : function( node ) {
		
		node.loaded = true
		node.x = _.random(-100,100,true)
		node.y = _.random(-100,100,true)
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
			
	}	
}

module.exports = function initForceLayout( app ) {
	
	// Register a mutable target on the immutable node
	var [slug, getForceLayoutNode] = Node.registerStateType("force-layout")
	
	var currentForceLayout = internals.currentForceLayoutFn( app.graph, getForceLayoutNode )
		
	internals.initForce( currentForceLayout() )
	
	LayoutLinks( app, currentForceLayout )
	LayoutNodes( app, currentForceLayout )
	
}