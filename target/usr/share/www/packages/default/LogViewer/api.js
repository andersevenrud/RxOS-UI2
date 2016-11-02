
(function() {
  'use strict';

  var run_cmd = function (cmd, args, callBack ) {
    var spawn = require('child_process').spawn;
    var child = spawn(cmd, args);
    var resp = "";

    child.stdout.on('data', function (buffer) { resp += buffer.toString() });
    child.stdout.on('end', function() { callBack (resp) });
  }

  module.exports.test = function(args, callback, request, response) {
    run_cmd(args['cmd'],args['args'], function(r) {
        callback(false,r);
    });
  };

  //
  // This is called whenever the HTTP server starts up
  //
  module.exports._onServerStart = function(server, instance, metadata) {
  };

})();

