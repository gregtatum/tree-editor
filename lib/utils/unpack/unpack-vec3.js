var internals = {
	
	pickUnPackFunction : function( typeOrFn ) {
	
		if( typeOrFn === Array ) {
		
			return function( values, obj, key, i ) {
				values[i*3] = obj[key][0]
				values[i*3+1] = obj[key][1]
				values[i*3+2] = obj[key][2]
			}
		
		} else if ( typeOrFn === Object ) {
			
			return function( values, obj, key, i ) {
				values[i*3] = obj[key].x
				values[i*3+1] = obj[key].y
				values[i*3+2] = obj[key].z
			}
		
		} else if ( typeof(typeOrFn) === "function" ) {
			
			return typeOrFn
			
		} else {
			
			throw new Error("Incorrect value type for unpacking")
		}
	},
	
	unPackVec3Fn : function( type ) {
		
		var unPack = internals.pickUnPackFunction( type )
	
		return function unPackVec3Array( attribute, objs, key ) {
		
			// the attribute is from the gl-shader-config module, expects:
			//    .value with the ArrayBuffer
			//    .bufferData() which binds and buffers the data to gl
		
			for( let i=0; i < objs.length; i++ ) {
				let obj = objs[i]
			
				unPack( attribute.value, objs[i], key, i )
			}

			attribute.bufferData()
		}
	}
}

module.exports = {
	array : internals.unPackVec3Fn( Array )
  , object : internals.unPackVec3Fn( Object )
  , function : internals.unPackVec3Fn
}