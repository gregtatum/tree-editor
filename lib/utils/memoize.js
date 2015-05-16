var shallowEquals = require('shallow-equals')

module.exports = function memoize(fn, nArgs) {
	
	var cachedArguments
	var cachedResult
	
	if( nArgs ) {
		
		return function memoizeNArgs(...allArgs) {
		
			var args = allArgs.slice(0,nArgs)
			
			if( !shallowEquals( args, cachedArguments ) ) {
			
				let restArgs = allArgs.slice(nArgs, allArgs.length)
				cachedArguments = args
				
				cachedResult = fn.apply(this, args.concat( restArgs ) )
			}
		
			return cachedResult
		}
		
	} else {
		return function memoizeAllArgs(...args) {
		
			if( !shallowEquals( args, cachedArguments ) ) {
			
				cachedArguments = args
				cachedResult = fn.apply(this, args)
			}
		
			return cachedResult
		}
	}
}