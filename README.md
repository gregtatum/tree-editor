# Tree Editor (experimental)

This is the beginnings of a tree editor for the [immutable-graph](https://github.com/TatumCreative/immutable-graph) module. I plan on using this structure to visualize and interact with DOM-like graphical structures. Whether that's an SVG, HTML, or a PSD document.

### Installing

Make sure node and git are installed and then from the command line run:

	git clone https://github.com/TatumCreative/tree-editor.git
	cd tree-editor
	npm install
	npm start

Then point your browser to http://localhost:9966/

### Architecture

The editor takes a graph and then reduces it to an array of mutable objects. Every update calls this reduction function to update the list of mutable objects, but it only runs the reduction once the underlying graph is different (it's a [memoized](http://en.wikipedia.org/wiki/Memoization) function). This immutability reduces the complexity of knowing when to update the state of the application by writing code that looks like it gets updated every frame, but in reality only runs when the underlying graph has been changed.

The layout is performed by [D3's force layout](https://github.com/mbostock/d3/wiki/Force-Layout). This was part of my design philosophy. I wanted to be able to give a consumer access to the structure of the application without being able to mutate the underlying structure, unless it does so through the immutable graph's interface.