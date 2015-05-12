precision mediump float;

void main() {
	
	// Map ( [0,0] , [1,1] ) => ( [-1,-1], [1,1] )
	vec2 coord = ( gl_PointCoord - vec2(0.5, 0.5) ) * 2.0;
	
	// Step it so that it's a hard transition
	float alpha = step( 0.0, 1.0 - length( coord ) );
	
	vec3 color = vec3( 0.0, 0.5, 0.5 );
	
	// Set the color to white with an alpha
	gl_FragColor = vec4( color, alpha );
}