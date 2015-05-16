var CreateGraph = require('immutable-graph')
  , NodeRegistry = require('immutable-graph/lib/node')()
  , _ = require('lodash')

var [rasterSlug, createRoot]        = NodeRegistry.registerNodeType("root")
var [groupSlug, createGroup]        = NodeRegistry.registerNodeType("group")
var [rasterSlug, createRaster]      = NodeRegistry.registerNodeType("raster")
var [vectorSlug, createVector]      = NodeRegistry.registerNodeType("vector")

module.exports = function() {
	
	var lots = _.map(Array(5), function(n, i) {
		return createRaster({name: "lots" + i})
	})
	var lots2 = _.map(Array(10), function(n, i) {
		return createRaster({name: "lots" + i})
	})
	var lots3 = _.map(Array(30), function(n, i) {
		return createRaster({name: "lots" + i})
	})
	
	
	return CreateGraph(

	    createRoot({name: "my root"}, [
	        createGroup({name: "group 0"}, [
	            createRaster({name: "raster1"})
	          , createRaster({name: "raster2"})
	          , createRaster({name: "raster3"})
	          , createRaster({name: "raster4"})
	          , createRaster({name: "raster5"})
	          , createRaster({name: "raster6"})
	          , createRaster({name: "raster7"})
	          , createRaster({name: "raster8"})
	        ])
  	      , createGroup({name: "group 0"}, [
  	            createRaster({name: "raster1"})
  	          , createRaster({name: "raster2"})
  	        ])
  	      , createGroup({name: "group 0"}, [
	            createRaster({name: "raster1"})
	          , createRaster({name: "raster2"})
	          , createRaster({name: "raster3"})
	          , createRaster({name: "raster4"})
	          , createRaster({name: "raster5"})
	          , createRaster({name: "raster6"})
	          , createRaster({name: "raster7"})
	          , createRaster({name: "raster8"}, [
					createGroup({name: "group 0"}, [
	    	            createRaster({name: "raster1"})
	    	          , createRaster({name: "raster2"})
	    	          , createRaster({name: "raster1"})
	    	          , createRaster({name: "raster2"})
	    	          , createRaster({name: "raster1"})
	    	          , createRaster({name: "raster2"})
	    	        ])
			  ])
  	        ])
  	      , createGroup({name: "group 0"}, lots )
  	      , createGroup({name: "group 0"}, lots2 )
	    ].concat(lots3))
	)
}