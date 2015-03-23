var CreateRenderer = require('./renderer')
  , CreateLoop = require('poem-loop')
	
module.exports = function createApp( properties ) {
	
	var config = _.extend({
		
	}, properties)
	
	var loop = CreateLoop()
	var emitter = loop.emitter; // Steal the emitter for the app
	var renderer = CreateRenderer( loop )
	var camera = CreateCamera( renderer.gl )
	
	return {
		gl : renderer.gl
	  , emitter : emitter
	  , loop : loop
	  , start : loop.start
	  , stop : loop.stop
	  , camera : camera
	}
}