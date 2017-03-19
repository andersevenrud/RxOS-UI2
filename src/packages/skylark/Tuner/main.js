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

    this.statusInterval = null;
  }

  ApplicationTunerWindow.prototype = Object.create(DefaultApplicationWindow.prototype);
  ApplicationTunerWindow.constructor = DefaultApplicationWindow.prototype;

  ApplicationTunerWindow.prototype.destroy = function() {
    this.statusInterval = clearInterval(this.statusInterval);
    return DefaultApplicationWindow.prototype.destroy.apply(this, arguments);
  };

  ApplicationTunerWindow.prototype.init = function(wmRef, app, scheme) {
    var self = this;
    var root = DefaultApplicationWindow.prototype.init.apply(this, arguments);
    this._render('TunerWindow');

    var beams = this._find('Beams');
    var param_table = this._find('BeamParameters');
    var beamsave = this._find('BeamSave');

    var tunerstatus = this._find("Status");


    this.statusInterval = setInterval(function() {

      app._api('getOnddStatus2', null, function (err, onddStatus) {
        if(!err) {
          if(onddStatus) {
            tunerstatus.clear();
            tunerstatus.add( [
                { columns: [ {label: "SNR (dB)"}, {label: '' + onddStatus.snr} ] },
                { columns: [ {label: "Lock"}, {label: onddStatus.lock? "yes" : "no" } ] },
                { columns: [ {label: "Rssi (dBm) "}, {label: '' + onddStatus.rssi} ] },
                { columns: [ {label: "APkMn Ratio"}, {label: '' + onddStatus.alg_pk_mn} ] },
                { columns: [ {label: "Frequency (MHz)"}, {label: '' + onddStatus.freq} ] },
                { columns: [ {label: "Freq Offset (Hz)"}, {label: '' + onddStatus.freq_offset} ] },
                { columns: [ {label: "Symbol Error Rate (SER)"}, {label: '' + onddStatus.ser} ] },
                { columns: [ {label: "Packets received"}, {label: '' + (onddStatus.crc_ok + onddStatus.crc_err) } ] },
                { columns: [ {label: "Valid packets"}, {label: '' + onddStatus.crc_ok} ] },
                { columns: [ {label: "Valid packets %"}, {label: '' + Math.round(100*onddStatus.crc_ok/ (onddStatus.crc_ok + onddStatus.crc_err)) } ] },
                { columns: [ {label: "Packet Error Rate (PER)"}, {label: '' + Math.round(1000*onddStatus.crc_err/ (onddStatus.crc_ok + onddStatus.crc_err))/1000 } ] },
                { columns: [
                    {label: "Lock State"},
                    {   label: [ "Search", "Signal Detect", "Const Lock", "Code Lock", "Frame Lock" ] [onddStatus.state] }
                ] },
                { columns: [ {label: "Transfers:"}, {label: ""} ] }
            ] );
            onddStatus.transfers.forEach(function(v) {
                if (v.path) {
                    var s = Math.round(100*v.block_received/v.block_count) + "%";
                    if (v.complete) s = "Complete";
                    tunerstatus.add([ { columns: [ {label: v.path}, {label: s} ] } ] );
                }
            });
          }
        } else
            clearInterval(self.statusInterval);
      });

    }, 1000);

    app._api('getTunerConf', null, (function (beams, param_table, beamsave) { return function(err, TunerConf) {

        if ( err ) {
                API.error(API._('ERR_GENERIC_APP_FMT', "Tuner"), API._('ERR_GENERIC_APP_REQUEST'), err);
                return;
        }

        var Beams = TunerConf.beams;
        var selected = TunerConf.selectedBeam;
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
            TunerConf.selectedBeam = beams.get('value');
            TunerConf.beams = Beams;
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
