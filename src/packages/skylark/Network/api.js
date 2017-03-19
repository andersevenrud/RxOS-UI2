
(function(skylark_config) {
  'use strict';

  function checkPermission(groupName, env, http, resolve, reject) {
    // TODO: Add helper in OS.js instead
    const storage = require(env.SERVERDIR + '/core/storage.js');
    const username = http.session.get('username');
    const groups = storage.get().getGroups(http, username, (groups) => {
      resolve(groups.indexOf(groupName) !== -1);
    }).catch(reject);
  }

  module.exports.api = {
    getNetConf: function(env, http, resolve, reject, args) {
      checkPermission('admin', env, http, () => {
        skylark_config.getNetConf((r) => resolve(r));
      }, () => reject('You are not allowed to use this App/API'));
    },

    setNetConf: function(env, http, resolve, reject, args) {
      checkPermission('admin', env, http, () => {
        skylark_config.setNetConf(args, (r) => resolve(r));
      }, () => reject('You are not allowed to use this App/API'));
    }
  };

})(require('skylark_config'));

