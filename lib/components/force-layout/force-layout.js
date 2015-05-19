var Memoize = require('../../utils/memoize')
var Node = require('immutable-graph/lib/node')()
var _ = require('lodash')
var EventEmitter = require('events').EventEmitter
var D3 = require('d3')
var LayoutLinks = require('./links')
var LayoutNodes = require('./nodes')
var Hsl2Rgb = require('float-hsl2rgb')
var lerp = require('lerp')
var BaseHue = _.random( 0, 1, true )

var internals = {
	
	currentForceLayoutFn : function( graph, getForceLayoutNode ) {
		
		return Memoize(function () {
			
			var state = {
				nodes : []
			  , links : []
			}
	
			var nodes = graph.traverse.each(function( path, graphNode ) {
				
				var layoutNode = getForceLayoutNode( graphNode )
				
				internals.updateLayoutNode( layoutNode, path.length / 2 )
				state.nodes.push( layoutNode )
					
				var downPath = graph.traverse.downAll( path )
				
				graph.root().getIn( downPath ).forEach(function( childNode ) {
					
					state.links.push({
						source: layoutNode
					  , target: getForceLayoutNode( childNode )
					})
				})
			})
			
			state.nodes.reverse()
			state.links.reverse()
			
			return state
		})
	},
		
	updateLayoutNode : function( node, depth ) {
		
		if( !node.loaded ) {
			
			node.loaded = true
			node.x = _.random(-1,1,true)
			node.y = _.random(-1,1,true)
			node.z = 0
		}
		
		if( node.depth !== depth ) {
			
			node.size = lerp( 0.1, 1, 1 - depth / 6 ) * 20 * window.devicePixelRatio
			
			var hue = (BaseHue + depth * 0.1) % 1
			var saturation = 0.5
			var lightness = 0.5
		
			node.color = Hsl2Rgb([ hue, saturation, lightness ])
		}
	},
	
	initForce : function( app, nodeStates ) {
		
		return D3.layout.force()
			.size([1, 1])
			.nodes(nodeStates.nodes) // initialize with a single node
			.links(nodeStates.links)
			.start()
			
	},
	
	restartRandomly : function( currentForceLayout, d3Layout ) {
		
		setInterval(function() {
			
			_.each(currentForceLayout().nodes, function( node) {

				node.x = node.px = _.random(-1,1,true) * 0.1
				node.y = node.py = _.random(-1,1,true) * 0.1
			})
		
			d3Layout.start()
		}, 4000)
	}
}

module.exports = function initForceLayout( app ) {
	
	// Register a mutable target on the immutable node
	var [slug, getForceLayoutNode] = Node.registerStateType("force-layout")
	
	var currentForceLayout = internals.currentForceLayoutFn( app.graph, getForceLayoutNode )
	
	var current = {
		scale : 5 * window.devicePixelRatio
	}
	
	var d3Layout = internals.initForce( app, currentForceLayout() )
	internals.restartRandomly( currentForceLayout, d3Layout )
	
	LayoutLinks( app, current, currentForceLayout )
	LayoutNodes( app, current, currentForceLayout )
	
}