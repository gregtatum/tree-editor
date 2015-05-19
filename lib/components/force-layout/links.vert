attribute vec3 position;

uniform vec2 dimensions;

void main() {
	gl_Position = vec4( position / vec3( dimensions, 1.0 ), 1.0 );
}