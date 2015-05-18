precision mediump float;

varying vec3 vColor;

void main() {

	// Map coord range ( [0,0] , [1,1] ) => ( [-1,-1], [1,1] )
	vec2 coord = ( gl_PointCoord - vec2(0.5, 0.5) ) * 2.0;
	float coordLength = length(coord);
	
	float alpha = 1.0 - smoothstep(
		0.9,
		1.0,
		coordLength
	);

	float mask = smoothstep( 0.8, 0.9, coordLength );
	// vec3 fill = vec3( 0.0, 0.5, 0.8 );
	vec3 fill = vColor;
	vec3 stroke = vec3( 1.0, 1.0, 1.0 );
	
	vec3 color = fill * (1.0 - mask) + stroke * mask;

	// Set the color to white with an alpha
	gl_FragColor = vec4( color, alpha );
}
