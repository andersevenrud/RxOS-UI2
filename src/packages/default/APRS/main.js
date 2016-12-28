(function(DefaultApplication, DefaultApplicationWindow, Application, Window, Utils, API, VFS, GUI) {
  'use strict';

  /////////////////////////////////////////////////////////////////////////////
  // WINDOWS
  /////////////////////////////////////////////////////////////////////////////

  function ApplicationAPRSViewerWindow(app, metadata, scheme) {
    DefaultApplicationWindow.apply(this, ['ApplicationAPRSViewerWindow', {
      icon: metadata.icon,
      title: metadata.name,
      width: 400,
      height: 200
    }, app, scheme]);

    this.updateInterval = null;
  }

  ApplicationAPRSViewerWindow.prototype = Object.create(DefaultApplicationWindow.prototype);
  ApplicationAPRSViewerWindow.constructor = DefaultApplicationWindow.prototype;

  ApplicationAPRSViewerWindow.prototype.destroy = function() {
    this.updateInterval = clearInterval(this.updateInterval);
    return DefaultApplicationWindow.prototype.destroy.apply(this, arguments);
  };

  ApplicationAPRSViewerWindow.prototype.init = function(wmRef, app, scheme) {
    var root = DefaultApplicationWindow.prototype.init.apply(this, arguments);
    scheme.render(this, 'APRSViewerWindow', root);

    var txtarea = this._find('Text');
    var populate = function () {
        app._api('runTask', 'getAPRS', function(err, r) {
            if (!err) txtarea.set('value', r);
        });
    };

    populate();
    this.updateInterval = setInterval(populate, 60000);

    return root;
  };

  /////////////////////////////////////////////////////////////////////////////
  // APPLICATION
  /////////////////////////////////////////////////////////////////////////////

  function ApplicationAPRSViewer(args, metadata) {
    DefaultApplication.apply(this, ['ApplicationAPRSViewer', args, metadata, {
      extension: null,
      mime: null,
      filename: null,
      fileypes: null,
      readData: false
    }]);
  }

  ApplicationAPRSViewer.prototype = Object.create(DefaultApplication.prototype);
  ApplicationAPRSViewer.constructor = DefaultApplication;

  ApplicationAPRSViewer.prototype.init = function(settings, metadata, scheme) {
    Application.prototype.init.call(this, settings, metadata, scheme);
    this._addWindow(new ApplicationAPRSViewerWindow(this, metadata, scheme));
  };

  /////////////////////////////////////////////////////////////////////////////
  // EXPORTS
  /////////////////////////////////////////////////////////////////////////////

  OSjs.Applications = OSjs.Applications || {};
  OSjs.Applications.ApplicationAPRSViewer = OSjs.Applications.ApplicationAPRSViewer || {};
  OSjs.Applications.ApplicationAPRSViewer.Class = Object.seal(ApplicationAPRSViewer);

})(OSjs.Helpers.DefaultApplication, OSjs.Helpers.DefaultApplicationWindow, OSjs.Core.Application, OSjs.Core.Window, OSjs.Utils, OSjs.API, OSjs.VFS, OSjs.GUI);
