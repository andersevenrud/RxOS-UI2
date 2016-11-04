(function(DefaultApplication, DefaultApplicationWindow, Application, Window, Utils, API, VFS, GUI) {
  'use strict';

  /////////////////////////////////////////////////////////////////////////////
  // WINDOWS
  /////////////////////////////////////////////////////////////////////////////

  function ApplicationTunerWindow(app, metadata, scheme) {
    DefaultApplicationWindow.apply(this, ['ApplicationTunerWindow', {
      icon: metadata.icon,
      title: metadata.name,
      width: 400,
      height: 200
    }, app, scheme]);
  }

  ApplicationTunerWindow.prototype = Object.create(DefaultApplicationWindow.prototype);
  ApplicationTunerWindow.constructor = DefaultApplicationWindow.prototype;

  ApplicationTunerWindow.prototype.init = function(wmRef, app, scheme) {
    var root = DefaultApplicationWindow.prototype.init.apply(this, arguments);
    scheme.render(this, 'TunerWindow', root);

    var beams = scheme.find(this, 'Beams');
    var param_table = scheme.find(this, 'BeamParameters');
    var beamsave = scheme.find(this, 'BeamSave');

    app._api('getTunerConf', null, (function (beams, param_table, beamsave) { return function(err, TunerConf) {
        var Beams = TunerConf['beams'];
        var selected = TunerConf['selectedBeam'];
        var beams_list = Object.keys(Beams).map(function(v) { return Beams[v]; });

        var beamsOnChange = (function (Beams, param_table) { return function(ev) {
            param_table.clear();
            param_table.add( [
                { value: 'label', columns: [ {label: "Region"}, {label: Beams[ev.detail]['label'] } ] },
                { value: 'freq', columns: [ {label: "Frequency"}, {label: Beams[ev.detail]['freq'] } ] },
                { value: 'symbolrate', columns: [ {label: "Symbol Rate"}, {label: Beams[ev.detail]['symbolrate'] } ] }
            ]);
        }}) (Beams, param_table);

        var beamsaveOnClick  = (function (Beams, beams, TunerConf) { return function() {
            TunerConf['selectedBeam'] = beams.get('value');
            TunerConf['beams'] = Beams;
            // TODO: replace "console.log" with alert box
            app._api('setTunerConf', TunerConf , console.log);
        }}) (Beams, beams, TunerConf);

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

  function ApplicationTuner(args, metadata) {
    DefaultApplication.apply(this, ['ApplicationTuner', args, metadata, {
      extension: null,
      mime: null,
      filename: null,
      fileypes: null,
      readData: false
    }]);
  }

  ApplicationTuner.prototype = Object.create(DefaultApplication.prototype);
  ApplicationTuner.constructor = DefaultApplication;

  ApplicationTuner.prototype.init = function(settings, metadata, scheme) {
    Application.prototype.init.call(this, settings, metadata, scheme);
    this._addWindow(new ApplicationTunerWindow(this, metadata, scheme));
  };

  /////////////////////////////////////////////////////////////////////////////
  // EXPORTS
  /////////////////////////////////////////////////////////////////////////////

  OSjs.Applications = OSjs.Applications || {};
  OSjs.Applications.ApplicationTuner = OSjs.Applications.ApplicationTuner || {};
  OSjs.Applications.ApplicationTuner.Class = Object.seal(ApplicationTuner);

})(OSjs.Helpers.DefaultApplication, OSjs.Helpers.DefaultApplicationWindow, OSjs.Core.Application, OSjs.Core.Window, OSjs.Utils, OSjs.API, OSjs.VFS, OSjs.GUI);
