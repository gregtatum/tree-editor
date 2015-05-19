attribute vec3 position;
attribute vec3 color;
// attribute float opacity;
attribute float size;

uniform vec2 dimensions;
// uniform mat4 projection;
// uniform mat4 modelView;
uniform float strokeSize;
uniform float smoothStep;


varying vec3 vColor;

varying float vStrokeWidth;
varying float vSmoothStep;

void main() {
	
	vColor = color;
	vStrokeWidth = (size - strokeSize) / size;
	vSmoothStep = smoothStep / size;
	
	gl_PointSize = size;
	gl_Position = vec4( position / vec3( dimensions, 1.0 ), 1.0 );
	// gl_Position = projection * modelView * vec4(position, 1.0);
	
}