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


    var Beams = {
        apac: { label: "Asia Pacific (144E)", value: "apac", freq: "1545.9525", symbolrate: "4200",
                ondd_l: {  'preset': 2, 'frequency': '1545.9525', 'uncertainty': '4000', 'symbolrate': '4200',
                            'sample_rate': '1', 'rf_filter': '20', 'descrambler': true }
        },
        emea: { label: "Europe, West Asia, Africa (25E)", value: "emea", freq: "1545.94", symbolrate: "4200",
                ondd_l: {  'preset': 1, 'frequency': '1545.94', 'uncertainty': '4000', 'symbolrate': '4200',
                            'sample_rate': '1', 'rf_filter': '20', 'descrambler': true }
        },
        americas: { label: "Americas (98W)", value: "americas", freq: "1539.8725", symbolrate: "4200",
                ondd_l: {  'preset': 3, 'frequency': '1539.8725', 'uncertainty': '4000', 'symbolrate': '4200',
                            'sample_rate': '1', 'rf_filter': '20', 'descrambler': true }
        },
        custom: { label: "Custom", value: "custom", freq: "1545.94", symbolrate: "8400",
                ondd_l: {  'preset': 0, 'frequency': '1545.9525', 'uncertainty': '4000', 'symbolrate': '4200',
                            'sample_rate': '1', 'rf_filter': '20', 'descrambler': true }
        }
    };

    var beams_list = Object.keys(Beams).map(function(v) { return Beams[v]; });
    var beams = scheme.find(this, 'Beams');
    var param_table = scheme.find(this, 'BeamParameters');
    var beamsOnChange = (function (Beams) { return function(ev) {
        param_table.clear();
        param_table.add( [
            { value: 'label', columns: [ {label: "Region"}, {label: Beams[ev.detail]['label'] } ] },
            { value: 'freq', columns: [ {label: "Frequency"}, {label: Beams[ev.detail]['freq'] } ] },
            { value: 'symbolrate', columns: [ {label: "Symbol Rate"}, {label: Beams[ev.detail]['symbolrate'] } ] }
        ]);
    }}) (Beams);
    beams.on('change', beamsOnChange);
    beams.add(beams_list);
    beamsOnChange({ detail: beams.get('value')});


    var beamsave = scheme.find(this, 'BeamSave');
    beamsave.on('click', (function (Beams, beams) { return function() {
        app._api('setTunerConf', Beams[beams.get('value')]['ondd_l'], console.log);
    }}) (Beams, beams));

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
