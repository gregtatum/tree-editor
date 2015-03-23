var Mat4 = require('gl-mat4')
  , glslify = require('glslify')

var projection = Mat4.create()
var model = Mat4.create()
var view = Mat4.create()

var shader = glslify({
    vert: './shaders/bunny.vert'
  , frag: './shaders/bunny.frag'
})(gl)


function update() {

	width = gl.drawingBufferWidth
	height = gl.drawingBufferHeight

	// Updates our camera view matrix.
	camera.view(view)

	// Optionally, flush the state of the camera. Required
	// for user input to work correctly.
	camera.tick()

	// Update our projection matrix. This is the bit that's
	// responsible for taking 3D coordinates and projecting
	// them into 2D screen space.
	var aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight
	var fieldOfView = Math.PI / 4
	var near = 0.01
	var far	= 100

	mat4.perspective(projection
	  , fieldOfView
	  , aspectRatio
	  , near
	  , far
	)
}

function render() {
	update()

	// Sets the viewport, i.e. tells WebGL to draw the
	// scene across the full canvas.
	gl.viewport(0, 0, width, height)

	// Enables depth testing, which prevents triangles
	// from overlapping.
	gl.enable(gl.DEPTH_TEST)

	// Enables face culling, which prevents triangles
	// being visible from behind.
	gl.enable(gl.CULL_FACE)

	// Binds the geometry and sets up the shader's attribute
	// locations accordingly.
	geometry.bind(shader)

	// Updates our model/view/projection matrices, sending them
	// to the GPU as uniform variables that we can use in
	// `shaders/bunny.vert` and `shaders/bunny.frag`.
	shader.uniforms.uProjection = projection
	shader.uniforms.uView = view
	shader.uniforms.uModel = model

	// Finally: draws the bunny to the screen! The rest is
	// handled in our shaders.
	geometry.draw(gl.TRIANGLES)
}