var CreateGraph = require('immutable-graph')
  , NodeRegistry = require('immutable-graph/lib/node')()


var [rasterSlug, createRoot]        = NodeRegistry.registerNodeType("root")
var [groupSlug, createGroup]        = NodeRegistry.registerNodeType("group")
var [rasterSlug, createRaster]      = NodeRegistry.registerNodeType("raster")
var [vectorSlug, createVector]      = NodeRegistry.registerNodeType("vector")

module.exports = CreateGraph(

    createRoot({name: "my root"}, [
        createGroup({name: "group 0"}, [
            createRaster({name: "raster1"})
          , createRaster({name: "raster2"})
        ])
      , createGroup({name: "group 1"})
    ])
)