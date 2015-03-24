var Mat4 = require('gl-mat4')
  , Extend	  =	require('xtend')

var internals = {
	
	updateProjection : function( state ) {
		
		return Mat4.perspective( state.projection
			
		  , state.fieldOfView
		  , state.aspectRatio
		  , state.near
		  , state.far
		)
	},
	
	updateView : function( state ) {
		
		return Mat4.lookAt( state.view
		
		  , state.position
		  , state.lookAt
		  , state.upVector
		)
	},
	
	bindUniforms : function( state, shader ) {
		
		if( shader.uniforms.projection ) shader.uniforms.projection = state.projection
		if( shader.uniforms.view ) shader.uniforms.view = state.view
		
	}
}

module.exports = function( gl, properties ) {
	
	var config = Extend({
		
		aspectRatio	: gl.drawingBufferWidth / gl.drawingBufferHeight
	  , fieldOfView	: Math.PI / 4
	  , near		: 0.01
	  , far			: 100
		
	  , position	: [0,0,-10]
	  , lookAt		: [0,0,0]
	  , upVector	: [0,1,0]
		
	}, properties)
	
	var state = Extend({
		projection	: Mat4.create()
	  , view		: Mat4.create()
	}, config)
	
	internals.updateProjection( state )
	internals.updateView( state )
	
	return {
		
		position	: state.position
	  , lookAt		: state.lookAt
		
	  , projection	: state.projection
	  , view		: state.view
		
	  , updateProjection	: () => internals.updateProjection( state )
	  , updateView			: () => internals.updateView( state )
	  , update				: () => (internals.updateProjection( state ), internals.updateView( state ))
	  , bind				: (shader) => internals.bindUniforms( state, shader )
	}
}