var Mat4 = require('gl-mat4')
  , Extend	  =	require('xtend')

var internals = {
	
	updateProjection : function( current ) {
		
		return Mat4.perspective( current.projection
			
		  , current.fieldOfView
		  , current.aspectRatio
		  , current.near
		  , current.far
		)
	},
	
	updateView : function( current ) {
		
		return Mat4.lookAt( current.view
		
		  , current.position
		  , current.lookAt
		  , current.upVector
		)
	},
	
	bindUniforms : function( current, shader ) {
		
		if( shader.uniforms.projection ) shader.uniforms.projection = current.projection
		if( shader.uniforms.view ) shader.uniforms.view = current.view
		
	},
	
	updateAspectRatioFn : function( current ) {
		
		return function updateAspectRatio( event ) {
			current.aspectRatio = event.width / event.height
		}
	}
}

module.exports = function( app, properties ) {

	var current = Extend({

		aspectRatio	: app.width / app.height
	  , fieldOfView	: Math.PI / 4
	  , near		: 0.01
	  , far			: 100
		
	  , position	: [0,0,-10]
	  , lookAt		: [0,0,0]
	  , upVector	: [0,1,0]

	  , projection	: Mat4.create()
	  , view		: Mat4.create()
		
	}, properties)
	
	internals.updateProjection( current )
	internals.updateView( current )
	
	app.emitter.on( 'resize', internals.updateAspectRatioFn( current ) )

	return {
		
		position	: current.position
	  , lookAt		: current.lookAt
		
	  , projection	: current.projection
	  , view		: current.view
		
	  , updateProjection	: () => internals.updateProjection( current )
	  , updateView			: () => internals.updateView( current )
	  , update				: () => (internals.updateProjection( current ), internals.updateView( current ))
	  , bind				: (shader) => internals.bindUniforms( current, shader )
	}
}