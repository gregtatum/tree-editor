var	CreateRenderer = require('./renderer')
  , CreateLoop	   = require('poem-loop')
  , CreateCamera   = require('./camera')
  , CreateModel	   = require('./model')
  , Extend         = require('xtend')

module.exports = function createApp( properties ) {
	
	var config = Extend({
		
	}, properties)
	
	var loop = CreateLoop()
	var emitter = loop.emitter; // Steal the emitter for the app
	var renderer = CreateRenderer( loop )
	var camera = CreateCamera( renderer.gl )

	var app = {
		gl		: renderer.gl
	  , emitter	: emitter
	  , loop	: loop
	  , start	: loop.start
	  , stop	: loop.stop
	  , camera	: camera
	}
	
	
	var model = CreateModel( app )
	
	loop.start()
}