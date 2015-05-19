var CreateApp = require('../lib/app')
  , ManifestLoader = require('poem-manifests')
  , Manifests = require('../lib/manifests')

var loader = ManifestLoader( Manifests, {
	getGraph: function() {
		return CreateApp()
	}
})

loader.emitter.on("load", function( e ) {
	
	var app = e.graph
	app.loop.start()
})

loader.load( "treeEditor" )