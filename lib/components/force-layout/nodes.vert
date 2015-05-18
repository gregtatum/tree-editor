attribute vec3 position;
attribute vec3 color;
// attribute float opacity;
// attribute float size;

// uniform mat4 projection;
// uniform mat4 modelView;

varying vec3 vColor;

void main() {
	vColor = color;
	gl_PointSize = 20.0;
	gl_Position = vec4( position, 1.0 );
	// gl_Position = projection * modelView * vec4(position, 1.0);
	
}