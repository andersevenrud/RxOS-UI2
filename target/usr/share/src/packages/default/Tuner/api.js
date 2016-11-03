
(function() {
  'use strict';

  var run_cmd = function (cmd, args, callBack ) {
    var spawn = require('child_process').spawn;
    var child = spawn(cmd, args);
    var resp = "";

    child.stdout.on('data', function (buffer) { resp += buffer.toString() });
    child.stdout.on('end', function() { callBack (resp) });
  }

  var tuner_conf_read = function(cb) {
    var fileName="/mnt/data/librarian/librarian.json";
    require('fs').readFile(fileName, function(error, data) {
        if(error) cb(null);
        else {
            console.log(data.toString());
            cb(data.toString());
        }
    });
  };

  var tuner_conf_write = function(settings, cb) {
    var fileName="/mnt/data/librarian/librarian.json";
    tuner_conf_read( function(data) {
        var data_o = {};
        if(data) {
            data_o = JSON.parse(data);
        }
        data_o['ondd_l'] = settings;
        console.log(JSON.stringify(data_o));
        require('fs').writeFile(fileName, JSON.stringify(data_o), cb);
    });
  };

  module.exports.getTunerConf = function(args, callback, request, response) {
    tuner_conf_read( function (r) {
        console.log(r);
        callback(false, r);
    });
  };

  module.exports.setTunerConf = function(args, callback, request, response) {
    tuner_conf_write(args, function (r) {
        console.log(args);
        callback(false, r);
    });
  };

  //
  // This is called whenever the HTTP server starts up
  //
  module.exports._onServerStart = function(server, instance, metadata) {
  };

})();

