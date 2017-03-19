
(function(skylark_config) {
  'use strict';

  module.exports.api = {
    runTask: function(env, http, resolve, reject, args) {
      skylark_config.runTask(args, function(r) {
        resolve(r);
      });
    }
  };

  module.exports.getApiNS = function(ns) {
    ns.whatsNew = function(server, args, callback) {
      skylark_config.runTask('whatsNew', function(r) {
        callback(false, r);
      });
    };
  };

})(require('skylark_config'));

