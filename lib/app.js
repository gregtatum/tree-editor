var	CreateCanvas = require('./canvas')
  , CreateLoop	   = require('poem-loop')
  , CreateCamera   = require('./camera')
  , Extend         = require('lodash.assign')
  , GlDefaults     = require('./config/gl-defaults')
  , GlClear        = require('./config/gl-clear')

module.exports = function createApp() {
	
	var app = {}

	var loop = CreateLoop()
	var emitter = loop.emitter; // Steal the emitter for the app
	var canvas = CreateCanvas( app, {alpha: false} )
	var camera = CreateCamera( canvas.gl )
	var glDefaults = GlDefaults( canvas.gl )
	
	Extend( app, {
		gl		   : canvas.gl
	  , emitter	   : emitter
	  , loop	   : loop
	  , start	   : loop.start
	  , stop	   : loop.stop
	  , camera	   : camera
	  , glDefaults : glDefaults
	})	

	//Always set the defaults first
	emitter.on('draw', glDefaults )
	emitter.on('draw', GlClear( app ) )

	return app
}