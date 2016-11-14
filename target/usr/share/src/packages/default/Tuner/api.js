
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
    rxos_config.getOnddStatus(function (s) {
        if (s && s.response && s.response._code == 200 ) {
            rxos_config.getOnddTransfers( function(t) {
                if (t && t.response && t.response._code == 200 && t.response.streams.stream.transfers) {
                    s.response.transfers = t.response.streams.stream.transfers;
                    callback(false, s);
                }
                else
                    callback(true, t);
            });
        } else
            callback(true, r);
    });
  };

  //
  // This is called whenever the HTTP server starts up
  //
  module.exports._onServerStart = function(server, instance, metadata) {
  };

})(require('rxos_config'));

