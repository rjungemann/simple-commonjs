/*
  Defines the following functions in the current context:
    * EventEmitter()
    * sequence(callbacks)
    * test(tests)
    * require(url, callback)
*/
(function() {
  function EventEmitter() {
    var self = this;
    var ls = {};

    this.emit = function(event) {
      var i, args = [];

      for(i = 0; i < arguments.length; i++) { args.push(arguments[i]); }
      ls[event] = ls[event] || [];

      for(i = 0; i < ls[event].length; i++) {
        ls[event][i].apply(self, args);
      }
    }
    this.on = function(event, listener) {
      ls[event] = ls[event] || [];
      ls[event].push(listener);
    }
    this.removeListener = function(event, listener) {
      var l = [];

      for(var i = 0; i < ls[event].length; i++) {
        if(ls[event][i] != listener) { l.push(ls[event][i]); }
      }
      ls[event] = l;
    }
    this.removeAllListeners = function(event) { ls[event] = []; }
    this.listeners = function(event) { return ls[event]; }
  }
  function sequence(callbacks) {
    i = 0;
    emitter = new EventEmitter();
    emitter.on('next', function(e) {
      if(i < callbacks.length - 1) {
        i++;
        callbacks[i](emitter);
      } else {
        emitter.emit('done');
      }
    });
    callbacks[i](emitter);
    return emitter;
  }
  function test(tests) {
    var emitter = new EventEmitter();
    var events = 'succeed pending fail'.split(' ');

    for(var i = 0; i < events.length; i++) {
      (function(event) {
        emitter.on(event, function(e, name) {
          try { console.log(event, name); } catch(e) {}
        });
        emitter[event] = function(callback) {
          emitter.emit(event, callback);
        }
      })(events[i]);
    }
    for(var key in tests) { tests[key](emitter, key); }
  }
  function simpleRequire(url, callback, error) {
    var async = callback ? true : false;
    var module = { exports: {}};
    var request = new XMLHttpRequest();
    var errorString = "Error loading module from \"" + url + "\".";
    var jsUrl = url + '.js';

    try {
      request.open('GET', jsUrl, async);
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
              if(error) { error(errorString); } else { throw(errorString); }
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
          if(error) { error(errorString); } else { throw(errorString); }
        }
      }
    } catch(e) {
      if(error) { error(errorString); } else { throw(errorString); }
    }
  }
  function require(url, callback) {
    var self = this;

    this.paths = this.paths || ['.'];
    this.cache = this.cache || {};

    if(this.cache[url]) {
      if(callback) {
        callback(this.cache[url]);
      } else {
        return this.cache[url];
      }
    } else if(callback) {
      var callbacks = [];

      for(var i = 0; i < this.paths.length; i++) {
        (function(index) {
          var path = this.paths[i];
          var fullPath = path === '' ? url : ([path, url]).join('/');

          callbacks.push(function(emitter) {
            var errorCallback;

            if(index === this.paths.length - 1) {
              errorCallback = function(errorString) {
                emitter.emit('next');
              }
            } else {
              errorCallback = null;
            }
            simpleRequire(fullPath, function(obj) {
              self.cache[url] = obj;

              callback(obj);
            }, errorCallback);
          });
        })(i);
      }
    } else {
      for(var i = 0; i < this.paths.length; i++) {
        var path = this.paths[i];
        var fullPath = path === '' ? url : ([path, url]).join('/');
        var obj = simpleRequire(fullPath, null, function(errorString) {});

        if(obj) {
          this.cache[url] = obj;

          return obj;
        }
      }
      throw("Error loading module from \"" + url + "\".");
    }
  }
  if(window) {
    window.EventEmitter = EventEmitter;
    window.sequence = sequence;
    window.test = test;
    window.require = require;
  }
}).call(this);
