precision mediump float;

attribute vec3 position;

uniform mat4 projection;
uniform mat4 modelView;

void main() {
	gl_Position = projection * modelView * vec4(position, 1.0);
	// gl_Position = modelView * vec4(position, 1.0);
	// gl_Position = vec4(position, 1.0);
}