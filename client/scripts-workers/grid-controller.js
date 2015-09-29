/**
 * @file This is the master file for the web workers that compute the new states
 * of the displayed elements asynchronously.
 * @author Carlos Baraza
 * @module workers/grid-controller
 */

import { Grid } from './grid';

var grid;

var _messageHandlers = {
  setConfig: function (config) {
    if (!grid) {
      grid = new Grid(config);
    } else {
      grid.setConfig(config);
    }
    this.digest();
  },
  digest: function () {
    grid.cull();
    grid.mergeChildren();
    grid.splitChildren();
    var msg = { type: 'update', data: grid.getChildrenVisibleFlatten() };
    postMessage(JSON.stringify(msg));
  }
};

/**
 * Web Worker eventhandler.
 * @param  {MessageEvent} e - Event object
 * @param  {MessageEvent} e.data - Message sent from main thread to workers
 */
onmessage = function (e) {
  var msg = e.data && JSON.parse(e.data);
  if (_messageHandlers[msg.type]) {
    _messageHandlers[msg.type](msg.data);
  }
};

/**
 * Debug object used in the tests.
 * @type {Object}
 */
export var debug = {
  getConfig: () => grid._config,
  reset: () => grid = null
};
