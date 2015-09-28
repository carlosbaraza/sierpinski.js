/**
 * @file Module that handles the grid web worker in the main thread.
 * @description Initialise the sierpinski triangle web worker.
 * @module grid
 */

import * as draw from './lib/draw';
import { renderer, stage } from './stage';

cacheChildren(3000);

var worker = createGridWorker();

/** Current initial configuration for the worker */
var config = {
  canvasWidth: renderer.view.width,
  canvasHeight: renderer.view.height,
};
setConfig(config);

export { worker, setConfig };


/******************************************************************************/
// Hoisted functions
/******************************************************************************/

/**
 * Create some graphic elements that will be moved, scaled and showed or hidden
 * as needed. This reduces the amount of calculations in the main thread during
 * the animation loop, improving the UX.
 * @param  {Number} number=3000 - Number of children to be cached. This will be
 * the maximum of elements in the screen at the same time.
 */
function cacheChildren(number = 3000) {
  for (var i = 0; i < number; i++) {
    stage.addChild( draw.sierpinskiTriangle({base: 200, visible: false}) );
  }
}

/**
 * Cast the grid worker, loading the bundled worker script.
 * @return {Worker} Grid worker already set up with current configuration.
 */
function createGridWorker() {
  var _worker = new Worker('/dist/client/scripts/grid-worker.js');

  _worker.onmessage = function (e) {
    var msg = JSON.parse(e.data);
    if (_workerMessageHandlers[msg.type]) {
      _workerMessageHandlers[msg.type](msg.data);
    }
  };

  return _worker;
}

/**
 * Holds the different handlers for the messages coming from the workers. It is
 * not actually hoisted but by the time the workers post a message, the file
 * would already be run entirely.
 * @type {Object}
 */
var _workerMessageHandlers = {
  update: function (data) {
    _.each(stage.children, (graphics) => graphics.visible = false);
    for (var i = 0; i < data.length; i++) {
      stage.children[i].x = data[i].x;
      stage.children[i].y = data[i].y;
      stage.children[i].width = data[i].width;
      stage.children[i].height = data[i].height;
      stage.children[i].visible = data[i].visible;
    }
  }
};

/**
 * Exported configuration method. This could be used to communicate with the
 * the worker and update the configuration of the canvas and the stage. Common
 * case is updating the scale and position properties with the current ones of
 * the Stage.
 * @param {Object} config - Object witht he configuration. See
 * {@link Grid.setConfig}.
 * @see {@link Grid.setConfig}
 */
function setConfig(config) {
  worker.postMessage(JSON.stringify({ type: 'setConfig', data: config }));
}
