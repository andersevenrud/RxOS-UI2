
(function(rxos_config) {
  'use strict';

  module.exports.getNetConf = function(args, callback, request, response) {
    rxos_config.getNetConf( function (r) {
        callback(false, r);
    });
  };

  module.exports.setNetConf = function(args, callback, request, response) {
    rxos_config.setNetConf(args, function (r) {
        callback(false, r);
    });
  };

  //
  // This is called whenever the HTTP server starts up
  //
  module.exports._onServerStart = function(server, instance, metadata) {
  };

})(require('rxos_config'));

