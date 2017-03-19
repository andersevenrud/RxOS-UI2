
(function(skylark_config) {
  'use strict';

  module.exports.api = {
    runTask:function(env, http, resolve, reject, args) {
      skylark_config.runTask(args, function(r) {
        resolve(r);
      });
    }
  };

})(require('skylark_config'));

