//just a random idea

function thing( properties ) {
	
	var config = Object.assign({
		a : 0,
		b : 1
	}, properties)
	
	return Object.assign( function(p){return thing(p)}, {
		a : config.a
	  , b : config.b
	}
}

module.exports = thing()