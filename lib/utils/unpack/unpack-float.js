module.exports = function unPackFloat( attribute, objs, key ) {

	// the attribute is from the gl-shader-config module, expects:
	//    .value with the ArrayBuffer
	//    .bufferData() which binds and buffers the data to gl

	for( let i=0; i < objs.length; i++ ) {
		let obj = objs[i]
		attribute.value[i] = objs[i][key]
	}

	attribute.bufferData()
}