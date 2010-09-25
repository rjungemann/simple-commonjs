function require(url, callback) {
	var async = callback ? true : false;
	var module = { exports: {}};
	var request = new XMLHttpRequest();
	
	request.open('GET', url, async);
	request.send(null);
	
	if(async) {
		request.onreadystatechange = function(e) {
			if(request.readyState == 4) {
				if(request.status == 200) {
					var script = "(function(module, exports) { " +
						request.responseText + " })(module, module.exports)";

					eval(script);

					callback(module.exports);
				} else {
					throw("Error loading module from \"" + url + "\".");
				}
			}
		}
	} else {
		if(request.status == 200) {
			var script = "(function(module, exports) { " +
				request.responseText + " })(module, module.exports)";
			
			eval(script);
			
			return module.exports;
		} else {
			throw("Error loading module from \"" + url + "\".");
		}
	}
}