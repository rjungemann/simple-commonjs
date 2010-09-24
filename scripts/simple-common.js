function require(url, callback) {
	var async = callback ? true : false;
	var module = { exports: {}};
	
	$.ajax({
		url: url,
		dataType: "text",
		async: async,
		complete: function(e) {
			var script = "(function(module, exports) { " +
				e.responseText + " })(module, module.exports)";
			
			eval(script);
			
			if(callback) { callback(module.exports); }
		}
	});
	if(!async) { return module.exports; }
}