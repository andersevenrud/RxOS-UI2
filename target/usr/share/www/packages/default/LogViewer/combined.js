/*!
 * OS.js - JavaScript Cloud/Web Desktop Platform
 *
 * Copyright (c) 2011-2016, Anders Evenrud <andersevenrud@gmail.com>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * @author  Anders Evenrud <andersevenrud@gmail.com>
 * @licence Simplified BSD License
 */
(function(DefaultApplication, DefaultApplicationWindow, Application, Window, Utils, API, VFS, GUI) {
  'use strict';

  /////////////////////////////////////////////////////////////////////////////
  // WINDOWS
  /////////////////////////////////////////////////////////////////////////////

  function ApplicationLogViewerWindow(app, metadata, scheme) {
    DefaultApplicationWindow.apply(this, ['ApplicationLogViewerWindow', {
      icon: metadata.icon,
      title: metadata.name,
      width: 400,
      height: 200
    }, app, scheme]);
  }

  ApplicationLogViewerWindow.prototype = Object.create(DefaultApplicationWindow.prototype);
  ApplicationLogViewerWindow.constructor = DefaultApplicationWindow.prototype;

  ApplicationLogViewerWindow.prototype.init = function(wmRef, app, scheme) {
    var root = DefaultApplicationWindow.prototype.init.apply(this, arguments);
    scheme.render(this, 'LogViewerWindow', root);

    //
    // Side View
    //
    var side = scheme.find(this, 'SideView');
    var txtarea = this._find('Text');
    side.on('activate', function(ev) {
        txtarea.set('value', "Loading...");
        if( ev && ev.detail && ev.detail.entries) {
            var entry = ev.detail.entries[0];
            app._api('test', {'cmd': entry.data[0], 'args': entry.data[1] }, function(err, r) {
                txtarea.set('value', r || '');
            });
        } else {
           txtarea.set('value', "Failed");
        }
    });

    var items = [
        { value: ['cat', [ '/etc/fstab'] ], columns: [ { label: 'fstab'} ] },
        { value: ['dmesg', [] ], columns: [ { label: 'dmesg'} ] },
        { value: ['ip', [ 'addr' ] ], columns: [ { label: 'network'} ] }
    ];

    var side = this._find('SideView');
    side.clear();
    side.add(items);

    return root;
  };

  /////////////////////////////////////////////////////////////////////////////
  // APPLICATION
  /////////////////////////////////////////////////////////////////////////////

  function ApplicationLogViewer(args, metadata) {
    DefaultApplication.apply(this, ['ApplicationLogViewer', args, metadata, {
      extension: null,
      mime: null,
      filename: null,
      fileypes: null,
      readData: false
    }]);
  }

  ApplicationLogViewer.prototype = Object.create(DefaultApplication.prototype);
  ApplicationLogViewer.constructor = DefaultApplication;

  ApplicationLogViewer.prototype.init = function(settings, metadata, scheme) {
    Application.prototype.init.call(this, settings, metadata, scheme);
    this._addWindow(new ApplicationLogViewerWindow(this, metadata, scheme));
  };

  /////////////////////////////////////////////////////////////////////////////
  // EXPORTS
  /////////////////////////////////////////////////////////////////////////////

  OSjs.Applications = OSjs.Applications || {};
  OSjs.Applications.ApplicationLogViewer = OSjs.Applications.ApplicationLogViewer || {};
  OSjs.Applications.ApplicationLogViewer.Class = Object.seal(ApplicationLogViewer);

})(OSjs.Helpers.DefaultApplication, OSjs.Helpers.DefaultApplicationWindow, OSjs.Core.Application, OSjs.Core.Window, OSjs.Utils, OSjs.API, OSjs.VFS, OSjs.GUI);
