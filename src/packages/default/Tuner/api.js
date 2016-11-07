
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
        callback(false, r);
    });
  };

  //
  // This is called whenever the HTTP server starts up
  //
  module.exports._onServerStart = function(server, instance, metadata) {
  };

})(require('rxos_config'));

