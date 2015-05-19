var	CreateCanvas = require('./canvas')
  , CreateLoop	   = require('poem-loop')
  , CreateCamera   = require('./camera')
  , Extend         = require('lodash.assign')
  , GlDefaults     = require('./config/gl-defaults')
  , GlClear        = require('./config/gl-clear')

module.exports = function createApp() {
	
	var app = {}

	app.loop       = CreateLoop()
	app.start      = app.loop.start
	app.stop       = app.loop.stop
	app.emitter    = app.loop.emitter; // Steal the emitter for the app
	
	app.canvas     = CreateCanvas( app, {alpha: false} )
	app.gl         = app.canvas.gl
	
	app.camera     = CreateCamera( app )
	app.glDefaults = GlDefaults( app.gl )
	
	//Always set the defaults first
	app.emitter.on('draw', app.glDefaults )
	app.emitter.on('draw', GlClear( app ) )

	return app
}