Simple CommonJS
===============

This is a fully-functioning proof-of-concept of a CommonJS implementation for browser JavaScript. There are a couple of other implementations, but I wanted a dead-simple implementation which is easy to understand, and which functions in the same way as the module system on node.js.

There may be some performance issues if one uses this library in a synchronous manner. There is an optional second argument (a callback function with one argument, the module desired), which if specified, will cause the Simple CommonJS to load the library asynchronously.

One other potential drawback is that it is more difficult to combine your JS files to reduce the number of requests.

Still, this library is very simple, and will allow you to develop your node.js libraries and your browser JS libraries in relatively the same way.

Setup
=====

If you're running a Mac, drop this directory into your ~/Sites directory, then navigate to http://localhost/~username/simple-commonjs/index.html

If you have an installation of Apache, drop it into a served directory (such as /var/www).

Example
=======

Make a file such named "module.js". This will be your module to load in.

The file should contain something like the following:

	exports.add = function(a, b) { return a + b; }

Then to load in the module, just call the following from your page:

	var module = require("module.js");
	
	console.log(module.add(5, 5)); // outputs 10