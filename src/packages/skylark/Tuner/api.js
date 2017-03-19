
(function(skylark_config) {
  'use strict';

  var onddClient;

  function checkPermission(groupName, env, http, resolve, reject) {
    // TODO: Add helper in OS.js instead
    const storage = require(env.SERVERDIR + '/core/storage.js');
    const username = http.session.get('username');
    const groups = storage.get().getGroups(http, username, (groups) => {
      resolve(groups.indexOf(groupName) !== -1);
    }).catch(reject);
  }

  module.exports.api = {
    getTunerConf: function(env, http, resolve, reject, args) {
      checkPermission('admin', env, http, () => {
        skylark_config.getTunerConf((r) => resolve(r));
      }, () => reject('You are not allowed to use this App/API'));
    },

    setTunerConf: function(env, http, resolve, reject, args) {
      checkPermission('admin', env, http, () => {
        skylark_config.setTunerConf(args, (r) => resolve(r));
      }, () => reject('You are not allowed to use this App/API'));
    },

    getOnddStatus2: function(env, http, resolve, reject, args) {
      resolve(onddClient.getStatus());
    }
  };

  module.exports.getApiNS = function(ns) {
    ns.getTunerStatus = function(server, args, callback) {
      callback(false, onddClient.getStatus());
    };
  };

  //
  // This is called whenever the HTTP server starts up
  //
  module.exports.register = function(env, metadata, servers) {
    // ondd/tuner status listener
    skylark_config.getOnddClient(function(ondd) {
      onddClient = ondd;
      onddClient.start();
      console.log('started ondd client');

      // telemetry
      skylark_config.getTelemetryClient( function(telemetryClient) {
        telemetryClient.attachOnddClient(onddClient);
        telemetryClient.start();
        console.log('started telemetry client');
      });
    });
  };

})(require('skylark_config'));

