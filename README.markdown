Simple CommonJS
===============

This is a fully-functioning proof-of-concept of a CommonJS implementation for browser JavaScript. There are a couple of other implementations, but I wanted a dead-simple implementation which is easy to understand, and which functions in the same way as the module system on node.js.

There may be some performance issues if one uses this library in a synchronous manner. There is an optional second argument (a callback function with one argument, the module desired), which if specified, will cause the Simple CommonJS to load the library asynchronously.

One other potential drawback is that it is more difficult to combine your JS files to reduce the number of requests.

Still, this library is very simple, and will allow you to develop your node.js libraries and your browser JS libraries in relatively the same way.

This latest version has support for multiple load paths as well as automatic module caching.

This library has no dependencies and should play nicely with JQuery and other libs. It should work in IE6+, Firefox, and WebKit-based browsers. The demonstration index.html file requires a browser with the "console.log" function and therefore won't work with versions of IE before version 9.

Setup
=====

If you have an installation of Ruby with the Sinatra gem, you can run `rackup config.ru` in this directory and then access http://localhost:9292 in your browser.

If you're running a Mac, you can drop the public directory into your ~/Sites directory, then navigate to http://localhost/~username/simple-commonjs/index.html

If you have an installation of Apache, you can drop the public directory into a served directory (such as /var/www).

Note: Your web server must return a response code for files which aren't found that isn't interpreted as an error by a browser. In other words, don't return a 404 error for a script file which isn't found, otherwise your users might get an error message if a script isn't found at one path, but is found at another path. Instead, return a 204 response code, or another response code in the 200 series. This link has a list of error codes:

	http://en.wikipedia.org/wiki/List_of_HTTP_status_codes

Example
=======

Make a file such named "module.js". This will be your module to load in.

The file should contain something like the following:

	exports.add = function(a, b) { return a + b; }

Then to load in the module, just call the following from your page:

	var module = require("module.js");
	
	console.log(module.add(5, 5)); // outputs 10
