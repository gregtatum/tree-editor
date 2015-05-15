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
	var renderer = CreateRenderer( loop, {alpha: false} )
	var camera = CreateCamera( renderer.gl )

	var app = {
		gl		: renderer.gl
	  , emitter	: emitter
	  , loop	: loop
	  , start	: loop.start
	  , stop	: loop.stop
	  , width   : window.innerWidth
	  , height  : window.innerHeight
	  , camera	: camera
	}

	emitter.on('draw', function() {
		var gl = app.gl
		
		gl.clearColor( 1, 1, 1, 1 );
		gl.clearDepth( 1 );
		gl.clearStencil( 0 );
		
		gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT )
		
	})

	var model = CreateModel( app )
	
	return app
}