
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

  var onddClient;

  module.exports.getOnddStatus2 = function(args, callback, request, response) {
    callback(false, onddClient.getStatus());
  };

  //
  // This is called whenever the HTTP server starts up
  //
  module.exports._onServerStart = function(server, instance, metadata) {

    // ondd/tuner status listener
    rxos_config.getOnddClient(function(ondd) {
        onddClient = ondd;
        //onddclient.setStatusCallback(console.log);
        onddClient.start();
        console.log("started ondd client");

        // telemetry
        rxos_config.getTelemetryClient( function(telemetryClient) {
            telemetryClient.attachOnddClient(onddClient);
            telemetryClient.start();
            console.log("started telemetry client");
        });

    });
  };

})(require('rxos_config'));

