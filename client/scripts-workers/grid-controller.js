/**
 * @file This is the master file for the web workers that compute the new states
 * of the displayed elements asynchronously.
 * @author Carlos Baraza
 */

import { Grid } from './grid';

var config = {},
    grid;

var _messageHandlers = {
  setConfig: function (data) {
    config = data;
    if (!grid) grid = new Grid(config);
    this.digest();
  },
  digest: function () {
    grid.cull();
    grid.splitChildren();
    grid.mergeChildren();
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
  var msg = JSON.parse(e.data);
  if (_messageHandlers[msg.type]) {
    _messageHandlers[msg.type](msg.data);
  }
};

/**
 * Debug object used in the tests.
 * @type {Object}
 */
export var debug = {
  getConfig: () => config,
  reset: () => grid = new Grid(config)
};
