attribute vec3 position;

void main() {
	gl_PointSize = 20.0;
	gl_Position = vec4( position, 1.0 );
}