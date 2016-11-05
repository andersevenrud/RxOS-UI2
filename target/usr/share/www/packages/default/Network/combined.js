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
    scheme.render(this, 'NetconfWindow', root);

    var beams = scheme.find(this, 'Beams');
    var param_table = scheme.find(this, 'BeamParameters');
    var beamsave = scheme.find(this, 'BeamSave');

    app._api('getNetconfConf', null, (function (beams, param_table, beamsave) { return function(err, NetconfConf) {
        var Beams = NetconfConf['beams'];
        var selected = NetconfConf['selectedBeam'];
        var beams_list = Object.keys(Beams).map(function(v) { return Beams[v]; });

        var beamsOnChange = (function (Beams, param_table) { return function(ev) {
            param_table.clear();
            param_table.add( [
                { value: 'label', columns: [ {label: "Region"}, {label: Beams[ev.detail]['label'] } ] },
                { value: 'freq', columns: [ {label: "Frequency"}, {label: Beams[ev.detail]['freq'] } ] },
                { value: 'symbolrate', columns: [ {label: "Symbol Rate"}, {label: Beams[ev.detail]['symbolrate'] } ] }
            ]);
        }}) (Beams, param_table);

        var beamsaveOnClick  = (function (Beams, beams, NetconfConf) { return function() {
            NetconfConf['selectedBeam'] = beams.get('value');
            NetconfConf['beams'] = Beams;
            // TODO: replace "console.log" with alert box
            app._api('setNetconfConf', NetconfConf , console.log);
        }}) (Beams, beams, NetconfConf);

        beams.on('change', beamsOnChange);
        beams.add(beams_list);

        beams.set('value', selected);
        // populate param list on initial load
        beamsOnChange({ detail: beams.get('value')});

        beamsave.on('click', beamsaveOnClick);

        // TODO: add support for custom beam
    }}) (beams, param_table, beamsave));

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
