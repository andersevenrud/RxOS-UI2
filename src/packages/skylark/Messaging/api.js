
(function(skylark_config) {
  'use strict';

  module.exports.api = {

    runTask: function(env, http, resolve, reject, args) {
      skylark_config.runTask(args, function(r) {
        resolve(r);
      });
    },

    getApiNS: function(ns) {
      ns.getAPRS = function(server, args, callback) {
        skylark_config.runTask('getAPRS', function(r) {
          callback(false, r);
        });
      };
    }
  };

})(require('skylark_config'));

