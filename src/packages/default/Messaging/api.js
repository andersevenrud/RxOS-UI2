
(function(rxos_config) {
  'use strict';

  module.exports.runTask = function(args, callback, request, response) {
    rxos_config.runTask(args, function(r) {
        callback(false,r);
    });
  };

  module.exports.getApiNS = function(ns) {
    ns.getAPRS = function(server, args, callback) {
        rxos_config.runTask("getAPRS", function(r) {
        callback(false, r);
        });
    };
  };

  //
  // This is called whenever the HTTP server starts up
  //
  module.exports._onServerStart = function(server, instance, metadata) {
  };

})(require('rxos_config'));

