
(function(rxos_config) {
  'use strict';

  module.exports.getTunerConf = function(args, callback, request, response) {
    rxos_config.getTunerConf( function (r) {
        callback(false, r);
    });
  };

  module.exports.setTunerConf = function(args, callback, request, response) {
    rxos_config.setTunerConf(args, function (r) {
        callback(false, r);
    });
  };

  module.exports.getOnddStatus = function(args, callback, request, response) {
    rxos_config.getOnddStatus(function (r) {
        if (r) callback(false, r); else callback(true, r);
    });
  };

  module.exports.getOnddTransfers = function(args, callback, request, response) {
    rxos_config.getOnddTransfers(function (r) {
        if (r) callback(false, r); else callback(true, r);
    });
  };

  module.exports.getOnddStatus2 = function(args, callback, request, response) {
    callback(false, onddclient.getStatus());
  };

  var onddclient;
  //
  // This is called whenever the HTTP server starts up
  //
  module.exports._onServerStart = function(server, instance, metadata) {
    rxos_config.getOnddClient(function(ondd) {
        onddclient = ondd;
        onddclient.setStatusCallback(console.log);
        console.log("started ondd client");
    });
  };

})(require('rxos_config'));

