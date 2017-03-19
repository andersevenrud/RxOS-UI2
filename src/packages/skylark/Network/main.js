(function(DefaultApplication, DefaultApplicationWindow, Application, Window, Utils, API, VFS, GUI) {
  'use strict';

  /////////////////////////////////////////////////////////////////////////////
  // WINDOWS
  /////////////////////////////////////////////////////////////////////////////

  function ApplicationNetconfWindow(app, metadata, scheme) {
    DefaultApplicationWindow.apply(this, ['ApplicationNetconfWindow', {
      icon: metadata.icon,
      title: metadata.name,
      width: 400,
      height: 200
    }, app, scheme]);
  }

  ApplicationNetconfWindow.prototype = Object.create(DefaultApplicationWindow.prototype);
  ApplicationNetconfWindow.constructor = DefaultApplicationWindow.prototype;

  ApplicationNetconfWindow.prototype.init = function(wmRef, app, scheme) {
    var root = DefaultApplicationWindow.prototype.init.apply(this, arguments);

    this._render('NetconfWindow');

    app._api('getNetConf', null, (function (me) { return function(err, netConf) {

        if ( err ) {
                API.error(API._('ERR_GENERIC_APP_FMT', "Network"), API._('ERR_GENERIC_APP_REQUEST'), err);
                return;
        }
        // populate tabs

        // modes tab
        var mode_w = me._find('Mode');
        var modes = netConf['modes'];
        var modes_list = Object.keys(modes).map(function(v) { return modes[v]; });
        mode_w.add(modes_list);

        var selected = netConf['mode'];
        mode_w.set('value', selected);

        // hostname
        me._find('Hostname').set('value', netConf['hostname']);

        // ap tab
        me._find('HotspotName').set('value', netConf['ap']['ssid']);
        me._find('HotspotHide').set('value', netConf['ap']['hidden']);
        me._find('HotspotCountry').add((netConf['ap']['countries']).map(function(v) { return { "value" : v['code'], "label": v['name']}; } ) );
        var selectedCountry = netConf['ap']['selectedCountry'];
        selectedCountry = selectedCountry === null ? "none" : selectedCountry;
        me._find('HotspotCountry').set('value', selectedCountry);
        me._find('HotspotChannel').add((netConf['ap']['channels']).map(function(v) { return { "value" : v, "label": v}; } ) );
        me._find('HotspotChannel').set('value', netConf['ap']['selectedChannel']);
        me._find('HotspotSecurityEnabled').set('value', netConf['ap']['securityEnabled']);
        me._find('HotspotPassword').set('value', netConf['ap']['password']);

        // sta tab
        me._find('SSID').set('value', netConf['sta']['ssid']);
        me._find('SSIDPass').set('value', netConf['sta']['password']);

        // setup saving
        var netsave = me._find('NetSave');

        var netsaveOnClick  = (function (me, netConf) { return function() {
            // mode tab
            netConf['hostname'] = me._find('Hostname').get('value');
            netConf['OuternetPassword'] = me._find('OuternetPassword').get('value');
            netConf['mode'] = me._find('Mode').get('value');

            // ap tab
            netConf['ap']['ssid'] = me._find('HotspotName').get('value');
            netConf['ap']['hidden'] = me._find('HotspotHide').get('value');
            var selectedCountry = me._find('HotspotCountry').get('value');
            netConf['ap']['selectedCountry'] = selectedCountry == "none" ? null : selectedCountry;
            netConf['ap']['selectedChannel'] = me._find('HotspotChannel').get('value');
            netConf['ap']['securityEnabled'] = me._find('HotspotSecurityEnabled').get('value');
            netConf['ap']['password'] = me._find('HotspotPassword').get('value');

            // sta tab
            netConf['sta']['ssid'] = me._find('SSID').get('value');
            netConf['sta']['password'] = me._find('SSIDPass').get('value');

            // TODO: replace "console.log" with alert box
            if ( netConf['ap']['securityEnabled'] && netConf['ap']['password'].length < 8) {
                API.createDialog('Alert', {title: "Access Point", message: "password must have 8 or more characters" }, null, me);
            } else {
                app._api('setNetConf', netConf , console.log);
            }
        }}) (me , netConf);

        netsave.on('click', netsaveOnClick);

    }}) (this));

    return root;
  };

  /////////////////////////////////////////////////////////////////////////////
  // APPLICATION
  /////////////////////////////////////////////////////////////////////////////

  function ApplicationNetconf(args, metadata) {
    DefaultApplication.apply(this, ['ApplicationNetconf', args, metadata, {
      extension: null,
      mime: null,
      filename: null,
      fileypes: null,
      readData: false
    }]);
  }

  ApplicationNetconf.prototype = Object.create(DefaultApplication.prototype);
  ApplicationNetconf.constructor = DefaultApplication;

  ApplicationNetconf.prototype.init = function(settings, metadata, scheme) {
    Application.prototype.init.call(this, settings, metadata, scheme);
    this._addWindow(new ApplicationNetconfWindow(this, metadata, scheme));
  };

  /////////////////////////////////////////////////////////////////////////////
  // EXPORTS
  /////////////////////////////////////////////////////////////////////////////

  OSjs.Applications = OSjs.Applications || {};
  OSjs.Applications.ApplicationNetconf = OSjs.Applications.ApplicationNetconf || {};
  OSjs.Applications.ApplicationNetconf.Class = Object.seal(ApplicationNetconf);

})(OSjs.Helpers.DefaultApplication, OSjs.Helpers.DefaultApplicationWindow, OSjs.Core.Application, OSjs.Core.Window, OSjs.Utils, OSjs.API, OSjs.VFS, OSjs.GUI);
