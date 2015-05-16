module.exports = function increaseBuffer( attribute, increaseBy ) {
	
	var oldBuffer = attribute.value
	var size = attribute.size
	
	var newBuffer = new Float32Array( oldBuffer.length + increaseBy * size )

	for( var i=0; i < oldBuffer.length; i++ ) {
		newBuffer[i] = oldBuffer[i]
	}
		
	return newBuffer
}